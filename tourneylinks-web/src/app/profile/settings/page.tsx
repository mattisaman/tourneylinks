import { UserProfile } from "@clerk/nextjs";

export default function UserSettingsPage() {
  return (
    <div className="min-h-screen flex flex-col items-center py-16 px-4 relative overflow-hidden" style={{ backgroundColor: '#071510' }}>
       
       <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--gold)] opacity-[0.03] rounded-full blur-3xl pointer-events-none"></div>

       <div className="w-full max-w-[55rem] flex items-center justify-between mb-8 relative z-10">
         <h1 className="text-3xl md:text-4xl text-[var(--gold)] font-bold tracking-tight" style={{ fontFamily: 'var(--font-serif), serif'}}>
            Master Account Settings
         </h1>
         <a href="/profile" className="btn-hero-outline text-sm px-6 py-2 tracking-widest uppercase">
            ← Save & Return
         </a>
       </div>

       <div className="w-full max-w-[55rem] relative z-10 shadow-[0_20px_60px_rgba(0,0,0,0.4)] rounded-2xl overflow-hidden border border-[rgba(201,168,76,0.2)]">
         <UserProfile 
           appearance={{
             elements: {
               rootBox: "w-full",
               cardBox: "w-full shadow-none border-none",
             }
           }}
         />
       </div>

    </div>
  );
}
