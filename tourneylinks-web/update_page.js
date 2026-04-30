const fs = require('fs');
const p = 'src/app/system/dashboard/page.tsx';
let content = fs.readFileSync(p, 'utf8');

// Find where to calculate `nextActionPhase`
const insertPoint = '  // Cost Estimate (Extremely rough: $0.003 per page for Gemini Flash + Search/Scrape overhead)';

const calculateLogic = `  // Smart Guidance Logic
  let nextActionPhase = 1;
  if (pendingCheckbacks > 0) {
    nextActionPhase = 4;
  } else if (eligibleCoursesCount > 0) {
    nextActionPhase = 5;
  } else {
    // If we have less than 100 recent crawls, assume we might need more discovery
    nextActionPhase = (totalCrawls > 100 && pendingCheckbacks === 0) ? 0 : 2; 
  }

`;

content = content.replace(insertPoint, calculateLogic + insertPoint);

// Now replace the layout
const layoutStart = `        {/* 5-Step Ingestion Pipeline Sequence */}`;
const layoutEnd = `        {/* Quick Reference Dashboard */}`;

const newLayout = `
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2rem', marginBottom: '3rem', alignItems: 'flex-start' }}>
          
          {/* LEFT COLUMN: Pipeline Sequence */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--forest)', margin: '0 0 0.5rem 0' }}>Ingestion Pipeline</h2>
            
            <ApifySyncTrigger isNextAction={nextActionPhase === 1} />
            
            <div style={{ width: '2px', height: '16px', background: 'rgba(0,0,0,0.1)', margin: '0 auto' }} />
            <SmartSpiderTrigger isNextAction={nextActionPhase === 2} />
            
            <div style={{ width: '2px', height: '16px', background: 'rgba(0,0,0,0.1)', margin: '0 auto' }} />
            <PlatformSearchTrigger isNextAction={nextActionPhase === 3} />
            
            <div style={{ width: '2px', height: '16px', background: 'rgba(0,0,0,0.1)', margin: '0 auto' }} />
            <CheckbackTrigger pendingCount={pendingCheckbacks} isNextAction={nextActionPhase === 4} />
            
            <div style={{ width: '2px', height: '16px', background: 'rgba(0,0,0,0.1)', margin: '0 auto' }} />
            <CrawlerTrigger pendingCount={eligibleCoursesCount} isNextAction={nextActionPhase === 5} />
          </div>

          {/* RIGHT COLUMN: Information & Feeds */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* System Health Indicators */}
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--forest)', margin: '0 0 1rem 0' }}>System Health</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                <HealthCard title="Upstash QStash" status="Nominal" icon={<Server color="var(--grass)" size={18} />} color="var(--grass)" />
                <HealthCard title="Engine 1: Native" status={isActivelyRunning ? "Processing Payload" : "Standby"} icon={<Activity color={isActivelyRunning ? "var(--emerald)" : "var(--mist)"} size={18} />} color={isActivelyRunning ? "var(--emerald)" : "var(--mist)"} isPulsing={isActivelyRunning} />
                <HealthCard title="Engine 2: FireCrawl" status="Standby" icon={<Zap color="var(--gold-dark)" size={18} />} color="var(--gold-dark)" />
                <HealthCard title="Neon DB" status="Synchronized" icon={<Database color="var(--forest)" size={18} />} color="var(--forest)" />
              </div>
            </div>

            {/* External Systems Link */}
            <div className="lux-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', background: 'var(--white)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px' }}>
               <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--forest)', marginBottom: '0.15rem' }}>Apify Developer Console</h3>
                  <p style={{ color: 'var(--mist)', fontSize: '0.8rem', margin: 0 }}>Configure platform webhooks or monitor SaaS scraper logs.</p>
               </div>
               <a href="https://console.apify.com" target="_blank" rel="noopener noreferrer" className="btn-hero" style={{ padding: '0.6rem 1.2rem', fontSize: '0.8rem' }}>
                  Open Apify Console ↗
               </a>
            </div>

`;

// Use regex to replace the content
const regex = new RegExp(layoutStart.replace(/[.*+?^$\{\}\(\)\|\[\]\\]/g, '\\$&') + '[\\s\\S]*?' + layoutEnd.replace(/[.*+?^$\{\}\(\)\|\[\]\\]/g, '\\$&'));
content = content.replace(regex, newLayout + layoutEnd);

fs.writeFileSync(p, content, 'utf8');
console.log('Page updated');
