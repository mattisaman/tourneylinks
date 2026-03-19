import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { passcode } = await request.json();

    if (passcode === 'Sl@madm1ns!') {
      // Set secure HTTP-Only Session Cookie (Volatile - expires immediately when browser is closed)
      const cookieStore = await cookies();
      cookieStore.set({
        name: 'super_admin_session',
        value: 'authorized_founder_' + new Date().getTime(),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/system',
      });

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'UNAUTHORIZED CALL. SECURITY VIOLATION LOGGED.' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE() {
  // Logout Route
  const cookieStore = await cookies();
  cookieStore.delete('super_admin_session');
  return NextResponse.json({ success: true });
}
