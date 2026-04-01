import { NextRequest, NextResponse } from 'next/server';
import { db, beverage_orders } from '@/lib/db';
import { eq, and } from 'drizzle-orm';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const tournamentId = parseInt(id);
        const { registrationId, latitude, longitude } = await req.json();

        // Prevent spam - if they already ordered, just update their physical coordinates
        const existingOrder = await db.select().from(beverage_orders).where(and(
             eq(beverage_orders.tournamentId, tournamentId),
             eq(beverage_orders.registrationId, registrationId),
             eq(beverage_orders.status, 'PENDING')
        ));
        
        if (existingOrder.length > 0) {
            await db.update(beverage_orders).set({
                 latitude, 
                 longitude
            }).where(eq(beverage_orders.id, existingOrder[0].id));
        } else {
            await db.insert(beverage_orders).values({
                tournamentId, 
                registrationId, 
                latitude, 
                longitude
            });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const tournamentId = parseInt(id);

        const orders = await db.select()
          .from(beverage_orders)
          .where(and(
             eq(beverage_orders.tournamentId, tournamentId),
             eq(beverage_orders.status, 'PENDING')
          ));

        return NextResponse.json(orders);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { orderId, status } = await req.json();

        await db.update(beverage_orders)
           .set({ status })
           .where(eq(beverage_orders.id, orderId));

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
