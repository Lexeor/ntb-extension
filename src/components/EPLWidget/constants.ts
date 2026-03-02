export const API_BASE = import.meta.env.DEV
  ? '/proxy/football/v4'
  : 'https://api.football-data.org/v4'
export const UPDATE_INTERVAL_MS = 24 * 60 * 60 * 1000
export const TEAM_KEY = 'eplTeamId'
export const DEFAULT_TEAM_ID = 57 // Arsenal

export const TEAM_COLORS: Record<number, string> = {
  57:   '#EF0107', // Arsenal
  58:   '#95BFE5', // Aston Villa (light blue stripe)
  1044: '#DA291C', // Bournemouth
  402:  '#E30613', // Brentford
  397:  '#0057B8', // Brighton
  61:   '#034694', // Chelsea
  354:  '#C4122E', // Crystal Palace
  62:   '#003399', // Everton
  63:   '#CC0000', // Fulham
  349:  '#0044A9', // Ipswich
  338:  '#003090', // Leicester
  64:   '#C8102E', // Liverpool
  65:   '#6CABDD', // Man City
  66:   '#DA291C', // Man United
  67:   '#568CCD', // Newcastle (lightened so glow is visible)
  351:  '#DD0000', // Nott'm Forest
  340:  '#D71920', // Southampton
  73:   '#6B84C0', // Spurs (lightened navy)
  563:  '#B0003A', // West Ham
  76:   '#FDB913', // Wolves
}

export const EPL_TEAMS: { id: number; shortName: string }[] = [
  { id: 57,   shortName: 'Arsenal' },
  { id: 58,   shortName: 'Aston Villa' },
  { id: 1044, shortName: 'Bournemouth' },
  { id: 402,  shortName: 'Brentford' },
  { id: 397,  shortName: 'Brighton' },
  { id: 61,   shortName: 'Chelsea' },
  { id: 354,  shortName: 'Crystal Palace' },
  { id: 62,   shortName: 'Everton' },
  { id: 63,   shortName: 'Fulham' },
  { id: 349,  shortName: 'Ipswich Town' },
  { id: 338,  shortName: 'Leicester City' },
  { id: 64,   shortName: 'Liverpool' },
  { id: 65,   shortName: 'Man City' },
  { id: 66,   shortName: 'Man United' },
  { id: 67,   shortName: 'Newcastle' },
  { id: 351,  shortName: "Nott'm Forest" },
  { id: 340,  shortName: 'Southampton' },
  { id: 73,   shortName: 'Spurs' },
  { id: 563,  shortName: 'West Ham' },
  { id: 76,   shortName: 'Wolves' },
]
