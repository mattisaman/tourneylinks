
import Hero from "@/components/ui/Hero";
import ExplainerVideo from "@/components/ui/ExplainerVideo";
import HomeFeatures from "@/components/ui/HomeFeatures";

export const revalidate = 3600;

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <ExplainerVideo />
      <HomeFeatures />
    </main>
  );
}
