import React from 'react';
import { Section, Text, Button, Link } from '@react-email/components';
import BaseLayout from './BaseLayout';

interface MassAnnouncementEmailProps {
  tournamentName: string;
  message: string;
}

export default function MassAnnouncementEmail({ tournamentName = 'The Classic Scramble', message = 'Frost delay ends at 10 AM.' }: MassAnnouncementEmailProps) {
  return (
    <BaseLayout preview={`IMPORTANT: Update regarding ${tournamentName}`}>
      <Section className="bg-[#ff4d4f] rounded-t-[20px] p-[2px] mx-[-40px] mt-[-40px] mb-8" />
      
      <Section style={{ marginBottom: '24px' }}>
         <Text className="text-[14px] font-black text-[#ff4d4f] tracking-widest uppercase m-0 mb-4 text-center">
            Tournament Announcement
         </Text>
         <Text className="text-[22px] text-center text-white font-serif leading-[1.2] mb-6">
            Latest Update for <br/><span className="text-[#c9a84c]">{tournamentName}</span>
         </Text>
      </Section>

      {/* Broadcast Message Card */}
      <Section className="bg-[#0a1a12] border border-[#ff4d4f] rounded-xl p-8 mb-8 text-center shadow-[0_0_30px_rgba(255,77,79,0.15)]">
         <Text className="text-[18px] text-[#f5f0e8] leading-[30px] m-0">
            {message}
         </Text>
      </Section>

      <Text className="text-[14px] text-center text-[#b3b9b6] leading-[24px]">
         This message was broadcast directly by the Tournament Director using the TourneyLinks Admin Matrix. Do not reply to this email.
      </Text>
    </BaseLayout>
  );
}
