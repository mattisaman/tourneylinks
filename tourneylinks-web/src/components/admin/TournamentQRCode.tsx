'use client';

import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function TournamentQRCode({ tournamentId, publicName }: { tournamentId: number, publicName: string }) {
  const [url, setUrl] = useState('');

  useEffect(() => {
    // Generate the absolute URL for the QR code ensuring mobile devices scan properly to the public registration/scoring link
    setUrl(`${window.location.origin}/tournaments/${tournamentId}/play`);
  }, [tournamentId]);

  return (
    <div className="dash-card">
      <div className="dash-card-header">
        <div className="dash-card-title">📱 Live Event QR Code</div>
      </div>
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--mist)', marginBottom: '1.25rem' }}>
          Print this code and tape it to the clubhouse counter or carts. Golfers scan it to instantly access Live Scoring and Leaderboards without downloading an app.
        </p>
        
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}>
          {url ? (
            <QRCodeSVG 
              value={url} 
              size={180} 
              bgColor={"#ffffff"} 
              fgColor={"#05120c"} 
              level={"M"}
              includeMargin={false}
            />
          ) : (
            <div style={{ width: 180, height: 180, background: '#eee' }}></div>
          )}
        </div>
        
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', width: '100%', justifyContent: 'center' }}>
          <button 
            className="btn-primary" 
            style={{ padding: '0.6rem 1rem', fontSize: '0.8rem' }}
            onClick={() => {
              // Basic raw print for just the QR code if they want it large, though the Print Station handles entire cart signs.
              const printWin = window.open('', '', 'width=600,height=600');
              if (printWin) {
                printWin.document.write(`
                  <html>
                    <head><title>Print QR Code - ${publicName}</title></head>
                    <body style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; margin:0; font-family:sans-serif;">
                      <h1 style="margin-bottom:2rem;">${publicName}</h1>
                      <div style="transform: scale(2);">${document.querySelector('.qrcode-svg-container')?.innerHTML || ''}</div>
                      <h3 style="margin-top:4rem; color:#666;">Scan to join live scoring</h3>
                    </body>
                  </html>
                `);
                printWin.document.close();
                printWin.focus();
                // We use a timeout to let SVG render
                setTimeout(() => { printWin.print(); printWin.close(); }, 500);
              }
            }}
          >
            🖨️ Quick Print
          </button>
        </div>
      </div>
      <div className="qrcode-svg-container" style={{ display: 'none' }}>
        {url && <QRCodeSVG value={url} size={256} />}
      </div>
    </div>
  );
}
