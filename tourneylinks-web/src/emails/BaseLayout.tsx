import { Body, Container, Head, Html, Tailwind, Preview, Font } from '@react-email/components';
import React from 'react';

export default function BaseLayout({ children, preview }: { children: React.ReactNode, preview: string }) {
    return (
        <Html>
            <Head>
               <Font fontFamily="Inter" fallbackFontFamily="Helvetica" webFont={{ url: "https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7W0Q5nw.woff2", format: "woff2" }} />
            </Head>
            <Preview>{preview}</Preview>
            <Tailwind>
                <Body className="bg-[#05120c] font-sans m-0 p-4">
                    <Container className="bg-[#0a1a12] border border-[#232c28] rounded-2xl mx-auto mt-10 mb-10 p-10 max-w-[600px] text-white overflow-hidden shadow-2xl">
                        
                        {/* Branded Header */}
                        <div className="mb-10 text-center border-b border-[#232c28] pb-6">
                            <h2 className="text-[28px] font-bold text-[#f5f0e8] m-0 font-serif">
                                TourneyLinks
                            </h2>
                            <p className="text-[#c9a84c] text-xs font-bold uppercase tracking-[0.2em] m-0 mt-2">
                                Tournament Operations
                            </p>
                        </div>
                        
                        {children}
                        
                        {/* Secure Footer */}
                        <div className="mt-12 text-center text-[#8e9894] text-xs uppercase tracking-widest border-t border-[#232c28] pt-8">
                            POWERED EXCLUSIVELY BY TOURNEYLINKS<br/>
                            <span className="text-[#3b594b] mt-2 block">100% Free to Use for Amatuer Golf Scrambles</span>
                        </div>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
