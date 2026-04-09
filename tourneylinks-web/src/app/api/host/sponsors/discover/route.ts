import { NextResponse } from 'next/server';
import { db, sponsor_profiles, users } from '@/lib/db';
import { ilike, or, eq } from 'drizzle-orm';
import { getUserId } from '@/lib/auth-util';

export async function GET(req: Request) {
  const { userId } = await getUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = new URL(req.url);
  const q = url.searchParams.get('q') || '';

  try {
    let query = db.select().from(sponsor_profiles);
    
    if (q) {
      query = query.where(
        or(
          ilike(sponsor_profiles.companyName, `%${q}%`),
          ilike(sponsor_profiles.locationName, `%${q}%`),
          ilike(sponsor_profiles.industrySegment, `%${q}%`)
        )
      );
    }
    
    const results = await query.limit(10);
    return NextResponse.json({ brands: results });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to search sponsors' }, { status: 500 });
  }
}

// Development Seeder
export async function POST(req: Request) {
  const { userId } = await getUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const currentUserObj = await db.select().from(users).where(eq(users.clerkId, userId)).limit(1);
  const currentUser = currentUserObj[0];
  if (!currentUser) return NextResponse.json({ error: 'User setup required' }, { status: 400 });

  const dummyBrands = [
    {
      userId: currentUser.id,
      companyName: 'Lexus Corporate',
      companyLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Lexus_logo.svg/512px-Lexus_logo.svg.png',
      isFranchise: false,
      locationName: 'North America',
      industrySegment: 'Automotive',
      proNetworkId: 1 // Vouched by pro
    },
    {
      userId: currentUser.id,
      companyName: 'Lexus of Austin',
      companyLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Lexus_logo.svg/512px-Lexus_logo.svg.png',
      isFranchise: true,
      locationName: 'Austin, TX',
      industrySegment: 'Automotive',
      proNetworkId: 1
    },
    {
      userId: currentUser.id,
      companyName: 'Titleist',
      companyLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Titleist_logo.svg/512px-Titleist_logo.svg.png',
      isFranchise: false,
      locationName: 'Global HQ',
      industrySegment: 'Golf Equipment',
      proNetworkId: null
    },
    {
      userId: currentUser.id,
      companyName: 'Barton Creek Bank',
      companyLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Bank_of_America_logo.svg/512px-Bank_of_America_logo.svg.png',
      isFranchise: false,
      locationName: 'Austin Local',
      industrySegment: 'Financial Services',
      proNetworkId: 1
    }
  ];

  for (const brand of dummyBrands) {
    await db.insert(sponsor_profiles).values(brand);
  }

  return NextResponse.json({ success: true, message: 'Seeded foundational marketplace brands' });
}
