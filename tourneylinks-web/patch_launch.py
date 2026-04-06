import re

with open("src/app/host/page.tsx", "r") as f:
    text = f.read()

# 1. Update the Payouts & Treasury render block
target_payouts = """           {charityType === 'golf_sponsored' ? (
              <div style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid var(--gold)', borderRadius: '8px', padding: '1.2rem', display: 'flex', gap: '1rem' }}>
                 <div style={{ fontSize: '1.5rem' }}>⏳</div>
                 <div>
                    <strong style={{ color: 'var(--ink)', display: 'block', marginBottom: '0.4rem' }}>Gateway Links Foundation Treasury</strong>
                    <div style={{ color: 'var(--mist)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                       Your application for Fiscal Sponsorship is currently <strong>Under Review</strong>. <br/><br/>
                       If approved, all transactions will be securely routed directly through the foundation's audited accounts. You can expect a response on your application and a status update within 48 hours.
                    </div>
                 </div>
              </div>
           ) : ("""

replacement_payouts = """           {charityType === 'golf_sponsored' && golfApplicationStatus === 'pending' ? (
              <div style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid var(--gold)', borderRadius: '8px', padding: '1.2rem', display: 'flex', gap: '1rem' }}>
                 <div style={{ fontSize: '1.5rem' }}>⏳</div>
                 <div>
                    <strong style={{ color: 'var(--ink)', display: 'block', marginBottom: '0.4rem' }}>Gateway Links Foundation Treasury</strong>
                    <div style={{ color: 'var(--mist)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                       Your application for Fiscal Sponsorship is currently <strong>Under Review</strong>. <br/><br/>
                       If approved, all transactions will be securely routed directly through the foundation's audited accounts. You can expect a response on your application and a status update within 48 hours.
                    </div>
                 </div>
              </div>
           ) : charityType === 'golf_sponsored' && golfApplicationStatus === 'rejected' ? (
              <>
                 <div style={{ background: '#fffafa', border: '1px solid rgba(255, 95, 86, 0.2)', borderRadius: '8px', padding: '1.2rem', display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '1.5rem' }}>ℹ️</div>
                    <div>
                       <strong style={{ color: 'var(--ink)', display: 'block', marginBottom: '0.4rem' }}>Application Update</strong>
                       <div style={{ color: '#c62828', fontSize: '0.85rem', lineHeight: 1.5 }}>
                          The foundation is unable to provide fiscal sponsorship for this specific event at this time. However, you can still seamlessly host your tournament! Simply connect a standard bank account below to process payments and go live.
                       </div>
                    </div>
                 </div>
                 
                 <div style={{ color: 'var(--mist)', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                    Connect a validated Stripe account to enable automated payouts. Player entry fees and sponsor revenue will bypass TourneyLinks and flow directly into your connected treasury account.
                 </div>
                 
                 <div style={{ background: '#f8faf9', padding: '1.2rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <DollarSign color="var(--forest)" size={24} />
                      <div>
                         <div style={{ fontWeight: 700, color: 'var(--forest)' }}>Stripe Connect Identity</div>
                         <div style={{ fontSize: '0.75rem', color: 'var(--mist)' }}>Awaiting Boarding...</div>
                      </div>
                   </div>
                   <StripeOnboardButton />
                 </div>
              </>
           ) : ("""

if target_payouts in text:
    text = text.replace(target_payouts, replacement_payouts)

# 2. Update the Pay Button to unlock it and remove disabled logic
target_button = """             <button disabled={charityType === 'golf_sponsored' && golfApplicationStatus === 'pending'} onClick={() => { if(draftId) { alert('Stripe Checkout Flow Initiating...') } else alert('Please fill out the campaign first!'); }} className="btn-primary" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '0.5rem 1rem', background: (charityType === 'golf_sponsored' && golfApplicationStatus === 'pending') ? '#ccc' : 'var(--gold)', color: (charityType === 'golf_sponsored' && golfApplicationStatus === 'pending') ? '#666' : '#000', fontWeight: 700, border: 'none', borderRadius: '8px', boxShadow: (charityType === 'golf_sponsored' && golfApplicationStatus === 'pending') ? 'none' : '0 4px 15px rgba(212,175,55,0.4)', cursor: (charityType === 'golf_sponsored' && golfApplicationStatus === 'pending') ? 'not-allowed' : 'pointer', transition: '0.2s' }}>
               <div style={{ fontSize: '0.75rem', textDecoration: 'line-through', opacity: 0.7, marginBottom: '-0.2rem' }}>$149 Regular Price</div>
               <div style={{ fontSize: '1.1rem' }}>Pay $99 Intro Price 🚀</div>
             </button>"""

replacement_button = """             <button onClick={() => { if(draftId) { alert('Stripe Checkout Flow Initiating...') } else alert('Please fill out the campaign first!'); }} className="btn-primary" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '0.5rem 1rem', background: 'var(--gold)', color: '#000', fontWeight: 700, border: 'none', borderRadius: '8px', boxShadow: '0 4px 15px rgba(212,175,55,0.4)', cursor: 'pointer', transition: '0.2s' }}>
               <div style={{ fontSize: '0.75rem', textDecoration: 'line-through', opacity: 0.7, marginBottom: '-0.2rem' }}>$149 Regular Price</div>
               <div style={{ fontSize: '1.1rem' }}>Pay $99 Intro Price 🚀</div>
             </button>"""

if target_button in text:
    text = text.replace(target_button, replacement_button)

with open("src/app/host/page.tsx", "w") as f:
    f.write(text)

