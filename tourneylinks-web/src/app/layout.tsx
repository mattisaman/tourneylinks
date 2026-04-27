import type { Metadata, Viewport } from "next";
import { DM_Sans, Playfair_Display, DM_Mono, Great_Vibes, Cinzel, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import LaunchShield from "@/components/ui/LaunchShield";
import { ClerkProvider } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { Analytics } from "@vercel/analytics/react";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const dmMono = DM_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const greatVibes = Great_Vibes({
  variable: "--font-cursive",
  subsets: ["latin"],
  weight: "400",
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "TourneyLinks Platform",
  description: "Nationwide Golf Tournament Discovery and Handicap Verification",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TourneyLinks",
  },
  themeColor: "#05120c",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress;
  
  const allowedEmails = [
    'joshuafribush@gmail.com',
    'mattisaman@gmail.com'
  ];
  
  const isAllowed = process.env.NODE_ENV === 'development' || (!!email && allowedEmails.includes(email));
  const isAuthd = !!user;

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${dmSans.variable} ${playfair.variable} ${dmMono.variable} ${greatVibes.variable} ${cinzel.variable} ${cormorant.variable} antialiased font-sans`}
        >
          {!isAllowed ? (
            <LaunchShield isAuthd={isAuthd} />
          ) : (
            <>
              <Navbar />
              {children}
              <Footer />
            </>
          )}
          <script dangerouslySetInnerHTML={{ __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').catch(function(err) {});
              });
            }
          `}} />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
