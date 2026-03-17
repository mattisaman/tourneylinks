
import Hero from "@/components/ui/Hero";
import Tournaments from "@/components/ui/Tournaments";
import HomeFeatures from "@/components/ui/HomeFeatures";

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Tournaments />
      <HomeFeatures />
    </main>
  );
}
