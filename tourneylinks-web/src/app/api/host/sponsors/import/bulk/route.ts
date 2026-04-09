import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sponsor_leads } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { tournamentId, leads } = body;

    if (!tournamentId || !leads || !Array.isArray(leads) || leads.length === 0) {
      return NextResponse.json({ error: 'Missing required configuration for bulk drop' }, { status: 400 });
    }

    // Map AI JSON outputs into strict Database Rows
    const payload = leads.map(lead => ({
      tournamentId: parseInt(tournamentId),
      companyName: lead.companyName,
      contactName: lead.contactName || null,
      expectedValue: lead.expectedValue ? parseInt(lead.expectedValue) : null,
      status: 'TO_CONTACT',
      // Provide a default icon for bulk pushes to blend seamlessly with UI expectations
      companyLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png'
    }));

    const insertedLeads = await db.insert(sponsor_leads).values(payload).returning();

    return NextResponse.json({ leads: insertedLeads, success: true });
  } catch (error) {
    console.error('Failed to bulk drop leads:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
