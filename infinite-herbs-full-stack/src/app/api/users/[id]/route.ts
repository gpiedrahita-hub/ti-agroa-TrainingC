import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { getUserFromRequestCookie } from '@/lib/auth/api';
import { RolesTypes } from '@/types/role';

const UpdateUserSchema = z.object({
  firstName: z.string().min(2) ,
  lastName: z.string().min(2) ,
  email: z.email().optional() ,
  userName: z.string().min(3) ,
  password: z.string().min(6).optional() ,
  role: z.string().optional() ,
  isActive: z.boolean().optional() ,
});

export async function GET(_: Request , ctx: { params: Promise<{ id: string }> }) {
  const session = await getUserFromRequestCookie();
  if (!session) return NextResponse.json({message: 'Unauthorized'} , {status: 401});

  const {id} = await ctx.params;

  const canRead = session.role.name === RolesTypes.ADMIN || session.sub === id;
  if (!canRead) return NextResponse.json({message: 'Forbidden'} , {status: 403});

  const user = await prisma.user.findUnique({
    where: {id} ,
    select: {
      id: true ,
      firstName: true ,
      lastName: true ,
      email: true ,
      userName: true ,
      isActive: true ,
      role: {
        select: {
          id: true ,
          name: true ,
          permissions: {
            select: {
              id: true ,
              key: true
            }
          }
        }
      } ,
      createdAt: true
    } ,
  });

  if (!user) return NextResponse.json({message: 'Not found'} , {status: 404});
  return NextResponse.json(user , {status: 200});
}

export async function PATCH(request: Request , ctx: { params: Promise<{ id: string }> }) {
  const session = await getUserFromRequestCookie();
  if (!session) return NextResponse.json({message: 'Unauthorized'} , {status: 401});

  const {id} = await ctx.params;
  const body = await request.json();
  const parsed = UpdateUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({message: 'Invalid payload' , issues: parsed.error.issues} , {status: 400});
  }

  const isAdmin = session.role.name === RolesTypes.ADMIN;
  const isSelf = session.sub === id;
  if (!isAdmin && !isSelf) return NextResponse.json({message: 'Forbidden'} , {status: 403});

  let data: any = {...parsed.data};

  if (!isAdmin) {
    delete data.role;
  }

  if (data.password) {
    data.password = await bcrypt.hash(data.password , 12);
  }

  if (data.role) {
    const foundRole = await prisma.role.findUnique({where: {name: data.role}});
    data = {...data , role: {connect: {id: foundRole!.id}}};
  }

  try {
    const user = await prisma.user.update({
      where: {id} ,
      data ,
      select: {
        id: true ,
        firstName: true ,
        lastName: true ,
        email: true ,
        userName: true ,
        isActive: true ,
        role: {
          select: {
            id: true ,
            name: true ,
            permissions: {
              select: {
                id: true ,
                key: true
              }
            }
          }
        } ,
        createdAt: true
      } ,
    });
    return NextResponse.json(user , {status: 200});
  } catch {
    return NextResponse.json({message: 'Not found'} , {status: 404});
  }
}

export async function DELETE(_: Request , ctx: { params: Promise<{ id: string }> }) {
  const session = await getUserFromRequestCookie();
  if (!session) return NextResponse.json({message: 'Unauthorized'} , {status: 401});
  if (session.role.name !== RolesTypes.ADMIN) return NextResponse.json({message: 'Forbidden'} , {status: 403});

  const {id} = await ctx.params;

  try {
    await prisma.user.delete({where: {id}});
    return NextResponse.json({ok: true} , {status: 200});
  } catch {
    return NextResponse.json({message: 'Not found'} , {status: 404});
  }
}