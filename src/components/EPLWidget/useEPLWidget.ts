import { getConfig } from '@/config';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { API_BASE, DEFAULT_TEAM_ID, EPL_TEAMS, TEAM_KEY, UPDATE_INTERVAL_MS } from './constants';
import type { Countdown, EPLMatch } from './types';
import { cacheKey, getCountdown } from './utils';

export interface UseEPLWidgetReturn {
  teamId: number;
  match: EPLMatch | null;
  countdown: Countdown;
  error: string | null;
  loading: boolean;
  isMatchday: boolean;
  selectingTeam: boolean;
  selectedTeam: { id: number; shortName: string } | undefined;
  setSelectingTeam: (v: boolean) => void;
  handleTeamChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function useEPLWidget(): UseEPLWidgetReturn {
  const [teamId, setTeamId] = useState<number>(
    () => Number(localStorage.getItem(TEAM_KEY)) || DEFAULT_TEAM_ID,
  );
  const [match, setMatch] = useState<EPLMatch | null>(null);
  const [countdown, setCountdown] = useState<Countdown>({ days: 0, hours: 0, minutes: 0 });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectingTeam, setSelectingTeam] = useState(false);

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

  return {
    teamId,
    match,
    countdown,
    error,
    loading,
    isMatchday: match !== null && countdown.days === 0,
    selectingTeam,
    selectedTeam: EPL_TEAMS.find((t) => t.id === teamId),
    setSelectingTeam,
    handleTeamChange,
  };
}
