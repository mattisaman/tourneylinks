const fs = require('fs');

const p = 'src/app/system/dashboard/page.tsx';
let content = fs.readFileSync(p, 'utf8');

// Replace the Header Area
const oldHeaderRegex = /<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>[\s\S]*?<\/div>\n\n/g;

const newHeader = `
        {/* Dynamic Command Center Header */}
        <div style={{ background: 'var(--forest)', color: 'white', padding: '2.5rem', borderRadius: '16px', marginBottom: '2.5rem', boxShadow: 'var(--shadow-md)' }}>
           <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>Tournament Data Engine</h1>
           <p style={{ fontSize: '1.1rem', margin: 0, opacity: 0.9, lineHeight: 1.5 }}>
             {nextActionPhase === 4 && \`You have \${pendingCheckbacks} raw events waiting to be processed. Your next step is to run the AI Normalizer.\`}
             {nextActionPhase === 5 && \`You have \${eligibleCoursesCount} courses missing logos or details. Your next step is to run the Course Crawler.\`}
             {nextActionPhase < 4 && \`Your data pipeline is currently completely synchronized. You can start a new discovery search to find more events.\`}
           </p>
        </div>
`;
content = content.replace(oldHeaderRegex, newHeader);

// Replace "System Health" with Data Funnel
const oldHealthStart = /{\/\* System Health Indicators \*\/}/;
const oldHealthEnd = /{\/\* External Systems Link \*\/}/;
const oldHealthRegex = new RegExp(oldHealthStart.source + '[\\s\\S]*?' + oldHealthEnd.source);

const newDataFunnel = `{/* The Data Funnel */}
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--forest)', margin: '0 0 1rem 0' }}>Data Funnel</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <FunnelCard title="Raw Events Found" value={(totalTournaments + pendingCheckbacks).toString()} color="var(--gold-dark)" />
                <FunnelCard title="Waiting for AI" value={pendingCheckbacks.toString()} color="var(--admin-pin-red)" highlight={pendingCheckbacks > 0} />
                <FunnelCard title="Fully Published" value={totalTournaments.toString()} color="var(--emerald)" />
              </div>
            </div>

            {/* External Systems Link */}`;

content = content.replace(oldHealthRegex, newDataFunnel);

// Hide Telemetry Logs window (the user thought it was too technical)
// Find {/* Clubhouse Crawler Telemetry */}
const telemetryStart = /{\/\* Clubhouse Crawler Telemetry \*\/}/;
const telemetryEnd = /<\/div>\s*<\/div>\s*<\/div> \/\* End Right Column \*\//;
const telemetryRegex = new RegExp(telemetryStart.source + '[\\s\\S]*?' + telemetryEnd.source);

content = content.replace(telemetryRegex, '</div> {/* End Right Column */}');


// Add FunnelCard component at the bottom, remove HealthCard
content = content.replace(/function HealthCard[\s\S]*?}\n/, '');

const newCardComponent = `
function FunnelCard({ title, value, color, highlight = false }: { title: string, value: string, color: string, highlight?: boolean }) {
  return (
    <div style={{ 
      background: highlight ? \`color-mix(in srgb, \${color} 10%, white)\` : 'var(--white)', 
      border: highlight ? \`2px solid \${color}\` : '1px solid rgba(0,0,0,0.05)', 
      borderRadius: '12px', 
      padding: '1.5rem', 
      boxShadow: 'var(--shadow-sm)' 
    }}>
       <div style={{ color: highlight ? color : 'var(--mist)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>{title}</div>
       <div style={{ fontSize: '2.5rem', fontWeight: 800, color: color, lineHeight: 1.1 }}>{value}</div>
    </div>
  );
}
`;
content += newCardComponent;

fs.writeFileSync(p, content, 'utf8');
console.log("Dashboard UI replaced.");
