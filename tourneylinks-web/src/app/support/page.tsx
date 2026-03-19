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
        background: 'linear-gradient(rgba(248, 250, 249, 0.70), rgba(248, 250, 249, 0.75)), url(/hero-bg-4.jpg) center/cover no-repeat fixed'
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
        background: 'linear-gradient(rgba(248, 250, 249, 0.70), rgba(248, 250, 249, 0.75)), url(/hero-bg-4.jpg) center/cover no-repeat fixed'
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
        padding: '3rem 3rem 6rem 3rem', display: 'flex', flexDirection: 'column', alignItems: 'center',
        background: 'linear-gradient(rgba(248, 250, 249, 0.70), rgba(248, 250, 249, 0.75)), url(/hero-bg-4.jpg) center/cover no-repeat fixed'
      }}>
        
        <div style={{ textAlign: 'center', maxWidth: '700px', marginBottom: '3rem' }}>
           <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '3.5rem', color: 'var(--forest)', marginBottom: '1rem' }}>How can we help?</h1>
           <p style={{ fontSize: '1.2rem', color: 'var(--mist)' }}>Whether you need to contact a tournament host, report a bug to our engineers, or suggest a brilliant new feature, you're in the right place.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', width: '100%', maxWidth: '1000px' }}>
           
           {/* TIER 1: Tournament Specific */}
           <div className="support-card" style={{ background: 'linear-gradient(145deg, #0a1f0d, #1a2e1a)', padding: '2.5rem', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.15)', boxShadow: '0 15px 35px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--gold)' }}></div>
            <div style={{ width: '50px', height: '50px', borderRadius: '25px', background: 'rgba(212,175,55,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
               <MessageSquare size={24} />
            </div>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--white)' }}>Tournament Questions</h3>
            <p style={{ color: '#e0e6e2', fontSize: '0.95rem', lineHeight: 1.5, flex: 1 }}>
               Need a refund, have a question about a specific event's details, or need to transfer your registration to another player? Reach out directly to the Event Host.
            </p>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem', color: '#e0e6e2' }}>
               👉 To contact a host or transfer a ticket, navigate directly to the <Link href="/tournaments" style={{ color: 'var(--gold)', fontWeight: 600 }}>Tournament Page</Link> and click "Contact Host".
            </div>
         </div>

         {/* TIER 2: Platform Support */}
         <div className="support-card" style={{ background: 'linear-gradient(145deg, #0a1f0d, #1a2e1a)', padding: '2.5rem', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.15)', boxShadow: '0 15px 35px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', overflow: 'hidden' }}>
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
         <div className="support-card" style={{ background: 'linear-gradient(145deg, #0a1f0d, #1a2e1a)', padding: '2.5rem', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.15)', boxShadow: '0 15px 35px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--gold)' }}></div>
            <div style={{ width: '50px', height: '50px', borderRadius: '25px', background: 'rgba(212,175,55,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
               <Lightbulb size={24} />
            </div>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--white)' }}>Feedback & Ideas</h3>
            <p style={{ color: '#e0e6e2', fontSize: '0.95rem', lineHeight: 1.5, flex: 1 }}>
               Have an idea for a new feature? Want to leave a review? We read every single submission and factor your feedback deeply into our engineering roadmap.
            </p>
            <button onClick={() => setActiveForm('FEATURE_REQUEST')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.8rem', textDecoration: 'none', textAlign: 'center', width: '100%', cursor: 'pointer', background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.4)', color: 'var(--gold)', borderRadius: '25px', fontWeight: 600, transition: 'background 0.2s', boxShadow: 'none' }}>
               Submit Feature Request
            </button>
         </div>

      </div>
      </div>
    </>
  );
}
