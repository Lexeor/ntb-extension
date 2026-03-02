export interface EPLTeam {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
}

export interface EPLMatch {
  id: number;
  utcDate: string;
  status: string;
  venue?: string;
  homeTeam: EPLTeam;
  awayTeam: EPLTeam;
  competition: { name: string; code: string };
  received: string;
}

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
}
