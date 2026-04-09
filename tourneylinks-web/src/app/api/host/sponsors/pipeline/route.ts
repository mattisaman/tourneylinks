import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sponsor_leads } from '@/lib/db';
import { eq, and } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const searchParams = req.nextUrl.searchParams;
    const tournamentId = searchParams.get('tournamentId');

    if (!tournamentId) {
      return NextResponse.json({ error: 'Missing tournamentId' }, { status: 400 });
    }

    const leads = await db.select().from(sponsor_leads).where(eq(sponsor_leads.tournamentId, parseInt(tournamentId)));
    return NextResponse.json({ leads });
  } catch (error) {
    console.error('Failed to fetch sponsor leads:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { tournamentId, companyName, contactName, contactEmail, contactPhone, expectedValue, status = 'TO_CONTACT' } = body;

    if (!tournamentId || !companyName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const [newLead] = await db.insert(sponsor_leads).values({
      tournamentId: parseInt(tournamentId),
      companyName,
      contactName,
      contactEmail,
      contactPhone,
      expectedValue: expectedValue ? parseInt(expectedValue) : null,
      status,
    }).returning();

    return NextResponse.json({ lead: newLead });
  } catch (error) {
    console.error('Failed to create sponsor lead:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    // Support partial updates (status, notes, etc.)
    const { id, ...updateFields } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing lead id' }, { status: 400 });
    }

    const [updatedLead] = await db.update(sponsor_leads)
      .set({
        ...updateFields,
        updatedAt: new Date()
      })
      .where(eq(sponsor_leads.id, parseInt(id)))
      .returning();

    return NextResponse.json({ lead: updatedLead });
  } catch (error) {
    console.error('Failed to update sponsor lead:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing lead id' }, { status: 400 });
    }

    await db.delete(sponsor_leads).where(eq(sponsor_leads.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete sponsor lead:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
