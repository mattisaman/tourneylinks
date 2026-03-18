import 'dotenv/config';
import { crawlPage, closeBrowser } from './src/crawlers/page-crawler.js';
import { extractTournaments } from './src/extractors/llm-extractor.js';
import { normalizeTournament } from './src/pipeline/dedup.js';
import { SOURCES } from './src/config/sources.js';

const testUrl = 'https://www.fsga.org/TournamentCategory/EnterList/d99ad47f-2e7d-4ff4-8a32-c5b1eb315d28?year=2026';

async function testDeepCrawl() {
    try {
        console.log(`Starting Surface Crawl on: ${testUrl}`);
        const source = SOURCES.find(s => s.id === 'state-associations')!;
        
        const listPage = await crawlPage(testUrl, source);
        console.log('List page scraped. Running LLM extraction...');
        
        const extraction = await extractTournaments(listPage.text, testUrl, source.id);
        const normalized = extraction.tournaments.map(normalizeTournament);
        
        console.log(`Found ${normalized.length} tournaments on the directory page.`);
        
        // Deep Crawl Logic
        for (let i = 0; i < normalized.length; i++) {
            const t = normalized[i];
            const url = t.registrationUrl;
            console.log(`\nEvaluating: ${t.name} (Fee: ${t.entryFee}, URL: ${url})`);
            
            const needsDeepCrawl = url && (!t.entryFee || t.spotsRemaining === null || !t.description);
            if (needsDeepCrawl && url.startsWith('http')) {
                console.log(` -> Needs deep crawl! Fetching detail page: ${url}`);
                const detailPage = await crawlPage(url, source);
                
                console.log(' -> Running secondary LLM extraction on detail page...');
                const detailExt = await extractTournaments(detailPage.text, url, source.id);
                
                if (detailExt.tournaments.length > 0) {
                    const dt = detailExt.tournaments[0];
                    console.log(`   [DEEP EXTRACT] Entry Fee: ${dt.entryFee}`);
                    console.log(`   [DEEP EXTRACT] Field Config: ${dt.formatDetail}`);
                    console.log(`   [DEEP EXTRACT] Description: ${dt.description}`);
                }
            } else {
                console.log(' -> No deep crawl needed or missing valid link.');
            }
            
            // Just test the first one for speed
            if (i >= 0) break;
        }
        
    } catch (e) {
        console.error(e);
    } finally {
        await closeBrowser();
        process.exit();
    }
}

testDeepCrawl();
