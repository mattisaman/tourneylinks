import React from 'react';
import { Section, Text, Button, Link } from '@react-email/components';
import BaseLayout from './BaseLayout';

interface HostInquiryEmailProps {
  senderEmail: string;
  tournamentName: string;
  message: string;
}

export default function HostInquiryEmail({ senderEmail = 'player@example.com', tournamentName = 'The Classic', message = 'Do we have a frost delay?' }: HostInquiryEmailProps) {
  return (
    <BaseLayout preview={`New Message for ${tournamentName}`}>
      <Section style={{ marginBottom: '24px' }}>
         <Text className="text-[18px] font-bold text-[#c9a84c] tracking-widest uppercase m-0 mb-4">
            NEW INQUIRY ROUTED SECURELY
         </Text>
         <Text className="text-[16px] text-[#f5f0e8] leading-[26px]">
            You have received a new message regarding <strong>{tournamentName}</strong>. 
         </Text>
      </Section>

      {/* Message Card */}
      <Section className="bg-[#12241b] border-l-4 border-l-[#3b82f6] rounded-r-xl p-6 mb-8">
         <Text className="text-[14px] text-[#8e9894] uppercase tracking-widest m-0 font-bold mb-2">From</Text>
         <Text className="text-[16px] text-white m-0 mb-4">{senderEmail}</Text>
         
         <Text className="text-[14px] text-[#8e9894] uppercase tracking-widest m-0 font-bold mb-2">Message</Text>
         <Text className="text-[16px] text-[#b3b9b6] leading-[26px] m-0 italic">"{message}"</Text>
      </Section>

      <Section className="text-center mb-8">
         <Button 
            href={`mailto:${senderEmail}?subject=Re: Your Inquiry regarding ${tournamentName}`} 
            className="bg-[#3b82f6] text-white px-10 py-4 font-bold rounded-[30px] uppercase tracking-widest text-[14px] inline-block shadow-lg"
         >
            Reply Directly to {senderEmail}
         </Button>
      </Section>
    </BaseLayout>
  );
}
