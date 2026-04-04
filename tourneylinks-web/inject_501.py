import sys

def main():
    with open("src/app/host/page.tsx", "r") as f:
        content = f.read()

    # 1. Insert State variables right after 'const [aiSuggestionPanel...]'
    state_vars = """  const [aiSuggestionPanel, setAiSuggestionPanel] = useState<any>(null);

  // 501(c)(3) and Golf Foundation State
  const [charityType, setCharityType] = useState<'none'|'own'|'golf_sponsored'>('none');
  const [charityName, setCharityName] = useState('');
  const [charityTaxId, setCharityTaxId] = useState('');
  const [golfApplicationCause, setGolfApplicationCause] = useState('');
  const [golfPayoutMethod, setGolfPayoutMethod] = useState<'bank'|'check'>('bank');
  const [golfPayoutInfo, setGolfPayoutInfo] = useState('');
  const [golfAgreementChecked, setGolfAgreementChecked] = useState(false);
  const [golfApplicationStatus, setGolfApplicationStatus] = useState<'draft'|'pending'|'approved'>('draft');
  const isCharity = charityType !== 'none';
"""
    content = content.replace("  const [aiSuggestionPanel, setAiSuggestionPanel] = useState<any>(null);", state_vars)

    # 2. Extract "Pay $99 to Publish 🚀" and modify it.
    publish_button = """             <button onClick={handleSaveCampaign} className="btn-primary" style={{ flex: 1, padding: '1rem', background: 'var(--gold)', color: '#000', fontWeight: 700, border: 'none', borderRadius: '8px', boxShadow: '0 4px 15px rgba(212,175,55,0.4)', cursor: 'pointer' }}>
               Pay $99 to Publish 🚀
             </button>"""
    
    new_publish_button = """             <button disabled={charityType === 'golf_sponsored' && golfApplicationStatus === 'pending'} onClick={handleSaveCampaign} className="btn-primary" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '0.5rem 1rem', background: (charityType === 'golf_sponsored' && golfApplicationStatus === 'pending') ? '#ccc' : 'var(--gold)', color: (charityType === 'golf_sponsored' && golfApplicationStatus === 'pending') ? '#666' : '#000', fontWeight: 700, border: 'none', borderRadius: '8px', boxShadow: (charityType === 'golf_sponsored' && golfApplicationStatus === 'pending') ? 'none' : '0 4px 15px rgba(212,175,55,0.4)', cursor: (charityType === 'golf_sponsored' && golfApplicationStatus === 'pending') ? 'not-allowed' : 'pointer', transition: '0.2s' }}>
               <div style={{ fontSize: '0.75rem', textDecoration: 'line-through', opacity: 0.7, marginBottom: '-0.2rem' }}>$149 Regular Price</div>
               <div style={{ fontSize: '1.1rem' }}>Pay $99 Intro Price 🚀</div>
             </button>"""
             
    content = content.replace(publish_button, new_publish_button)
    
    # Also add the Publish locked warning to Launch Protocol
    launch_protocol_target = """         <div className="wizard-card">
            <div className="wizard-card-title">Launch Protocol</div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>"""
            
    launch_protocol_new = """         <div className="wizard-card">
            <div className="wizard-card-title">Launch Protocol</div>
            
            {charityType === 'golf_sponsored' && golfApplicationStatus === 'pending' && (
               <div style={{ background: '#f8faf9', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0.8rem 1rem', fontSize: '0.8rem', color: 'var(--mist)', marginBottom: '1rem' }}>
                  Publishing is locked while your 501(c)(3) application is validated. You may save your progress as a draft.
               </div>
            )}
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>"""
    content = content.replace(launch_protocol_target, launch_protocol_new)

    # 3. Dynamic Fee logic
    # In Desktop Simulator, we have a total calculator: let's grep for "passFees"
    # Actually wait. Let's just find the occurrences of `0.029` or similar. I'll do this in a minute.
    
    with open("src/app/host/page.tsx", "w") as f:
        f.write(content)

main()
