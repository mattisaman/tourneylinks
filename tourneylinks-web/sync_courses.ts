import { db as prodDb } from './src/lib/db'; // Prod connection via local .env.local
import { courses, course_holes } from './src/lib/db';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

// Direct pool creation using the Demo URL containing your %40 fixes from earlier
const demoPool = new pg.Pool({
    connectionString: 'postgresql://postgres.oglktmsnyvueearlbatk:Sh1r3L%40n3Ass0c1%40t10nOfM3n@aws-0-us-west-2.pooler.supabase.com:5432/postgres',
    max: 1, // Single connection for steady stream to avoid over-saturating the pooler
});
const demoDb = drizzle(demoPool);

async function syncData() {
    try {
        console.log('🌐 CONNECTING TO PRODUCTION TO EXTRACT COURSE ARCHIVES...');
        const allCourses = await prodDb.select().from(courses);
        console.log(`📡 SUCCESSFULLY EXTRACTED ${allCourses.length} COURSES!`);
        
        console.log('🚀 BEAMING PAYLOAD TO DEMO DATABASE...');
        
        let batchIndex = 0;
        const BATCH_SIZE = 500;
        for (let i = 0; i < allCourses.length; i += BATCH_SIZE) {
            const batch = allCourses.slice(i, i + BATCH_SIZE);
            await demoDb.insert(courses).values(batch).onConflictDoNothing();
            batchIndex += batch.length;
            console.log(`   --> CLONED ${batchIndex} / ${allCourses.length} Courses`);
        }

        console.log('🌐 EXTRACTING COURSE HOLE GEOSPATIAL DATA...');
        const allHoles = await prodDb.select().from(course_holes);
        console.log(`📡 EXTRACTED ${allHoles.length} HOLES!`);

        batchIndex = 0;
        for (let i = 0; i < allHoles.length; i += BATCH_SIZE) {
            const batch = allHoles.slice(i, i + BATCH_SIZE);
            await demoDb.insert(course_holes).values(batch).onConflictDoNothing();
            batchIndex += batch.length;
            console.log(`   --> CLONED ${batchIndex} / ${allHoles.length} Holes`);
        }
        
        console.log('✅ DATABASE CLONE SEQUENCE COMPLETE: Demo logic injected native realism!');
        process.exit(0);
    } catch (e: any) {
        console.error('❌ MIGRATION CRASHED:', e);
        process.exit(1);
    }
}

syncData();
