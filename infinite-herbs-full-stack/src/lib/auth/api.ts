import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { Role } from '@/types/api/user';

const TOKEN_EXPIRES = '30m';
const TOKEN_REFRESH_EXPIRES = '1d';

const JWT_SECRET = process.env.JWT_SECRET!;

export function signAccessToken(payload: { sub: string; firstName: string; lastName: string; role: Role }) {
  return jwt.sign(payload , JWT_SECRET , {expiresIn: TOKEN_EXPIRES});
}

export function signRefreshToken(payload: { sub: string }) {
  return jwt.sign(payload , JWT_SECRET , {expiresIn: TOKEN_REFRESH_EXPIRES});
}

export async function setAuthCookies(accessToken: string , refreshToken?: string) {
  const store = await cookies();
  store.set('accessToken' , accessToken , {
    httpOnly: true ,
    secure: true ,
    sameSite: 'lax' ,
    path: '/' ,
  });
  if (refreshToken) {
    store.set('refreshToken' , refreshToken , {
      httpOnly: true ,
      secure: true ,
      sameSite: 'lax' ,
      path: '/' ,
    });
  }
}

export async function clearAuthCookies() {
  const store = await cookies();
  store.set('accessToken' , '' , {httpOnly: true , secure: true , sameSite: 'lax' , path: '/' , maxAge: 0});
  store.set('refreshToken' , '' , {httpOnly: true , secure: true , sameSite: 'lax' , path: '/' , maxAge: 0});
}

export async function getUserFromRequestCookie(): Promise<{ sub: string; role: Role } | null> {
  const _cookies = await cookies();
  const token = _cookies.get('accessToken')?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token , JWT_SECRET) as any;
    return {sub: decoded.sub , role: decoded.role};
  } catch {
    return null;
  }
}
