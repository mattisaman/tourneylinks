export type FormattingType = 'INDIVIDUAL' | 'TEAM';
export type ScoringBase = 'STROKE' | 'MATCH' | 'STABLEFORD' | 'POINTS';

export interface ScoringFormatDef {
  id: string;
  name: string;
  type: FormattingType;
  base: ScoringBase;
  usesHandicap: boolean;
  description: string;
}

export const SCORING_FORMATS: Record<string, ScoringFormatDef> = {
  // --- INDIVIDUAL FORMATS ---
  STROKE_GROSS: { id: 'STROKE_GROSS', name: 'Stroke Play (Gross)', type: 'INDIVIDUAL', base: 'STROKE', usesHandicap: false, description: 'Pure stroke play. The lowest total actual strokes wins.' },
  STROKE_NET: { id: 'STROKE_NET', name: 'Stroke Play (Net)', type: 'INDIVIDUAL', base: 'STROKE', usesHandicap: true, description: 'Stroke play adjusted by Course Handicap. Lowest Net score wins.' },
  STABLEFORD_GROSS: { id: 'STABLEFORD_GROSS', name: 'Stableford (Gross)', type: 'INDIVIDUAL', base: 'STABLEFORD', usesHandicap: false, description: 'Points awarded based on fixed score per hole (1 for Bogey, 2 for Par, etc).' },
  STABLEFORD_NET: { id: 'STABLEFORD_NET', name: 'Stableford (Net)', type: 'INDIVIDUAL', base: 'STABLEFORD', usesHandicap: true, description: 'Points awarded based on Net Score per hole.' },
  MODIFIED_STABLEFORD: { id: 'MODIFIED_STABLEFORD', name: 'Modified Stableford', type: 'INDIVIDUAL', base: 'STABLEFORD', usesHandicap: false, description: 'PGA Tour style scoring (e.g. +8 Albatross, +5 Eagle, +2 Birdie, -1 Bogey, -3 Double).' },
  MATCH_PLAY: { id: 'MATCH_PLAY', name: 'Match Play', type: 'INDIVIDUAL', base: 'MATCH', usesHandicap: false, description: 'Hole-by-Hole play. Win the hole, win a point.' },
  MATCH_PLAY_NET: { id: 'MATCH_PLAY_NET', name: 'Match Play (Net)', type: 'INDIVIDUAL', base: 'MATCH', usesHandicap: true, description: 'Net Match Play. Strokes "pop" on the hardest handicap holes.' },
  SKINS_GROSS: { id: 'SKINS_GROSS', name: 'Skins (Gross)', type: 'INDIVIDUAL', base: 'STROKE', usesHandicap: false, description: 'Golfer with the lowest outright score on a hole wins a skin.' },
  SKINS_NET: { id: 'SKINS_NET', name: 'Skins (Net)', type: 'INDIVIDUAL', base: 'STROKE', usesHandicap: true, description: 'Lowest Net score on a hole wins a skin.' },
  QUOTA: { id: 'QUOTA', name: 'Quota System', type: 'INDIVIDUAL', base: 'POINTS', usesHandicap: true, description: 'Players target a specific quota (e.g. 36 minus handicap) and earn points (1 Bogey, 2 Par) to beat it.' },
  
  // --- TEAM FORMATS ---
  SCRAMBLE_2: { id: 'SCRAMBLE_2', name: '2-Man Scramble', type: 'TEAM', base: 'STROKE', usesHandicap: true, description: 'Both players hit, choose the best shot, both hit from there.' },
  SCRAMBLE_4: { id: 'SCRAMBLE_4', name: '4-Man Scramble', type: 'TEAM', base: 'STROKE', usesHandicap: true, description: 'Standard 4-player scramble format.' },
  TEXAS_SCRAMBLE: { id: 'TEXAS_SCRAMBLE', name: 'Texas Scramble', type: 'TEAM', base: 'STROKE', usesHandicap: true, description: '4-Man scramble but requires a minimum number of drives used per player.' },
  FLORIDA_SCRAMBLE: { id: 'FLORIDA_SCRAMBLE', name: 'Florida Scramble (Step Aside)', type: 'TEAM', base: 'STROKE', usesHandicap: false, description: 'The player whose shot is selected must sit out the next shot.' },
  SHAMBLE_2: { id: 'SHAMBLE_2', name: '2-Man Shamble', type: 'TEAM', base: 'STROKE', usesHandicap: true, description: 'Both hit a drive, select the best drive, then both play out their own ball until holed.' },
  SHAMBLE_4: { id: 'SHAMBLE_4', name: '4-Man Shamble', type: 'TEAM', base: 'STROKE', usesHandicap: true, description: 'Select best drive, everyone plays their own ball in. Best 2 net scores usually taken.' },
  BEST_BALL_2: { id: 'BEST_BALL_2', name: '2-Man Best Ball (Fourball)', type: 'TEAM', base: 'STROKE', usesHandicap: true, description: 'Both players play their own ball. The lowest single net score counts for the team hole.' },
  BEST_BALL_4: { id: 'BEST_BALL_4', name: '4-Man Best Ball (1 Best)', type: 'TEAM', base: 'STROKE', usesHandicap: true, description: 'All play. Take the single best net score from the 4 players.' },
  BEST_BALL_4_2: { id: 'BEST_BALL_4_2', name: '4-Man Best Ball (2 Best Net)', type: 'TEAM', base: 'STROKE', usesHandicap: true, description: 'All play. Combine the top 2 net scores per hole for the team score.' },
  ALT_SHOT: { id: 'ALT_SHOT', name: 'Alternate Shot (Foursomes)', type: 'TEAM', base: 'STROKE', usesHandicap: true, description: 'Players take alternating turns hitting the same ball until holed.' },
  CHAPMAN: { id: 'CHAPMAN', name: 'Chapman (Pinehurst)', type: 'TEAM', base: 'STROKE', usesHandicap: true, description: 'Both drive, hit each other\'s second shot, pick the best ball, then Alternate Shot.' },
  RYDER_CUP: { id: 'RYDER_CUP', name: 'Ryder Cup Rotation', type: 'TEAM', base: 'MATCH', usesHandicap: true, description: 'Rotates Alternate Shot, Best Ball, and Singles matches over multiple days.' },
  BINGO_BANGO_BONGO: { id: 'BINGO_BANGO_BONGO', name: 'Bingo Bango Bongo', type: 'TEAM', base: 'POINTS', usesHandicap: false, description: 'Points for First on Green, Closest to Pin, and First in Hole.' },
  NINE_POINT: { id: 'NINE_POINT', name: '9-Point System', type: 'TEAM', base: 'POINTS', usesHandicap: true, description: 'Foursome divides 9 points per hole based on strokes (e.g. 5 for 1st, 3 for 2nd, 1 for 3rd).' },
  WOLF: { id: 'WOLF', name: 'Wolf', type: 'TEAM', base: 'POINTS', usesHandicap: true, description: 'One player is Wolf each hole and chooses a partner after seeing drives, or goes Lone Wolf.' },
  VEGAS: { id: 'VEGAS', name: 'Vegas', type: 'TEAM', base: 'POINTS', usesHandicap: true, description: '2 vs 2. Scores are paired rather than added (e.g. a 4 and 5 is a 45).' },
  MONEY_BALL: { id: 'MONEY_BALL', name: 'Money Ball (Lone Ranger)', type: 'TEAM', base: 'STROKE', usesHandicap: true, description: '4-Man team. One rotating player\'s score MUST count, plus the best score of the other three.' },
  
  // --- SPECIALTY FORMATS ---
  BLIND_DRAW: { id: 'BLIND_DRAW', name: 'Blind Draw Pro-Am', type: 'TEAM', base: 'STROKE', usesHandicap: true, description: 'Amateur pairs with a randomly drawn PGA Tour player\'s weekend score.' },
  PEORIA: { id: 'PEORIA', name: 'Peoria System', type: 'INDIVIDUAL', base: 'STROKE', usesHandicap: false, description: 'System calculates a massive handicap adjustment based on 6 secretly selected holes.' },
  CALLAWAY: { id: 'CALLAWAY', name: 'Callaway System', type: 'INDIVIDUAL', base: 'STROKE', usesHandicap: false, description: 'Complex table-based handicap calculation for players without an official GHIN.' },
  SIX_SIX_SIX: { id: 'SIX_SIX_SIX', name: '6-6-6 Tournament', type: 'TEAM', base: 'STROKE', usesHandicap: true, description: 'Holes 1-6 Scramble, 7-12 Best Ball, 13-18 Alternate Shot.' },
};

export function getFormatDef(id: string): ScoringFormatDef | null {
  return SCORING_FORMATS[id] || null;
}
