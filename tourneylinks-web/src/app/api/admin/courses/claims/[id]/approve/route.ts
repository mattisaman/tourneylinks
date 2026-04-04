import { NextResponse } from 'next/server';
import { db, course_claims, courses } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const claimId = parseInt(params.id, 10);

    const targetClaims = await db.select().from(course_claims).where(eq(course_claims.id, claimId)).limit(1);
    const claim = targetClaims[0];

    if (!claim) {
      return NextResponse.json({ error: "Claim not found" }, { status: 404 });
    }

    // Mark Claim as approved
    await db.update(course_claims)
      .set({ status: 'APPROVED', reviewedAt: new Date() })
      .where(eq(course_claims.id, claimId));

    // Connect the Pro to the Course!
    await db.update(courses)
      .set({ claimedByUserId: claim.userId })
      .where(eq(courses.id, claim.courseId));

    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error("Approve Claim Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
