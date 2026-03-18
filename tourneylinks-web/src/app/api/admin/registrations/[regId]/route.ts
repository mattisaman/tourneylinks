import { NextResponse } from 'next/server';
import { db, registrations } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function PATCH(
  request: Request,
  props: { params: Promise<{ regId: string }> | { regId: string } }
) {
  try {
    const rawParams = await props.params;
    const regId = parseInt(rawParams.regId, 10);
    
    if (isNaN(regId)) {
      return NextResponse.json({ error: 'Invalid registration ID' }, { status: 400 });
    }

    const body = await request.json();
    const assignedTeam = body.assignedTeam === null ? null : parseInt(body.assignedTeam, 10);

    await db.update(registrations)
      .set({ assignedTeam })
      .where(eq(registrations.id, regId));

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Manual flight override error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
