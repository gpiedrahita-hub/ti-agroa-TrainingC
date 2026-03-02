import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { getUserFromRequestCookie } from '@/lib/auth/api';
import { RolesTypes } from '@/types/role';

const CreateUserSchema = z.object({
  firstName: z.string().min(2) ,
  lastName: z.string().min(2) ,
  email: z.email() ,
  userName: z.string().min(3) ,
  password: z.string().min(6) ,
  isActive: z.boolean().default(false) ,
  role: z.string().optional() ,
});

export async function GET() {
  const session = await getUserFromRequestCookie();
  if (!session) return NextResponse.json({message: 'Unauthorized'} , {status: 401});
  if (session.role.name !== RolesTypes.ADMIN && session.role.name !== RolesTypes.VIEWER) return NextResponse.json({message: 'Forbidden'} , {status: 403});

  const users = await prisma.user.findMany({
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
    orderBy: {createdAt: 'desc'} ,
  });

  return NextResponse.json(users , {status: 200});
}

export async function POST(request: Request) {
  const session = await getUserFromRequestCookie();
  if (!session) return NextResponse.json({message: 'Unauthorized'} , {status: 401});
  if (session.role.name !== RolesTypes.ADMIN) return NextResponse.json({message: 'Forbidden'} , {status: 403});

  const body = await request.json();
  const parsed = CreateUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({message: 'Invalid payload' , issues: parsed.error.issues} , {status: 400});
  }

  const {firstName , lastName , email , userName , password , isActive , role} = parsed.data;

  const userExisting = await prisma.user.findFirst({
    where: {OR: [{email} , {userName}]} ,
    select: {email: true , userName: true} ,
  });

  if (userExisting) {
    const field =
        userExisting.email === email ? 'Email' : 'Username';
    return NextResponse.json(
        {message: `${field} already in use`} ,
        {status: 409}
    );
  }

  const hashed = await bcrypt.hash(password , 12);

  const foundRole = await prisma.role.findUnique({where: {name: role}});

  const user = await prisma.user.create({
    data: {
      firstName ,
      lastName ,
      email ,
      userName ,
      password: hashed ,
      isActive ,
      role: {connect: {id: foundRole!.id}}
    } ,
    select: {
      id: true ,
      firstName: true ,
      lastName: true ,
      email: true ,
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

  return NextResponse.json({user} , {status: 201});
}