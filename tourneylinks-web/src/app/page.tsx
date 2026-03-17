import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/ui/Hero";
import Tournaments from "@/components/ui/Tournaments";
import HomeFeatures from "@/components/ui/HomeFeatures";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Tournaments />
      <HomeFeatures />
    </main>
  );
}
