import { getConfig } from '@/config';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import NoApiKey from '../NoApiKey';
import { API_BASE, DEFAULT_TEAM_ID, EPL_TEAMS, TEAM_COLORS, TEAM_KEY, UPDATE_INTERVAL_MS } from './constants';
import type { Countdown, EPLMatch } from './types';
import { cacheKey, formatMatchDate, getCountdown } from './utils';

function EPLWidget() {
  const [teamId, setTeamId] = useState<number>(
    () => Number(localStorage.getItem(TEAM_KEY)) || DEFAULT_TEAM_ID,
  );
  const [match, setMatch] = useState<EPLMatch | null>(null);
  const [countdown, setCountdown] = useState<Countdown>({ days: 0, hours: 0, minutes: 0 });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectingTeam, setSelectingTeam] = useState(false);

  // Fetch next match when teamId changes
  useEffect(() => {
    setError(null);
    setMatch(null);

    const cached = localStorage.getItem(cacheKey(teamId));
    if (cached) {
      const parsed = JSON.parse(cached) as EPLMatch;
      const age = dayjs().diff(dayjs(parsed.received));
      const matchStillAhead = dayjs(parsed.utcDate).isAfter(dayjs());
      if (age < UPDATE_INTERVAL_MS && matchStillAhead) {
        setMatch(parsed);
        return;
      }
    }

    const { footballApiKey } = getConfig();
    if (!footballApiKey) {
      setError('no_key');
      return;
    }

    setLoading(true);

    fetch(`${API_BASE}/teams/${teamId}/matches?status=SCHEDULED&limit=1`, {
      headers: { 'X-Auth-Token': footballApiKey },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status}`);
        return res.json();
      })
      .then((data: { matches: EPLMatch[] }) => {
        const next = data.matches[0];
        if (!next) throw new Error('no_match');
        next.received = dayjs().toISOString();
        localStorage.setItem(cacheKey(teamId), JSON.stringify(next));
        setMatch(next);
        setLoading(false);
      })
      .catch((err: Error) => {
        setLoading(false);
        setError(
          err.message === 'no_match' ? 'No upcoming matches' :
            err.message === '401' ? 'Invalid API key' :
              'Failed to fetch',
        );
      });
  }, [teamId]);

  // Live countdown — update every 30s
  useEffect(() => {
    if (!match) return;
    const tick = () => setCountdown(getCountdown(match.utcDate));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [match]);

  function handleTeamChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newId = Number(e.target.value);
    localStorage.setItem(TEAM_KEY, String(newId));
    setTeamId(newId);
    setSelectingTeam(false);
  }

  const selectedTeam = EPL_TEAMS.find((t) => t.id === teamId);

  return (
    <div className="epl-container backdrop-blur-sm">
      {/* Header */}
      <div className="epl-header">

        <div className="epl-title flex-col gap-0">
          <img src="/images/epl-logo.svg" alt="epl_logo" className="w-6 h-6" />
          <div className="epl-competition">{match?.competition.name}</div>
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
          <button className="epl-team-btn" onClick={() => setSelectingTeam(true)}
                  title={selectedTeam?.shortName ?? 'Select team'}>
            <i className="ri-settings-3-line" />
          </button>
        )}
      </div>

      {/* Body */}
      {error === 'no_key' ? (
        <NoApiKey variant="football" className="epl-status" />
      ) : error ? (
        <div className="epl-status">{error}</div>
      ) : loading || !match ? (
        <div className="epl-status">Loading…</div>
      ) : (
        <>
          <div
            className={`epl-flare epl-flare--${match.homeTeam.id === teamId ? 'left' : 'right'}`}
            style={{ backgroundColor: TEAM_COLORS[teamId] ?? '#ffffff' }}
          />
          {match.homeTeam.id === teamId ? (
            <p className={`absolute bottom-10 -rotate-90 -left-11 opacity-10 text-[40px]`}>HOME
            </p>
          ) : (
            <p className={`absolute bottom-10 -rotate-90 -right-9 opacity-10 text-[40px]`}>AWAY
            </p>
          )}
          <div className="epl-match">
            <div className="epl-team">
              <div className="epl-crest-wrap">
                <img className="epl-crest" src={match.homeTeam.crest} alt={match.homeTeam.shortName} />
              </div>
              <span className="epl-team-name">{match.homeTeam.shortName}</span>
            </div>
            <div className="epl-countdown">
              {[
                { value: countdown.days, label: 'DAYS' },
                { value: countdown.hours, label: 'HOURS' },
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
          <div className={`epl-footer ${countdown.days === 0 ? 'mb-6 -mt-4' : ''}`}>
            <div className="epl-date">{formatMatchDate(match.utcDate)}</div>
          </div>
          {countdown.days === 0 && (
            <p
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 opacity-20 text-[48px] font-bold tracking-wide pointer-events-none select-none whitespace-nowrap">
              MATCHDAY
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default EPLWidget;
