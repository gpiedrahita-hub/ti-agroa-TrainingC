import { NextResponse } from 'next/server';
import { getUserFromRequestCookie } from '@/lib/auth/api';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getUserFromRequestCookie();
  if (!session) return NextResponse.json({message: 'Unauthorized'} , {status: 401});
  const id = session.sub;
  const user = await prisma.user.findUnique({
    where: {id} ,
    select: {
      id: true ,
      firstName: true ,
      lastName: true ,
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