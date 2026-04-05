'use client';
import React, { useState } from 'react';
import { MessageSquare, CheckCircle, ArrowLeft, LifeBuoy, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

export default function SupportPage() {
  const { user } = useUser();
  const [activeForm, setActiveForm] = useState<'BUG' | 'FEATURE_REQUEST' | null>(null);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    if (openFaq === idx) setOpenFaq(null);
    else setOpenFaq(idx);
  };

  // Auto-fill email if logged in
  React.useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress && !email) {
      setEmail(user.primaryEmailAddress.emailAddress);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message || !email || !activeForm) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: activeForm, message }),
      });

      if (res.ok) {
        setIsSuccess(true);
        setMessage('');
      } else {
        alert('Failed to submit ticket. Please try again or email support@tourneylinks.com');
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div style={{ 
        width: '100vw', marginLeft: 'calc(-50vw + 50%)', minHeight: 'calc(100vh - 80px)',
        padding: '3rem 3rem 6rem 3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(rgba(10, 31, 21, 0.85), rgba(5, 18, 12, 0.95)), url(/hero-bg-4.jpg) center/cover no-repeat fixed'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '600px', background: 'white', padding: '4rem', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', border: '1px solid rgba(26,46,26,0.1)' }}>
          <CheckCircle size={80} color="var(--grass)" style={{ margin: '0 auto 1.5rem auto' }} />
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', color: 'var(--forest)', marginBottom: '1rem' }}>Ticket Logged</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--mist)', marginBottom: '2rem', lineHeight: 1.6 }}>
            Thank you for helping us improve TourneyLinks! We've successfully logged your {activeForm === 'BUG' ? 'bug report' : 'feature request'} in our engineering queue.
          </p>
          <button onClick={() => { setIsSuccess(false); setActiveForm(null); }} className="btn-hero-outline" style={{ display: 'inline-flex', padding: '0.8rem 2rem' }}>
            Return to Support
          </button>
        </div>
      </div>
    );
  }

  if (activeForm) {
    return (
      <div style={{ 
        width: '100vw', marginLeft: 'calc(-50vw + 50%)', minHeight: 'calc(100vh - 80px)',
        padding: '3rem 3rem 6rem 3rem', display: 'flex', flexDirection: 'column', alignItems: 'center',
        background: 'linear-gradient(rgba(10, 31, 21, 0.85), rgba(5, 18, 12, 0.95)), url(/hero-bg-4.jpg) center/cover no-repeat fixed'
      }}>
        <div style={{ width: '100%', maxWidth: '700px' }}>
          
          <button onClick={() => setActiveForm(null)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', padding: '0.6rem 1.2rem', background: 'var(--forest)', color: 'var(--gold)', borderRadius: '20px', border: '1px solid rgba(212,175,55,0.3)', cursor: 'pointer', fontWeight: 500, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <ArrowLeft size={16} /> Back to Options
          </button>

          <div style={{ background: 'white', padding: '3.5rem', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', border: `1px solid ${activeForm === 'BUG' ? 'var(--forest)' : 'var(--grass)'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
               <div style={{ width: '50px', height: '50px', borderRadius: '25px', background: activeForm === 'BUG' ? 'rgba(26,46,26,0.05)' : 'rgba(90, 140, 58, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: activeForm === 'BUG' ? 'var(--forest)' : 'var(--grass)' }}>
                  {activeForm === 'BUG' ? <LifeBuoy size={24} /> : <Lightbulb size={24} />}
               </div>
               <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', color: 'var(--forest)', margin: 0 }}>
                 {activeForm === 'BUG' ? 'Platform Support' : 'Feature Request & Ideas'}
               </h1>
            </div>
            
            <p style={{ fontSize: '1.1rem', color: 'var(--mist)', marginBottom: '2.5rem' }}>
              {activeForm === 'BUG' 
                ? "Describe what you need help with or any issues you're experiencing. Our team is on standby to assist you." 
                : "Have a brilliant idea for the platform? We read every single submission and factor your feedback directly into our engineering roadmap."}
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--forest)', letterSpacing: '0.5px' }}>EMAIL ADDRESS</label>
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ padding: '1rem', borderRadius: '8px', border: '1px solid rgba(26,46,26,0.2)', fontSize: '1rem', outline: 'none' }} 
                  placeholder="Where should we follow up?"
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--forest)', letterSpacing: '0.5px' }}>YOUR MESSAGE</label>
                <textarea 
                  required 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{ padding: '1rem', borderRadius: '8px', border: '1px solid rgba(26,46,26,0.2)', fontSize: '1rem', outline: 'none', minHeight: '180px', resize: 'vertical' }} 
                  placeholder={activeForm === 'BUG' ? "What exactly happened? Steps to reproduce?" : "Tell us about your idea or review..."}
                />
              </div>

              <button type="submit" disabled={isSubmitting} className={activeForm === 'BUG' ? 'btn-primary' : 'btn-hero-outline'} style={{ marginTop: '1rem', padding: '1.2rem', fontSize: '1.1rem', display: 'flex', justifyContent: 'center' }}>
                {isSubmitting ? 'Transmitting to Engineering...' : 'Securely Submit Ticket'}
              </button>
            </form>

          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .support-card {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease, border-color 0.3s ease !important;
        }
        .support-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 50px rgba(212,175,55,0.15), 0 10px 15px rgba(0,0,0,0.05) !important;
          border-color: rgba(212,175,55,0.6) !important;
        }
      `}} />
      <div style={{ 
        width: '100vw', marginLeft: 'calc(-50vw + 50%)', minHeight: 'calc(100vh - 80px)',
        padding: '8rem 3rem 6rem 3rem', display: 'flex', flexDirection: 'column', alignItems: 'center',
        background: 'linear-gradient(rgba(10, 31, 21, 0.85), rgba(5, 18, 12, 0.95)), url(/hero-bg-4.jpg) center/cover no-repeat fixed'
      }}>
        
        <div style={{ textAlign: 'center', maxWidth: '700px', marginBottom: '3rem' }}>
           <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '3.5rem', color: 'var(--cream)', marginBottom: '1rem', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>How can we help?</h1>
           <p style={{ fontSize: '1.2rem', color: 'rgba(245,240,232,0.8)' }}>Whether you need to contact a tournament host, report a bug to our engineers, or suggest a brilliant new feature, you're in the right place.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', width: '100%', maxWidth: '1300px' }}>
           
           {/* TIER 1: Tournament Specific */}
           <div className="support-card" style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))', backdropFilter: 'blur(24px)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.3)', boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--gold)' }}></div>
            <div style={{ width: '50px', height: '50px', borderRadius: '25px', background: 'rgba(212,175,55,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
               <MessageSquare size={24} />
            </div>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--white)' }}>Tournament Questions</h3>
            <p style={{ color: '#e0e6e2', fontSize: '0.95rem', lineHeight: 1.5, flex: 1 }}>
               Need a refund, have a question about a specific event's details, or need to transfer your registration to another player? Reach out directly to the Event Host.
            </p>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem', color: '#e0e6e2' }}>
               👉 To contact a host or transfer a ticket, navigate directly to the <Link href="/tournaments" style={{ color: 'var(--gold)', fontWeight: 600 }}>Tournament Page</Link> and click <span className="btn-ghost" style={{ padding: '0.3rem 0.8rem', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'inline-flex', alignItems: 'center', margin: '0 0.2rem', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>Contact Host</span>
            </div>
         </div>

         {/* TIER 2: Platform Support */}
         <div className="support-card" style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))', backdropFilter: 'blur(24px)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.3)', boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--gold)' }}></div>
            <div style={{ width: '50px', height: '50px', borderRadius: '25px', background: 'rgba(212,175,55,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
               <LifeBuoy size={24} />
            </div>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--white)' }}>Platform Support</h3>
            <p style={{ color: '#e0e6e2', fontSize: '0.95rem', lineHeight: 1.5, flex: 1 }}>
               If you need help navigating the platform, configuring your account, or utilizing advanced features, our engineering team is on standby to assist you.
            </p>
            <button onClick={() => setActiveForm('BUG')} className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.8rem', textDecoration: 'none', width: '100%', border: 'none', cursor: 'pointer' }}>
               <LifeBuoy size={16} /> Request Support
            </button>
         </div>

         {/* Feedback & Feature Requests */}
         <div className="support-card" style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))', backdropFilter: 'blur(24px)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.3)', boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--gold)' }}></div>
            <div style={{ width: '50px', height: '50px', borderRadius: '25px', background: 'rgba(212,175,55,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
               <Lightbulb size={24} />
            </div>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--white)' }}>Feedback & Ideas</h3>
            <p style={{ color: '#e0e6e2', fontSize: '0.95rem', lineHeight: 1.5, flex: 1 }}>
               Have an idea for a new feature? Want to leave a review? We read every single submission and factor your feedback deeply into our engineering roadmap.
            </p>
         </div>

         {/* TIER 4: AI Guides */}
         <div className="support-card" style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))', backdropFilter: 'blur(24px)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.3)', boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--gold)' }}></div>
            <div style={{ width: '50px', height: '50px', borderRadius: '25px', background: 'rgba(212,175,55,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
               <span style={{ fontSize: '1.5rem' }}>🧠</span>
            </div>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--white)' }}>Strategy & Guides</h3>
            <p style={{ color: '#e0e6e2', fontSize: '0.95rem', lineHeight: 1.5, flex: 1 }}>
               Access our AI-powered Pricing Engine and review best-in-class playbooks for structuring sponsorships to maximize your charity revenue.
            </p>
            <Link href="/admin/guides" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.8rem', textDecoration: 'none', textAlign: 'center', width: '100%', cursor: 'pointer', background: 'var(--gold)', color: '#0a1f0d', borderRadius: '25px', fontWeight: 700, transition: '0.2s', boxShadow: 'none' }}>
               Launch AI Guides
            </Link>
         </div>

      </div>

      {/* FAQ & Strategy Playbook Accordion */}
      <div style={{ marginTop: '5rem', width: '100%', maxWidth: '800px' }}>
         <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.8rem', color: 'var(--cream)', marginBottom: '0.5rem', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>Organizer Playbook</h2>
            <p style={{ fontSize: '1.1rem', color: 'rgba(245,240,232,0.8)' }}>Best practices and frequently asked operational questions to ensure your tournament is highly profitable.</p>
         </div>

         <div className="faq-wrap" style={{ width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* FAQ Item 1 */}
            <div className={`faq-item ${openFaq === 1 ? 'open' : ''}`} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.2)', backdropFilter: 'blur(10px)', overflow: 'hidden' }}>
               <div className="faq-q" onClick={() => toggleFaq(1)} style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 700, color: 'var(--cream)' }}>
                  How do I determine the right registration price?
                  <span className="faq-toggle" style={{ transition: '0.3s', transform: openFaq === 1 ? 'rotate(45deg)' : 'none' }}>+</span>
               </div>
               <div className="faq-a" style={{ display: openFaq === 1 ? 'block' : 'none', padding: '0 2rem 1.5rem 2rem', color: 'rgba(245,240,232,0.7)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                  <span style={{ display: 'block', marginBottom: '1rem' }}>Determining your primary ticket price requires balancing your "hardware costs" (Greens Fees + Cart + Food & Beverage banquet) with a healthy profit margin for your charity or foundation.</span>
                  <strong>The 30% Rule:</strong> We generally advise constructing your primary Foursome ticket at a price point that yields a net profit margin of roughly 30%. This ensures your baseline financials are bulletproof, allowing your Sponsorship Inventory to act as 100% pure profit! To calculate this exactly for your specific geographic area, click the <strong style={{ color: 'var(--gold)' }}>"Launch AI Guides"</strong> button above to use our Demographic Pricing Engine!
               </div>
            </div>

            {/* FAQ Item 2 */}
            <div className={`faq-item ${openFaq === 2 ? 'open' : ''}`} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.2)', backdropFilter: 'blur(10px)', overflow: 'hidden' }}>
               <div className="faq-q" onClick={() => toggleFaq(2)} style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 700, color: 'var(--cream)' }}>
                  How should I structure my Sponsorship Tiers?
                  <span className="faq-toggle" style={{ transition: '0.3s', transform: openFaq === 2 ? 'rotate(45deg)' : 'none' }}>+</span>
               </div>
               <div className="faq-a" style={{ display: openFaq === 2 ? 'block' : 'none', padding: '0 2rem 1.5rem 2rem', color: 'rgba(245,240,232,0.7)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                  <span style={{ display: 'block', marginBottom: '1rem' }}>Your tournament is digitally bound by the number of golfers that can physically fit on the course (e.g. 144 players), but your <strong>Sponsorship Revenue is theoretically infinite.</strong></span>
                  <ul style={{ paddingLeft: '1.5rem', marginBottom: 0 }}>
                    <li style={{ marginBottom: '0.5rem' }}><strong>1x Exclusive Title Sponsor:</strong> Your highest tier. Bundle this with a complimentary Golf Foursome and prime real estate on the TV Liveboards.</li>
                    <li style={{ marginBottom: '0.5rem' }}><strong>2x Beverage Carts:</strong> A massive corporate write-off that businesses love to buy because it ensures everyone sees their logo when ordering drinks.</li>
                    <li><strong>18x Hole Sponsors:</strong> A pure margin play. At $250 a pop, this is an easy buy-in for local businesses that generates $4,500 in pure high-margin profit with zero impact on headcount.</li>
                  </ul>
               </div>
            </div>

            {/* FAQ Item 3 */}
            <div className={`faq-item ${openFaq === 3 ? 'open' : ''}`} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.2)', backdropFilter: 'blur(10px)', overflow: 'hidden' }}>
               <div className="faq-q" onClick={() => toggleFaq(3)} style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 700, color: 'var(--cream)' }}>
                  How does the Walk-Up Ledger check-in work?
                  <span className="faq-toggle" style={{ transition: '0.3s', transform: openFaq === 3 ? 'rotate(45deg)' : 'none' }}>+</span>
               </div>
               <div className="faq-a" style={{ display: openFaq === 3 ? 'block' : 'none', padding: '0 2rem 1.5rem 2rem', color: 'rgba(245,240,232,0.7)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                  A massive pain point for Game Day Operations is tracking exactly who has arrived at the course vs who is running late. To solve this, log into the Admin Dashboard and navigate to the <strong>Print & Post Hub</strong>. You can instantly export an alphabetized "Walk-Up Ledger" PDF that pre-organizes all of your golfers. Simply print it out, place it on a nice clipboard at the registration desk, and physically check off the <code>" [ ] Here "</code> box with a pen as players walk through the clubhouse doors.
               </div>
            </div>

            {/* FAQ Item 4 */}
            <div className={`faq-item ${openFaq === 4 ? 'open' : ''}`} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.2)', backdropFilter: 'blur(10px)', overflow: 'hidden' }}>
               <div className="faq-q" onClick={() => toggleFaq(4)} style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 700, color: 'var(--cream)' }}>
                  Can players split payments alongside their sponsorships?
                  <span className="faq-toggle" style={{ transition: '0.3s', transform: openFaq === 4 ? 'rotate(45deg)' : 'none' }}>+</span>
               </div>
               <div className="faq-a" style={{ display: openFaq === 4 ? 'block' : 'none', padding: '0 2rem 1.5rem 2rem', color: 'rgba(245,240,232,0.7)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                  <strong>Yes!</strong> High-end Golf Tournaments often feature "Cart Abandonment" at checkout because a Team Captain realizes they actually don't want to upfront the $1,000 Foursome ticket on their personal credit card. <br/><br/>
                  Through our native Stripe integration in the Campaign Builder, you can configure your checkout to automatically support Buy-Now-Pay-Later (BNPL) platforms like Affirm and Klarna, or rely on our built in "Split Payment" mechanism that dynamically tracks which members of a specific Foursome have successfully paid their fair share.
               </div>
            </div>

         </div>
      </div>

      </div>
    </>
  );
}
