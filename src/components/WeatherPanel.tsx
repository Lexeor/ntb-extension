import React, { useEffect, useRef, useState } from 'react';

import { getConfig } from '../config';
import type { WeatherData } from '../types';
import { getFormattedDateAndTime } from '../utils';
import NoApiKey from './NoApiKey';

const WEATHER_BASE = import.meta.env.DEV
  ? '/proxy/weather'
  : 'https://api.openweathermap.org';
const UPDATE_INTERVAL_MS = 60 * 60 * 1000;
const CITY_KEY = 'weatherCity';
const DEFAULT_CITY = 'Herceg Novi, ME';

function cacheKey(city: string) {
  return `weather_${city.toLowerCase()}`;
}

function isTimeToUpdate(dateReceived: Date): boolean {
  return Date.now() - dateReceived.getTime() >= UPDATE_INTERVAL_MS;
}

function WeatherPanel() {
  const [city, setCity] = useState<string>(
    () => localStorage.getItem(CITY_KEY) ?? DEFAULT_CITY,
  );
  const [editingCity, setEditingCity] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const cityInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingCity) {
      cityInputRef.current?.focus();
      cityInputRef.current?.select();
    }
  }, [editingCity]);

  useEffect(() => {
    setError(null);
    setLoading(false);

    const cached = localStorage.getItem(cacheKey(city));
    if (cached) {
      const parsed = JSON.parse(cached) as WeatherData;
      if (!isTimeToUpdate(new Date(parsed.received))) {
        setWeather(parsed);
        return;
      }
    }

    const { weatherApiKey } = getConfig();
    if (!weatherApiKey) {
      setError('no_key');
      return;
    }

    setLoading(true);
    setWeather(null);

    fetch(
      `${WEATHER_BASE}/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${weatherApiKey}`,
    )
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status}`);
        return res.json();
      })
      .then((data: WeatherData) => {
        data.received = new Date().toISOString();
        localStorage.setItem(cacheKey(city), JSON.stringify(data));
        setWeather(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setLoading(false);
        setError(err.message === '404' ? `City "${city}" not found` : 'Failed to fetch weather');
      });
  }, [city]);

  function handleCitySubmit() {
    const input = cityInputRef.current;
    if (!input) return;
    const trimmed = input.value.trim();
    if (trimmed && trimmed !== city) {
      localStorage.setItem(CITY_KEY, trimmed);
      setCity(trimmed);
    }
    setEditingCity(false);
  }

  function handleCityKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleCitySubmit();
    if (e.key === 'Escape') setEditingCity(false);
  }

  const now = new Date();
  const sunset = weather ? new Date(0) : null;
  if (sunset && weather) sunset.setUTCSeconds(weather.sys.sunset);
  const sunHoursLeft = sunset ? Math.max(0, Math.floor(sunset.getHours() - now.getHours())) : 0;

  return (
    <div
      className="relative font-['Exo_2',sans-serif] bg-[var(--clr-gadget-bg)] rounded-[20px] w-full max-w-[400px] px-4 pt-3 pb-4 text-[whitesmoke] flex flex-col mt-3 backdrop-blur-sm">

      {/* Header: city */}
      <div className="flex items-center h-8">
        {editingCity ? (
          <div className="flex items-center gap-1.5 text-sm">
            <i className="ri-map-pin-line opacity-60" />
            <input
              ref={cityInputRef}
              className="bg-transparent border-0 border-b border-white/50 text-[whitesmoke] font-['Exo_2',sans-serif] px-0.5 pb-px w-[130px] outline-none text-sm"
              defaultValue={city}
              onKeyDown={handleCityKeyDown}
              onBlur={handleCitySubmit}
            />
          </div>
        ) : (
          <button
            className="[all:unset] flex items-center gap-1.5 cursor-pointer rounded-md px-1.5 py-0.5 -mx-1.5 transition-colors duration-200 hover:bg-white/10 hover:rounded-lg group text-sm opacity-70"
            onClick={() => setEditingCity(true)}
          >
            <i className="ri-map-pin-line mr-2" />
            <span>{weather ? `${weather.name}, ${weather.sys.country}` : city}</span>
            <i
              className="ri-pencil-line text-[0.75rem] text-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </button>
        )}
      </div>

      {/* States: loading / error / content */}
      {error === 'no_key' ? (
        <div className="flex-1 flex items-center justify-center py-6">
          <NoApiKey variant="weather" />
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center py-6 text-white/45 text-sm">{error}</div>
      ) : loading || !weather ? (
        <div className="flex-1 flex items-center justify-center py-6 text-white/45 text-sm">Loading…</div>
      ) : (
        <>
          {/* Hero: icon + type */}
          <div className="flex flex-col items-center justify-center py-4 gap-1">
            <img
              className="w-36 h-36 object-contain drop-shadow-[0_6px_18px_rgba(0,0,0,0.35)]"
              src={`/images/weather/${weather.weather[0].icon}.png`}
              alt={weather.weather[0].description}
            />
            <span className="text-sm tracking-wide opacity-55 uppercase">{weather.weather[0].main}</span>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10 mb-3" />

          {/* Bottom: stats left, temperature right */}
          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2 text-sm">
                <i className="ri-windy-line w-4 text-base opacity-55" />
                <span>{weather.wind.speed} km/h</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <i className="ri-drop-line w-4 text-base opacity-55" />
                <span>{weather.main.humidity}%</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <i className="ri-sun-line w-4 text-base opacity-55" />
                <span>{sunHoursLeft}h until sunset</span>
              </div>
              {weather.rain && (
                <div className="flex items-center gap-2 text-sm">
                  <i className="ri-rainy-line w-4 text-base opacity-55" />
                  <span>{Math.round(weather.rain['1h'] * 100)}%</span>
                </div>
              )}
            </div>

            <div
              className="font-['Exo',sans-serif] text-[5.5rem] font-bold leading-none bg-gradient-to-b from-[#eee] to-[#c2c2c2] bg-clip-text text-transparent drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
              {Math.floor(weather.main.temp)}°
            </div>
          </div>

          {/* Last updated */}
          <div
            className="text-right mt-1.5 text-[10px] text-white/20 cursor-default hover:text-white/60 transition-colors duration-200">
            {getFormattedDateAndTime(new Date(weather.received))}
          </div>
        </>
      )}
    </div>
  );
}

export default WeatherPanel;
