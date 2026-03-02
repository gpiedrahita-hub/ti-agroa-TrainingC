import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { setAuthCookies , signAccessToken , signRefreshToken } from '@/lib/auth/api';
import { Role } from '@/types/api/user';
import { LoginResponse } from '@/types/api/auth';

const LoginSchema = z.object({
  userName: z.string().min(3) ,
  password: z.string().min(6) ,
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({message: 'Invalid payload' , issues: parsed.error.issues} , {status: 400});
  }

  const {userName , password} = parsed.data;

  const user = await prisma.user.findUnique({
    where: {userName: userName} ,
    include: {
      role: {
        include: {
          permissions: true
        }
      }
    }
  });

  if (!user) return NextResponse.json({message: 'Invalid credentials'} , {status: 401});

  const ok = await bcrypt.compare(password , user.password);
  if (!ok) return NextResponse.json({message: 'Invalid credentials'} , {status: 401});

  if (!user.isActive) return NextResponse.json({message: 'User is inactive'} , {status: 403});

  const role = user?.role;
  const userRole: Role = {
    id: role.id ,
    name: role.name ,
    permissions: role.permissions.map(
        (p) => (
            {id: p.id , name: p.key}
        )
    ) ,
  };

  const accessToken = signAccessToken({
    sub: user.id ,
    firstName: user.firstName ,
    lastName: user.lastName ,
    role: userRole
  });
  const refreshToken = signRefreshToken({sub: user.id});

  await setAuthCookies(accessToken , refreshToken);

  const loginResponse: LoginResponse = {
    user: {
      id: user.id ,
      firstName: user.firstName ,
      lastName: user.lastName ,
      email: user.email ,
      role: userRole
    } ,
  };

  return NextResponse.json(loginResponse , {status: 200});
}
