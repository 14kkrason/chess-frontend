export interface ProfileResults {
  _id: string;
  username: string;
  games: string[];
  eloBullet: number;
  eloBlitz: number;
  eloRapid: number;
  bulletNumber: number;
  blitzNumber: number;
  rapidNumber: number;
  eloProgressionBullet: { date: number; elo: number }[];
  eloProgressionBlitz: { date: number; elo: number }[];
  eloProgressionRapid: { date: number; elo: number }[];
}
