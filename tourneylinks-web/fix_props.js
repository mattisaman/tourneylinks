const fs = require('fs');
const path = require('path');

const dir = 'src/app/system/dashboard';
const triggers = [
  'ApifySyncTrigger.tsx',
  'PlatformSearchTrigger.tsx',
  'CheckbackTrigger.tsx',
  'CrawlerTrigger.tsx'
];

triggers.forEach(file => {
  const p = path.join(dir, file);
  let content = fs.readFileSync(p, 'utf8');
  
  if (file === 'CheckbackTrigger.tsx' || file === 'CrawlerTrigger.tsx') {
    content = content.replace(/export default function \w+\(\{ pendingCount \}: \{ pendingCount: number \}\) \{/g, (match) => {
      const funcName = match.split(' ')[3].split('(')[0];
      return `export default function ${funcName}({ pendingCount, isNextAction = false }: { pendingCount: number, isNextAction?: boolean }) {`;
    });
  } else {
    content = content.replace(/export default function \w+\(\) \{/g, (match) => {
      const funcName = match.split(' ')[3].split('(')[0];
      return `export default function ${funcName}({ isNextAction = false }: { isNextAction?: boolean }) {`;
    });
  }
  
  // Add highlight styling
  const styleMatch = `boxShadow: 'var(--shadow-sm)'`;
  const styleReplace = `boxShadow: isNextAction ? '0 0 0 2px var(--forest), var(--shadow-sm)' : 'var(--shadow-sm)'`;
  content = content.replace(styleMatch, styleReplace);

  // Add the "Next Action" badge
  const badgeHtml = `{isNextAction && <div style={{ background: 'var(--forest)', color: 'white', fontSize: '0.65rem', fontWeight: 800, padding: '0.15rem 0.4rem', borderRadius: '4px', marginLeft: 'auto', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Next Action</div>}`;
  content = content.replace(/(<span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var\(--forest\)' }}>\s*Phase [1-5]: [^\n]+?\s*<\/span>)/g, `$1\n        ${badgeHtml}`);
  
  fs.writeFileSync(p, content, 'utf8');
});

// Also do SmartSpiderTrigger
const smartPath = 'src/components/dashboard/SmartSpiderTrigger.tsx';
let smartContent = fs.readFileSync(smartPath, 'utf8');
smartContent = smartContent.replace(/export default function SmartSpiderTrigger\(\) \{/, `export default function SmartSpiderTrigger({ isNextAction = false }: { isNextAction?: boolean }) {`);
smartContent = smartContent.replace(`boxShadow: 'var(--shadow-sm)'`, `boxShadow: isNextAction ? '0 0 0 2px var(--forest), var(--shadow-sm)' : 'var(--shadow-sm)'`);
const smartBadgeHtml = `{isNextAction && <div style={{ background: 'var(--forest)', color: 'white', fontSize: '0.65rem', fontWeight: 800, padding: '0.15rem 0.4rem', borderRadius: '4px', marginLeft: 'auto', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Next Action</div>}`;
smartContent = smartContent.replace(/(<span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var\(--forest\)' }}>\s*Phase [1-5]: [^\n]+?\s*<\/span>)/g, `$1\n        ${smartBadgeHtml}`);
fs.writeFileSync(smartPath, smartContent, 'utf8');

console.log('Props updated');
