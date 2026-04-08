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
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#fff' }}>Startup Financial Forensics</h1>
          <p style={{ color: '#888', margin: 0 }}>Stripe Processing, Revenue Forecasting, Capital Burn, and AI Scaling</p>
        </div>

        {/* Top level Ledger */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
            <LedgerCard title="Gross Platform GMV" value={`$${realGMV.toLocaleString(undefined, {minimumFractionDigits: 2})}`} highlight="var(--gold)" />
            <LedgerCard title="Monthly Operating Burn" value={`-$${(fixedMonthlyTotal + variableExpensesTotal).toLocaleString(undefined, {minimumFractionDigits: 2})}`} highlight="#f44336" />
            <LedgerCard title="Sunk Setup Capital" value={`-$${totalSunkCapital.toLocaleString(undefined, {minimumFractionDigits: 2})}`} highlight="#ff9800" />
            <div style={{ background: '#111', border: '1px solid var(--gold)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: 'var(--gold)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Net Monthly Profit / (Loss)</span>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: netPlatformProfit >= 0 ? 'var(--grass)' : '#f44336', marginTop: '0.5rem' }}>
                    {netPlatformProfit >= 0 ? '+' : '-'}${Math.abs(netPlatformProfit).toLocaleString(undefined, {minimumFractionDigits: 2})}
                </span>
            </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
            
            {/* The Ledger Table */}
            <div>
               <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Operating Expenses Ledger</h2>
               <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                        <thead>
                            <tr style={{ background: '#1a1a1a', borderBottom: '1px solid #333' }}>
                                <th style={{ padding: '1rem', color: '#888', fontWeight: 500 }}>EXPENSE</th>
                                <th style={{ padding: '1rem', color: '#888', fontWeight: 500 }}>CATEGORY</th>
                                <th style={{ padding: '1rem', color: '#888', fontWeight: 500 }}>TYPE</th>
                                <th style={{ padding: '1rem', color: '#888', fontWeight: 500, textAlign: 'right' }}>COST</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Dynamically Injected Variable Cost: Firecrawl Burn */}
                            <tr style={{ borderBottom: '1px solid #222', background: 'rgba(212,175,55,0.02)' }}>
                                <td style={{ padding: '1rem', color: '#fff', fontWeight: 500 }}>
                                    FireCrawl Spider API
                                    <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '4px' }}>{firecrawlStats?.totalCredits || 0} Credits Consumed</div>
                                </td>
                                <td style={{ padding: '1rem', color: '#ccc' }}>Infrastructure</td>
                                <td style={{ padding: '1rem' }}><span style={{ padding: '0.2rem 0.5rem', background: '#333', borderRadius: '4px', fontSize: '0.75rem' }}>Variable Storage</span></td>
                                <td style={{ padding: '1rem', textAlign: 'right', color: '#f44336', fontWeight: 600 }}>
                                    -${variableExpensesTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}
                                </td>
                            </tr>

                            {expenses.map(exp => (
                                <tr key={exp.id} style={{ borderBottom: '1px solid #222' }}>
                                    <td style={{ padding: '1rem', color: '#fff', fontWeight: 500 }}>{exp.name}</td>
                                    <td style={{ padding: '1rem', color: '#ccc' }}>{exp.category}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{ padding: '0.2rem 0.5rem', background: exp.frequency === 'one-time' ? 'rgba(255,152,0,0.1)' : '#333', color: exp.frequency === 'one-time' ? '#ff9800' : '#ccc', borderRadius: '4px', fontSize: '0.75rem' }}>
                                            {exp.frequency.toUpperCase()}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right', color: exp.frequency === 'one-time' ? '#ff9800' : '#f44336', fontWeight: 600 }}>
                                        -${exp.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
               </div>
            </div>

            {/* Insertion Form */}
            <div>
               <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Log New Expense</h2>
               <form action={addExpense} style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem' }}>Expense Name (e.g. Graphic Designer, Vercel)</label>
                        <input type="text" name="name" required style={{ width: '100%', padding: '0.75rem', background: '#000', border: '1px solid #333', borderRadius: '6px', color: '#fff' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem' }}>Amount Spent ($)</label>
                        <input type="number" step="0.01" name="amount" required style={{ width: '100%', padding: '0.75rem', background: '#000', border: '1px solid #333', borderRadius: '6px', color: '#fff' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem' }}>Frequency</label>
                        <select name="frequency" style={{ width: '100%', padding: '0.75rem', background: '#000', border: '1px solid #333', borderRadius: '6px', color: '#fff' }}>
                            <option value="monthly">Monthly Recurring</option>
                            <option value="one-time">One-Time Sunk Cost</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem' }}>Category</label>
                        <select name="category" style={{ width: '100%', padding: '0.75rem', background: '#000', border: '1px solid #333', borderRadius: '6px', color: '#fff' }}>
                            <option value="Software">Software & Subscriptions</option>
                            <option value="Infrastructure">Infrastructure (AWS, DB)</option>
                            <option value="Legal">Legal & Compliance</option>
                            <option value="Marketing">Marketing & Ads</option>
                            <option value="Contractors">Contractors / Services</option>
                        </select>
                    </div>
                    <button type="submit" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', background: 'var(--gold)', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem' }}>
                        <Plus size={16} /> Append to Ledger
                    </button>
               </form>
            </div>

        </div>
    </div>
  );
}

function LedgerCard({ title, value, highlight }: { title: string, value: string, highlight: string }) {
  return (
    <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        <span style={{ color: '#888', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</span>
        <span style={{ fontSize: '2rem', fontWeight: 800, color: highlight, marginTop: '0.5rem' }}>{value}</span>
    </div>
  );
}
