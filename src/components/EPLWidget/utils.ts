import type { Countdown } from './types';

export function cacheKey(teamId: number): string {
  return `eplMatch_${teamId}`;
}

export function getCountdown(matchDate: Date): Countdown {
  const diff = Math.max(0, matchDate.getTime() - Date.now());
  const totalMinutes = Math.floor(diff / 60_000);
  return {
    days: Math.floor(totalMinutes / 1440),
    hours: Math.floor((totalMinutes % 1440) / 60),
    minutes: totalMinutes % 60,
  };
}

export function formatMatchDate(dateStr: string): string {
  const d = new Date(dateStr);
  const weekday = d.toLocaleDateString('en-GB', { weekday: 'short' });
  const day = d.getDate();
  const month = d.toLocaleDateString('en-GB', { month: 'short' });
  const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  return `${weekday}, ${day} ${month} · ${time}`;
}

export function formatMatchDateShort(dateStr: string): string {
  const d = new Date(dateStr);
  const day = d.getDate();
  const month = d.toLocaleDateString('en-GB', { month: 'short' });
  const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  return `${day} ${month} · ${time}`;
}
