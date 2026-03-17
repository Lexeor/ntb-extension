import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import WAVES from 'vanta/dist/vanta.waves.min';

type TimeOfDay = 'night' | 'sunrise' | 'day' | 'sunset';

interface VantaTheme {
  color: number;
  backgroundColor: number;
  shininess: number;
  waveHeight: number;
  waveSpeed: number;
  zoom: number;
}

const themes: Record<TimeOfDay, VantaTheme> = {
  night: {
    color: 0x0a1f5c,
    backgroundColor: 0x030a18,
    shininess: 15,
    waveHeight: 1,
    waveSpeed: 0.45,
    zoom: 0.75,
  },
  sunrise: {
    color: 0xc43010,
    backgroundColor: 0x1a0527,
    shininess: 25,
    waveHeight: 1,
    waveSpeed: 0.65,
    zoom: 0.75,
  },
  day: {
    color: 0x005f8a,
    backgroundColor: 0x003853,
    shininess: 20,
    waveHeight: 1,
    waveSpeed: 0.5,
    zoom: 0.65,
  },
  sunset: {
    color: 0xb83010,
    backgroundColor: 0x1a0605,
    shininess: 35,
    waveHeight: 1,
    waveSpeed: 0.7,
    zoom: 0.75,
  },
};

function getTimeOfDay(): TimeOfDay {
  const h = new Date().getHours();
  if (h >= 5 && h < 8) return 'sunrise';
  if (h >= 8 && h < 17) return 'day';
  if (h >= 17 && h < 20) return 'sunset';
  return 'night';
}

export function useVantaWaves() {
  const ref = useRef<HTMLDivElement>(null);
  const effectRef = useRef<ReturnType<typeof WAVES> | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(getTimeOfDay);

  // Update time of day every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOfDay(getTimeOfDay());
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  // Init / reinit Vanta when timeOfDay changes
  useEffect(() => {
    if (!ref.current) return;

    if (effectRef.current) {
      effectRef.current.destroy();
      effectRef.current = null;
    }

    const theme = themes[timeOfDay];

    effectRef.current = WAVES({
      el: ref.current,
      THREE,
      mouseControls: false,
      touchControls: false,
      gyroControls: false,
      minHeight: 200,
      minWidth: 200,
      scale: 1.0,
      scaleMobile: 1.0,
      color: theme.color,
      backgroundColor: theme.backgroundColor,
      backgroundAlpha: 1,
      shininess: theme.shininess,
      waveHeight: theme.waveHeight,
      waveSpeed: theme.waveSpeed,
      zoom: theme.zoom,
    });

    return () => {
      effectRef.current?.destroy();
      effectRef.current = null;
    };
  }, [timeOfDay]);

  return ref;
}
