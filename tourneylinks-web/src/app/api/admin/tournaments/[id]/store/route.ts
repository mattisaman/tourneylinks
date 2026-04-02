import { NextRequest, NextResponse } from 'next/server';
import { db, store_inventory, tournaments } from '@/lib/db';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth-util';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
     const resolvedParams = await params;
     const tournamentId = parseInt(resolvedParams.id);
     
     if (isNaN(tournamentId)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

     const items = await db.select()
        .from(store_inventory)
        .where(eq(store_inventory.tournamentId, tournamentId));

     return NextResponse.json(items);
  } catch(err: any) {
     return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
     const clerkUser = await getCurrentUser();
     if (!clerkUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

     const resolvedParams = await params;
     const tournamentId = parseInt(resolvedParams.id);
     
     if (isNaN(tournamentId)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

     const body = await req.json();
     
     await db.insert(store_inventory).values({
        tournamentId,
        title: body.title,
        price: body.price, // cents
        maxPerPlayer: body.maxPerPlayer || null,
     });

     return NextResponse.json({ success: true });
  } catch(err: any) {
     return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
     const clerkUser = await getCurrentUser();
     if (!clerkUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

     const resolvedParams = await params;
     const tournamentId = parseInt(resolvedParams.id);

     const url = new URL(req.url);
     const itemId = parseInt(url.searchParams.get('itemId') || '');
     
     if (isNaN(itemId)) return NextResponse.json({ error: 'Invalid Store Item ID' }, { status: 400 });

     await db.delete(store_inventory)
        .where(and(eq(store_inventory.id, itemId), eq(store_inventory.tournamentId, tournamentId)));

     return NextResponse.json({ success: true });
  } catch(err: any) {
     return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
