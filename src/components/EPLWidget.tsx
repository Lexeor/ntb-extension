import React, { useState, useEffect } from 'react'

const FOOTBALL_API_KEY = import.meta.env.VITE_FOOTBALL_API_KEY
const API_BASE = import.meta.env.DEV
  ? '/proxy/football/v4'
  : 'https://api.football-data.org/v4'
const UPDATE_INTERVAL_MS = 24 * 60 * 60 * 1000
const TEAM_KEY = 'eplTeamId'
const DEFAULT_TEAM_ID = 57 // Arsenal

interface EPLTeam {
  id: number
  name: string
  shortName: string
  tla: string
  crest: string
}

interface EPLMatch {
  id: number
  utcDate: string
  status: string
  venue?: string
  homeTeam: EPLTeam
  awayTeam: EPLTeam
  competition: { name: string; code: string }
  received: string
}

const TEAM_COLORS: Record<number, string> = {
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

const EPL_TEAMS: { id: number; shortName: string }[] = [
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

function cacheKey(teamId: number): string {
  return `eplMatch_${teamId}`
}

interface Countdown { days: number; hours: number; minutes: number }

function getCountdown(matchDate: Date): Countdown {
  const diff = Math.max(0, matchDate.getTime() - Date.now())
  const totalMinutes = Math.floor(diff / 60_000)
  return {
    days:    Math.floor(totalMinutes / 1440),
    hours:   Math.floor((totalMinutes % 1440) / 60),
    minutes: totalMinutes % 60,
  }
}

function formatMatchDate(dateStr: string): string {
  const d = new Date(dateStr)
  const weekday = d.toLocaleDateString('en-GB', { weekday: 'short' })
  const day = d.getDate()
  const month = d.toLocaleDateString('en-GB', { month: 'short' })
  const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  return `${weekday}, ${day} ${month} · ${time}`
}

function formatMatchDateShort(dateStr: string): string {
  const d = new Date(dateStr)
  const day = d.getDate()
  const month = d.toLocaleDateString('en-GB', { month: 'short' })
  const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  return `${day} ${month} · ${time}`
}

function EPLWidget() {
  const [teamId, setTeamId] = useState<number>(
    () => Number(localStorage.getItem(TEAM_KEY)) || DEFAULT_TEAM_ID
  )
  const [match, setMatch] = useState<EPLMatch | null>(null)
  const [countdown, setCountdown] = useState<Countdown>({ days: 0, hours: 0, minutes: 0 })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectingTeam, setSelectingTeam] = useState(false)

  // Fetch next match when teamId changes
  useEffect(() => {
    setError(null)
    setMatch(null)

    const cached = localStorage.getItem(cacheKey(teamId))
    if (cached) {
      const parsed = JSON.parse(cached) as EPLMatch
      const age = Date.now() - new Date(parsed.received).getTime()
      if (age < UPDATE_INTERVAL_MS) {
        setMatch(parsed)
        return
      }
    }

    if (!FOOTBALL_API_KEY) {
      setError('Set VITE_FOOTBALL_API_KEY in .env')
      return
    }

    setLoading(true)

    fetch(`${API_BASE}/teams/${teamId}/matches?status=SCHEDULED&limit=1`, {
      headers: { 'X-Auth-Token': FOOTBALL_API_KEY },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status}`)
        return res.json()
      })
      .then((data: { matches: EPLMatch[] }) => {
        const next = data.matches[0]
        if (!next) throw new Error('no_match')
        next.received = new Date().toISOString()
        localStorage.setItem(cacheKey(teamId), JSON.stringify(next))
        setMatch(next)
        setLoading(false)
      })
      .catch((err: Error) => {
        setLoading(false)
        setError(
          err.message === 'no_match' ? 'No upcoming matches' :
          err.message === '401'      ? 'Invalid API key' :
                                       'Failed to fetch'
        )
      })
  }, [teamId])

  // Live countdown — update every 30s
  useEffect(() => {
    if (!match) return
    const tick = () => setCountdown(getCountdown(new Date(match.utcDate)))
    tick()
    const id = setInterval(tick, 30_000)
    return () => clearInterval(id)
  }, [match])

  function handleTeamChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newId = Number(e.target.value)
    localStorage.setItem(TEAM_KEY, String(newId))
    setTeamId(newId)
    setSelectingTeam(false)
  }

  const selectedTeam = EPL_TEAMS.find((t) => t.id === teamId)

  return (
    <div className="epl-container backdrop-blur-sm">
      {/* Header */}
      <div className="epl-header">
        <div className="epl-venue">
          {match ? formatMatchDateShort(match.utcDate) : ''}
        </div>

        <div className="epl-title">
          <img src="/images/epl-logo.svg" alt="epl_logo" className="w-6 h-6" />
        </div>

        {selectingTeam ? (
          <select
            className="epl-team-select"
            value={teamId}
            onChange={handleTeamChange}
            onBlur={() => setSelectingTeam(false)}
            autoFocus
          >
            {EPL_TEAMS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.shortName}
              </option>
            ))}
          </select>
        ) : (
          <button className="epl-team-btn" onClick={() => setSelectingTeam(true)} title={selectedTeam?.shortName ?? 'Select team'}>
            <i className="ri-settings-3-line" />
          </button>
        )}
      </div>

      {/* Body */}
      {error ? (
        <div className="epl-status">{error}</div>
      ) : loading || !match ? (
        <div className="epl-status">Loading…</div>
      ) : (
        <>
          <div
            className={`epl-flare epl-flare--${match.homeTeam.id === teamId ? 'left' : 'right'}`}
            style={{ backgroundColor: TEAM_COLORS[teamId] ?? '#ffffff' }}
          />
          <div className="epl-match">
            <div className="epl-team">
              <div className="epl-crest-wrap">
                <img className="epl-crest" src={match.homeTeam.crest} alt={match.homeTeam.shortName} />
              </div>
              <span className="epl-team-name">{match.homeTeam.shortName}</span>
            </div>
            <div className="epl-countdown">
              {[
                { value: countdown.days,    label: 'DAYS'    },
                { value: countdown.hours,   label: 'HOURS'   },
                { value: countdown.minutes, label: 'MINS' },
              ].map(({ value, label }) => (
                <div key={label} className="epl-countdown-col">
                  <span className="epl-countdown-label">{label}</span>
                  <span className="epl-countdown-value">{String(value).padStart(2, '0')}</span>
                </div>
              ))}
            </div>
            <div className="epl-team">
              <div className="epl-crest-wrap">
                <img className="epl-crest" src={match.awayTeam.crest} alt={match.awayTeam.shortName} />
              </div>
              <span className="epl-team-name">{match.awayTeam.shortName}</span>
            </div>
          </div>
          <div className="epl-footer">
            <div className="epl-date">{formatMatchDate(match.utcDate)}</div>
            <div className="epl-competition">{match.competition.name}</div>
          </div>
        </>
      )}
    </div>
  )
}

export default EPLWidget
