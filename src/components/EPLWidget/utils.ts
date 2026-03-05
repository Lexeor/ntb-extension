import dayjs from 'dayjs';
import type { Countdown } from './types';

export function cacheKey(teamId: number): string {
  return `eplMatch_${teamId}`;
}

export function getCountdown(matchDateStr: string): Countdown {
  const diff = Math.max(0, dayjs(matchDateStr).diff(dayjs()));
  const totalMinutes = Math.floor(diff / 60_000);
  return {
    days: Math.floor(totalMinutes / 1440),
    hours: Math.floor((totalMinutes % 1440) / 60),
    minutes: totalMinutes % 60,
  };
}

export function formatMatchDate(dateStr: string): string {
  return dayjs(dateStr).format('ddd, D MMM · HH:mm');
}

export function formatMatchDateShort(dateStr: string): string {
  return dayjs(dateStr).format('D MMM · HH:mm');
}
