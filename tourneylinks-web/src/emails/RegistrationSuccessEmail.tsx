import React from 'react';
import { Section, Text, Button, Link } from '@react-email/components';
import BaseLayout from './BaseLayout';

interface RegistrationSuccessEmailProps {
  playerName: string;
  tournamentName: string;
  format: string;
  transactionId: string;
  tournamentUrl: string;
}

export default function RegistrationSuccessEmail({ playerName = 'Golfer', tournamentName = 'The Classic Scramble', format = 'SCRAMBLE', transactionId = 'FREE_ENTRY', tournamentUrl = 'https://tourneylinks.com' }: RegistrationSuccessEmailProps) {
  return (
    <BaseLayout preview="Registration Confirmed. See you on the tee box!">
      <Section style={{ marginBottom: '24px' }}>
         <Text className="text-[18px] text-[#f5f0e8] leading-[28px]">
            Hi {playerName},
         </Text>
         <Text className="text-[16px] text-[#b3b9b6] leading-[26px]">
            Your registration for <strong>{tournamentName}</strong> is officially verified and secured!
         </Text>
      </Section>

      {/* Verification Card */}
      <Section className="bg-[#12241b] border border-[#232c28] rounded-xl p-6 mb-8 text-center">
         <Text className="text-[14px] text-[#c9a84c] uppercase tracking-widest m-0 font-bold mb-2">Event Registration #</Text>
         <Text className="text-[20px] font-mono text-white m-0 tracking-widest">{transactionId}</Text>
         <Text className="text-[12px] text-[#8e9894] mt-2 mb-0">Format: {format.replace('_', ' ')}</Text>
      </Section>

      <Section className="text-center mb-8">
         <Button 
            href={`${tournamentUrl}/play`} 
            className="bg-[#c9a84c] text-black px-10 py-4 font-bold rounded-[30px] uppercase tracking-widest text-[14px] inline-block shadow-lg"
         >
            Access Live Scoring
         </Button>
      </Section>

      <Text className="text-[14px] text-[#b3b9b6] leading-[24px]">
         If you need to make any changes to your core roster or request a refund, please contact the Tournament Organizer.
      </Text>
    </BaseLayout>
  );
}
