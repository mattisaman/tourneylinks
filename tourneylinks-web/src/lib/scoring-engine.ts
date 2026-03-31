export type CourseHole = { holeNumber: number; par: number; handicapData?: number | null };
export type PlayerScore = { registrationId: number; holeNumber: number; grossScore: number };
export type PlayerDef = { id: number; name: string; handicap: number };

export type FormatResult = {
  registrationId: number;
  name: string;
  holesPlayed: number;
  totalStrokes: number; // Raw strokes used globally
  sortValue: number;    // Defines leaderboard ranking
  displayScore: string; // "+2", "34 PTS", "3 Skins"
  rawScoresByHole: Record<number, { gross: number; net: number; points: number }>;
};

export class FormatEngine {
  format: string;
  holes: Record<number, CourseHole>;
  players: PlayerDef[];
  scores: PlayerScore[];

  constructor(format: string, courseHoles: CourseHole[], players: PlayerDef[], scores: PlayerScore[]) {
    this.format = format.toUpperCase();
    this.players = players;
    this.scores = scores;

    this.holes = {};
    for (let h of courseHoles) {
      this.holes[h.holeNumber] = h;
    }
    // Fallback if course missing
    for (let i = 1; i <= 18; i++) {
        if (!this.holes[i]) this.holes[i] = { holeNumber: i, par: 4, handicapData: i };
    }
  }

  // Calculate Course Handicap (MVP: just use their flat GHIN index)
  private getStrokesForHole(playerHandicap: number, holeHdcp: number): number {
      if (!holeHdcp) return 0;
      let strokes = 0;
      let h = Math.abs(Math.round(playerHandicap)); // Ignore + handicaps for MVP standard logic
      while(h >= holeHdcp) {
          strokes++;
          h -= 18;
      }
      // If scratch (+ handicap), they GIVE strokes on easiest holes (18, 17...)
      if (playerHandicap < 0) {
          let plusH = Math.abs(Math.round(playerHandicap));
          // Reverse lookup: easiest hole is 18
          let reverseHdcp = 19 - holeHdcp; 
          while (plusH >= reverseHdcp) {
              return -1; // They give a stroke back (usually max 1 per hole)
          }
      }
      return strokes;
  }

  public computeLeaderboard(): FormatResult[] {
     const results: FormatResult[] = [];
     const isNet = this.format.includes('NET');
     const isStableford = this.format.includes('STABLEFORD');
     const isSkins = this.format.includes('SKINS');
     const isScramble = this.format === 'SCRAMBLE'; // Gross team format
     
     // 1. Group Scores per Player
     const playerStatsContainer: Record<number, FormatResult> = {};
     
     for (const p of this.players) {
         playerStatsContainer[p.id] = {
             registrationId: p.id,
             name: p.name,
             holesPlayed: 0,
             totalStrokes: 0,
             sortValue: 0,
             displayScore: 'E',
             rawScoresByHole: {}
         };
     }

     for (const s of this.scores) {
         if (!playerStatsContainer[s.registrationId]) continue;
         const pStat = playerStatsContainer[s.registrationId];
         pStat.totalStrokes += s.grossScore;
         pStat.holesPlayed++;

         const targetHole = this.holes[s.holeNumber];
         const pDef = this.players.find(p => p.id === s.registrationId);
         
         const strokesGiven = isNet ? this.getStrokesForHole(pDef?.handicap || 0, targetHole.handicapData || s.holeNumber) : 0;
         const netScore = Math.max(1, s.grossScore - strokesGiven);
         
         // Stableford Logic 
         // Double Eagle: 5, Eagle: 4, Birdie: 3, Par: 2, Bogey: 1, Dbl+: 0
         let points = 0;
         if (isStableford) {
             const scoreToUse = isNet ? netScore : s.grossScore;
             const diff = scoreToUse - targetHole.par;
             if (diff <= -3) points = 5;
             else if (diff === -2) points = 4;
             else if (diff === -1) points = 3;
             else if (diff === 0) points = 2;
             else if (diff === 1) points = 1;
             else points = 0;
         }

         pStat.rawScoresByHole[s.holeNumber] = {
             gross: s.grossScore,
             net: netScore,
             points: points
         };
     }

     // 2. Perform Format-Specific Aggregations
     if (isSkins) {
         // Everyone vs Everyone on a hole-by-hole basis
         // Determine winning scores for each hole
         const skinsWon: Record<number, number> = {}; // Player ID -> Total Skins
         for (let h = 1; h <= 18; h++) {
             let lowestScore = 999;
             let lowestPlayerIds: number[] = [];
             
             for (const p of this.players) {
                 const s = playerStatsContainer[p.id].rawScoresByHole[h];
                 if (!s) continue;
                 const scoreToUse = isNet ? s.net : s.gross;
                 
                 if (scoreToUse < lowestScore) {
                     lowestScore = scoreToUse;
                     lowestPlayerIds = [p.id];
                 } else if (scoreToUse === lowestScore) {
                     lowestPlayerIds.push(p.id);
                 }
             }

             // Only outright winner gets the skin
             if (lowestPlayerIds.length === 1) {
                 const winnerId = lowestPlayerIds[0];
                 skinsWon[winnerId] = (skinsWon[winnerId] || 0) + 1;
             }
         }

         // Map Skins back to players
         for (const p of this.players) {
             const stat = playerStatsContainer[p.id];
             const skins = skinsWon[p.id] || 0;
             stat.sortValue = skins * -1; // Highest skins = lowest sortValue = rank 1
             stat.displayScore = skins === 1 ? '1 Skin' : `${skins} Skins`;
             results.push(stat);
         }
     } 
     else if (isStableford) {
         for (const p of this.players) {
             const stat = playerStatsContainer[p.id];
             let totalPoints = 0;
             Object.values(stat.rawScoresByHole).forEach(h => totalPoints += h.points);
             
             stat.sortValue = totalPoints * -1; // Highest points wins
             stat.displayScore = stat.holesPlayed === 0 ? '--' : `${totalPoints} PTS`;
             results.push(stat);
         }
     }
     else {
         // Default Stroke Play & Scrambles
         for (const p of this.players) {
             const stat = playerStatsContainer[p.id];
             let cumulativePar = 0;
             let totalUsedStrokes = 0;

             Object.keys(stat.rawScoresByHole).forEach(hKey => {
                 const h = parseInt(hKey);
                 cumulativePar += this.holes[h].par;
                 totalUsedStrokes += isNet ? stat.rawScoresByHole[h].net : stat.rawScoresByHole[h].gross;
             });

             const relPar = stat.holesPlayed > 0 ? totalUsedStrokes - cumulativePar : 0;
             
             stat.sortValue = relPar; // Lowest relPar wins
             stat.displayScore = stat.holesPlayed === 0 ? 'E' : relPar > 0 ? `+${relPar}` : relPar === 0 ? 'E' : `${relPar}`;
             results.push(stat);
         }
     }

     // 3. Sort standard leaderboard
     results.sort((a, b) => {
         // First by Sort Value natively computed
         if (a.sortValue !== b.sortValue) return a.sortValue - b.sortValue;
         // Tie-breakers: More holes played means they are maintaining that score deeper into the round
         return b.holesPlayed - a.holesPlayed; 
     });

     return results;
  }
}
