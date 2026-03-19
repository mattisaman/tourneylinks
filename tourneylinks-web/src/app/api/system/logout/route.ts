import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  // Hard delete the Super Admin session edge cookie
  const cookieStore = await cookies();
  cookieStore.set({
    name: 'super_admin_session',
    value: '',
    expires: new Date(0),
    path: '/system'
  });

  // Parse the origin URL to safely route them back to the public homepage
  const url = new URL('/', request.url);
  return NextResponse.redirect(url);
}
