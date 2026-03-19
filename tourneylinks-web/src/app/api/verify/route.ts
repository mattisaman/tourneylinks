import { NextResponse } from 'next/server';

// Simulating the Official USGA GHIN API for Handicap Index mapping
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, state, ghin } = body;

    // Reject empty fields
    if (!firstName || !lastName || !state || !ghin) {
       return NextResponse.json({ error: 'Missing required GHIN verification fields.' }, { status: 400 });
    }

    // Reject invalid GHIN format (Must be numbers)
    if (!/^\d+$/.test(ghin)) {
      return NextResponse.json({ error: 'Invalid GHIN format. Must contain only digits.' }, { status: 400 });
    }

    // Simulate Network Latency (1.5 seconds) to mimic third-party API integration
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mathematical Generation: Mocking the API response
    // Because we do not have an active Enterprise USGA GHIN license, we spoof an index.
    // E.g., Use the GHIN number to generate a deterministic handicap between 1.0 and 24.0
    const numericSeed = parseInt(ghin.slice(-3), 10) || 500;
    const syntheticHandicap = ((numericSeed / 999) * 23) + 1;

    return NextResponse.json({
      success: true,
      verifiedIndex: syntheticHandicap.toFixed(1),
      golfer: `${firstName} ${lastName}`,
      ghin: ghin,
      lastUpdated: new Date().toISOString()
    });

  } catch (err) {
    return NextResponse.json({ error: 'Internal API Server Error' }, { status: 500 });
  }
}
