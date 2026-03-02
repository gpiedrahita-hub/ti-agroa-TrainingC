import { NextResponse } from 'next/server';
import { clearAuthCookies } from '@/lib/auth/api';

export async function POST() {
  await clearAuthCookies();
  return NextResponse.json({ok: true} , {status: 200});
}