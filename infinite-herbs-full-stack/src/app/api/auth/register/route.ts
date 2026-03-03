import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { RolesTypes } from '@/types/role';
import { RegisterResponse } from '@/types/api/auth';

const RegisterSchema = z.object({
  firstName: z.string().min(2) ,
  lastName: z.string().min(2) ,
  email: z.email() ,
  userName: z.string().min(3) ,
  password: z.string().min(6) ,
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = RegisterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({message: 'Invalid payload' , issues: parsed.error.issues} , {status: 400});
  }

  const {firstName , lastName , email , userName , password} = parsed.data;

  const existing = await prisma.user.findFirst({
    where: {OR: [{email} , {userName}]} ,
    select: {email: true , userName: true} ,
  });

  if (existing) {
    const field =
        existing.email === email ? 'Email' : 'Username';
    return NextResponse.json(
        {message: `${field} already in use`} ,
        {status: 409}
    );
  }

  const hashed = await bcrypt.hash(password , 12);

  const roleUser = await prisma.role.findUnique({where: {name: RolesTypes.USER} , include: {permissions: true}});

  const user = await prisma.user.create({
    data: {firstName , lastName , email , userName , password: hashed , role: {connect: {id: roleUser!.id}}} ,
    select: {
      id: true ,
      firstName: true ,
      lastName: true ,
      email: true ,
      userName: true ,
      role: {select: {id: true , name: true}} ,
      isActive: true ,
      createdAt: true
    } ,
  });

  const registerResponse: RegisterResponse = {
    user: {
      id: user.id ,
      firstName: user.firstName ,
      lastName: user.lastName ,
      email: user.email ,
      isActive: user.isActive ,
      role: {
        id: user.role.id ,
        name: user.role.name ,
        permissions: roleUser!.permissions.map(
            (p) => (
                {id: p.id , name: p.key}
            )
        ) ,
      }
    } ,
  };

  return NextResponse.json(registerResponse , {status: 201});
}