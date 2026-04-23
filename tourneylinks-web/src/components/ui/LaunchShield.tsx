import React from "react";
import Image from "next/image";
import { SignInButton, SignOutButton } from "@clerk/nextjs";
import { User } from "lucide-react";

export default function LaunchShield({ isAuthd }: { isAuthd: boolean }) {
  return (
    <div className="relative min-h-screen w-full bg-[#05120c] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg-1.jpg"
          alt="Golf Course Background"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05120c] via-transparent to-[#05120c]/80" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 w-full max-w-lg">
        <div className="mb-8 w-64 md:w-80 relative h-20">
          <Image
            src="/logo_horizontal_transparent.png"
            alt="TourneyLinks Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        
        <h1 className="text-3xl md:text-5xl font-serif text-[#d6b772] text-center mb-4 tracking-wider">
          Launching Soon
        </h1>
        
        <p className="text-[#aeb9b2] text-center text-lg md:text-xl font-sans max-w-2xl leading-relaxed">
          The unified golf ecosystem bridging the management and communication gaps between tournament hosts, sponsors, course professionals, and hospitality. We are driving participation by empowering golfers to easily discover and join local tournaments wherever they are.
        </p>

        {isAuthd && (
          <div className="mt-8">
            <SignOutButton>
              <button className="text-xs text-[#aeb9b2]/60 hover:text-[#d6b772] transition-colors uppercase tracking-widest">
                Sign Out / Switch Account
              </button>
            </SignOutButton>
          </div>
        )}
      </div>

      {/* Subtle Admin Backdoor */}
      {!isAuthd && (
        <div className="absolute bottom-4 right-4 z-20 opacity-10 hover:opacity-100 transition-opacity duration-300">
          <SignInButton mode="modal">
            <button aria-label="Admin Login" className="p-2">
              <User className="w-6 h-6 text-[#d6b772]" />
            </button>
          </SignInButton>
        </div>
      )}
    </div>
  );
}
