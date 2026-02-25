import React, { useState, useEffect, useRef } from 'react'
import { getFormattedDateAndTime } from '../utils'
import type { WeatherData } from '../types'

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY
const UPDATE_INTERVAL_MS = 60 * 60 * 1000
const CITY_KEY = 'weatherCity'
const DEFAULT_CITY = 'Baku'

function cacheKey(city: string) {
  return `weather_${city.toLowerCase()}`
}

function isTimeToUpdate(dateReceived: Date): boolean {
  return Date.now() - dateReceived.getTime() >= UPDATE_INTERVAL_MS
}

function WeatherPanel() {
  const [city, setCity] = useState<string>(
    () => localStorage.getItem(CITY_KEY) ?? DEFAULT_CITY
  )
  const [editingCity, setEditingCity] = useState(false)
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const cityInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editingCity) {
      cityInputRef.current?.focus()
      cityInputRef.current?.select()
    }
  }, [editingCity])

  useEffect(() => {
    setError(null)
    setLoading(false)

    const cached = localStorage.getItem(cacheKey(city))
    if (cached) {
      const parsed = JSON.parse(cached) as WeatherData
      if (!isTimeToUpdate(new Date(parsed.received))) {
        setWeather(parsed)
        return
      }
    }

    if (!WEATHER_API_KEY) {
      setError('No API key — set VITE_WEATHER_API_KEY in .env')
      return
    }

    setLoading(true)
    setWeather(null)

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${WEATHER_API_KEY}`
    )
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status}`)
        return res.json()
      })
      .then((data: WeatherData) => {
        data.received = new Date().toISOString()
        localStorage.setItem(cacheKey(city), JSON.stringify(data))
        setWeather(data)
        setLoading(false)
      })
      .catch((err: Error) => {
        setLoading(false)
        setError(err.message === '404' ? `City "${city}" not found` : 'Failed to fetch weather')
      })
  }, [city])

  function handleCitySubmit() {
    const input = cityInputRef.current
    if (!input) return
    const trimmed = input.value.trim()
    if (trimmed && trimmed !== city) {
      localStorage.setItem(CITY_KEY, trimmed)
      setCity(trimmed)
    }
    setEditingCity(false)
  }

  function handleCityKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleCitySubmit()
    if (e.key === 'Escape') setEditingCity(false)
  }

  const now = new Date()
  const sunset = weather ? new Date(0) : null
  if (sunset && weather) sunset.setUTCSeconds(weather.sys.sunset)
  const sunHoursLeft = sunset ? Math.max(0, Math.floor(sunset.getHours() - now.getHours())) : 0

  return (
    <div className="weather-container">
      {/* Header with editable city */}
      <div className="weather-header">
        {editingCity ? (
          <div className="weather-city-edit">
            <i className="ri-map-pin-line" />
            <input
              ref={cityInputRef}
              className="weather-city-input"
              defaultValue={city}
              onKeyDown={handleCityKeyDown}
              onBlur={handleCitySubmit}
            />
          </div>
        ) : (
          <button className="weather-city-btn" onClick={() => setEditingCity(true)}>
            <i className="ri-map-pin-line" />
            <span>{weather ? `${weather.name}, ${weather.sys.country}` : city}</span>
            <i className="ri-pencil-line weather-city-edit-icon" />
          </button>
        )}
      </div>

      {/* Body */}
      {error ? (
        <div className="weather-status">{error}</div>
      ) : loading || !weather ? (
        <div className="weather-status">Loading…</div>
      ) : (
        <div className="weather-body">
          <img
            className="weather-image"
            src={`/images/weather/${weather.weather[0].icon}.png`}
            alt={weather.weather[0].description}
          />
          <div className="weather-type">{weather.weather[0].main}</div>
          <div className="weather-details">
            <div className="weather-details-item">
              <i className="ri-windy-line" />
              <span>{weather.wind.speed} km/h</span>
            </div>
            <div className="weather-details-item">
              <i className="ri-drop-line" />
              <span>{weather.main.humidity}%</span>
            </div>
            <div className="weather-details-item">
              <i className="ri-sun-line" />
              <span>{sunHoursLeft}h</span>
            </div>
            {weather.rain && (
              <div className="weather-details-item">
                <i className="ri-rainy-line" />
                <span>{Math.round(weather.rain['1h'] * 100)}%</span>
              </div>
            )}
          </div>
          <div className="weather-big">{Math.floor(weather.main.temp)}°</div>
        </div>
      )}

      {weather && (
        <div className="weather-updated">
          last updated {getFormattedDateAndTime(new Date(weather.received))}
        </div>
      )}
    </div>
  )
}

export default WeatherPanel
