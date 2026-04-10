import React from 'react';
import { db, registrations, operating_expenses, crawlLogs, tournaments } from '@/lib/db';
import { sql, desc, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function addExpense(formData: FormData) {
  'use server';
  const name = formData.get('name') as string;
  const cost = parseFloat(formData.get('amount') as string);
  const frequency = formData.get('frequency') as string;
  const category = formData.get('category') as string;

  if (!name || isNaN(cost)) return;

  await db.insert(operating_expenses).values({
    name,
    amount: cost,
    frequency,
    category,
    isVariable: false
  });

  revalidatePath('/system/dashboard/financials');
}

export default async function FinancialsDashboard() {
  
  // Real Financial Calculation via Joins
  const [revenueData] = await db.select({
    totalGMV: sql<number>`SUM(${tournaments.entryFee})`,
    transactionCount: sql<number>`COUNT(${registrations.id})`
  })
  .from(registrations)
  .leftJoin(tournaments, eq(registrations.tournamentId, tournaments.id))
  .where(eq(registrations.paymentStatus, 'COMPLETED'));

  const expenses = await db.select().from(operating_expenses).orderBy(desc(operating_expenses.createdAt));

  // Extrapolate FireCrawl variable costs based on engine tracking
  const [firecrawlStats] = await db.select({ 
      totalCredits: sql<number>`sum(firecrawl_credits_used)`, 
      totalCost: sql<number>`sum(total_costs)` 
  }).from(crawlLogs);

  // Financial Forensics 
  const realGMV = Number(revenueData?.totalGMV) || 0; 
  const realTransactionCount = Number(revenueData?.transactionCount) || 0;
  
  // Standard Stripe Commercial Processing Rate
  const actualStripeFees = (realGMV * 0.029) + (realTransactionCount * 0.30);
  
  const recurringExpenses = expenses.filter(e => e.frequency === 'monthly');
  const sankExpenses = expenses.filter(e => e.frequency === 'one-time');

  const fixedMonthlyTotal = recurringExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalSunkCapital = sankExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  const variableExpensesTotal = firecrawlStats?.totalCost || 0; // AI Scaling Costs

  const grossPlatformProfit = realGMV - actualStripeFees;
  const netPlatformProfit = grossPlatformProfit - fixedMonthlyTotal - variableExpensesTotal;

  return (
    <div>
        <style dangerouslySetInnerHTML={{__html: `
          .lux-card { transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; }
          .lux-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md) !important; }
          .lux-input { transition: border-color 0.2s, box-shadow 0.2s; }
          .lux-input:focus { outline: none; border-color: var(--gold); box-shadow: 0 0 0 3px rgba(197, 160, 89, 0.1); }
          .lux-btn { transition: transform 0.2s; }
          .lux-btn:hover { transform: translateY(-2px); }
        `}} />
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--forest)' }}>Startup Financial Forensics</h1>
          <p style={{ color: 'var(--mist)', margin: 0 }}>Stripe Processing, Revenue Forecasting, Capital Burn, and AI Scaling</p>
        </div>

        {/* Top level Ledger (Glassmorphism Core) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
            {/* GMV - Green */}
            <div style={{ background: 'var(--admin-gradient-green)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', boxShadow: 'var(--admin-glow-green)' }}>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Gross Platform GMV</span>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--white)', marginTop: '0.5rem' }}>${realGMV.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
            </div>
            {/* Monthly Burn - Dark */}
            <div style={{ background: 'var(--admin-gradient-dark)', border: '1px solid var(--emerald)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', boxShadow: 'var(--admin-glow-dark)' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Monthly Burn</span>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--admin-pin-red)', marginTop: '0.5rem' }}>-${(fixedMonthlyTotal + variableExpensesTotal).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
            </div>
            {/* Sunk Capital - Gold */}
            <div style={{ background: 'var(--admin-gradient-gold)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', boxShadow: 'var(--admin-glow-gold)' }}>
                <span style={{ color: 'rgba(0,0,0,0.6)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Sunk Setup Capital</span>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--forest)', marginTop: '0.5rem' }}>-${totalSunkCapital.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
            </div>
            {/* Net Profit - White Glass */}
            <div style={{ background: 'var(--white)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-sm)' }}>
                <span style={{ color: 'var(--mist)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Net Monthly Profit</span>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: netPlatformProfit >= 0 ? 'var(--grass)' : 'var(--admin-pin-red)', marginTop: '0.5rem' }}>
                    {netPlatformProfit >= 0 ? '+' : '-'}${Math.abs(netPlatformProfit).toLocaleString(undefined, {minimumFractionDigits: 2})}
                </span>
            </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
            
            {/* The Ledger List (Replaced Table) */}
            <div>
               <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--forest)', marginBottom: '1.5rem' }}>Operating Expenses Ledger</h2>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                   
                   {/* Dynamically Injected Variable Cost: Firecrawl Burn */}
                   <div className="lux-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(to right, rgba(230, 194, 122, 0.1), var(--white))', border: '1px solid rgba(200, 150, 50, 0.2)', padding: '1.25rem 1.5rem', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
                       <div style={{ flex: 2 }}>
                           <div style={{ color: 'var(--forest)', fontWeight: 700, fontSize: '1.05rem' }}>FireCrawl Spider API</div>
                           <div style={{ color: 'var(--mist)', fontSize: '0.85rem', marginTop: '0.2rem' }}>{firecrawlStats?.totalCredits || 0} Credits Consumed</div>
                       </div>
                       <div style={{ flex: 1, color: 'var(--mist)', fontSize: '0.9rem' }}>Infrastructure</div>
                       <div style={{ flex: 1 }}>
                           <span style={{ padding: '0.3rem 0.6rem', background: 'rgba(0,0,0,0.05)', color: 'var(--mist)', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>Variable Storage</span>
                       </div>
                       <div style={{ flex: 1, textAlign: 'right', color: 'var(--admin-pin-red)', fontWeight: 800, fontSize: '1.1rem' }}>
                           -${variableExpensesTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}
                       </div>
                   </div>

                   {expenses.map(exp => (
                       <div key={exp.id} className="lux-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--white)', border: '1px solid rgba(0,0,0,0.05)', padding: '1rem 1.5rem', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
                           <div style={{ flex: 2, color: 'var(--forest)', fontWeight: 600, fontSize: '0.95rem' }}>{exp.name}</div>
                           <div style={{ flex: 1, color: 'var(--mist)', fontSize: '0.9rem' }}>{exp.category}</div>
                           <div style={{ flex: 1 }}>
                               <span style={{ padding: '0.3rem 0.6rem', background: exp.frequency === 'one-time' ? 'rgba(230, 194, 122, 0.2)' : 'rgba(0,0,0,0.05)', color: exp.frequency === 'one-time' ? 'var(--gold-dark)' : 'var(--mist)', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                                   {exp.frequency.toUpperCase()}
                               </span>
                           </div>
                           <div style={{ flex: 1, textAlign: 'right', color: exp.frequency === 'one-time' ? 'var(--gold-dark)' : 'var(--admin-pin-red)', fontWeight: 700, fontSize: '1.05rem' }}>
                               -${exp.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}
                           </div>
                       </div>
                   ))}
               </div>
            </div>

            {/* Light Insertion Form */}
            <div>
               <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--forest)', marginBottom: '1.5rem' }}>Log New Expense</h2>
               <form action={addExpense} style={{ background: 'var(--white)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', boxShadow: 'var(--shadow-md)' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--mist)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Expense Name</label>
                        <input className="lux-input" type="text" name="name" placeholder="e.g. Graphic Designer, Route53" required style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--admin-golf-white)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', color: 'var(--forest)', fontSize: '0.95rem' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--mist)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Amount Spent ($)</label>
                        <input className="lux-input" type="number" step="0.01" name="amount" placeholder="0.00" required style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--admin-golf-white)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', color: 'var(--forest)', fontSize: '0.95rem' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--mist)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Frequency</label>
                        <select className="lux-input" name="frequency" style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--admin-golf-white)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', color: 'var(--forest)', fontSize: '0.95rem', cursor: 'pointer' }}>
                            <option value="monthly">Monthly Recurring</option>
                            <option value="one-time">One-Time Sunk Cost</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--mist)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Category</label>
                        <select className="lux-input" name="category" style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--admin-golf-white)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', color: 'var(--forest)', fontSize: '0.95rem', cursor: 'pointer' }}>
                            <option value="Software">Software & Subscriptions</option>
                            <option value="Infrastructure">Infrastructure (AWS, DB)</option>
                            <option value="Legal">Legal & Compliance</option>
                            <option value="Marketing">Marketing & Ads</option>
                            <option value="Contractors">Contractors / Services</option>
                        </select>
                    </div>
                    <button type="submit" className="lux-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.85rem', background: 'var(--gold-foil)', color: 'var(--ink)', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', marginTop: '0.5rem', boxShadow: 'var(--metallic-shadow)', fontSize: '0.95rem' }}>
                        <Plus size={18} /> Append to Ledger
                    </button>
               </form>
            </div>
        </div>
    </div>
  );
}
