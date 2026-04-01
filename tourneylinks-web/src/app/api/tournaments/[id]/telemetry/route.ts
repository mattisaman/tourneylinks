import { NextRequest, NextResponse } from 'next/server';
import { db, live_telemetry } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const tournamentId = parseInt(id);
        const { registrationId, latitude, longitude, accuracy } = await req.json();

        if (!registrationId || !latitude || !longitude) {
            return NextResponse.json({ error: 'Missing telemetry data' }, { status: 400 });
        }

        await db.insert(live_telemetry).values({
            tournamentId,
            registrationId,
            latitude,
            longitude,
            accuracy,
        });

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const tournamentId = parseInt(id);

        const allPings = await db.select()
          .from(live_telemetry)
          .where(eq(live_telemetry.tournamentId, tournamentId));

        // Group by registrationId to find only the absolute most recent known physical position
        const latestPositions = allPings.reduce((acc: any, ping) => {
           if (!acc[ping.registrationId] || new Date(ping.timestamp).getTime() > new Date(acc[ping.registrationId].timestamp).getTime()) {
               acc[ping.registrationId] = ping;
           }
           return acc;
        }, {});

        return NextResponse.json(Object.values(latestPositions));
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
