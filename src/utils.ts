import type { Settings } from './types';

export const defaultSettings: Settings = {
  modules: {
    search: { visible: true },
    clock: { visible: true },
    favourites: { visible: true },
    weather: { visible: true },
    epl: { visible: true },
  },
  colors: [],
};

export function getFormattedDateAndTime(dateObj: Date): string {
  const day = ('0' + dateObj.getDate()).slice(-2);
  const month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
  const year = dateObj.getFullYear();
  const hour = ('0' + dateObj.getHours()).slice(-2);
  const minute = ('0' + dateObj.getMinutes()).slice(-2);
  return `${day}.${month}.${year} ${hour}:${minute}`;
}

export function getCompactLabel(label: string): string {
  return label.length > 16 ? label.substring(0, 14) + '...' : label;
}

export function getCurrentTimeOfDay(): 'morning' | 'day' | 'evening' | 'night' {
  const hour = new Date().getHours();
  if (hour > 4 && hour < 10) return 'morning';
  if (hour >= 10 && hour < 16) return 'day';
  if (hour >= 16 && hour < 18) return 'evening';
  return 'night';
}
