import { useState, useEffect } from 'react'
import { getFormattedDateAndTime } from '../utils'
import type { WeatherData } from '../types'

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY

// Update interval: 1 hour in milliseconds
const UPDATE_INTERVAL_MS = 60 * 60 * 1000

function isTimeToUpdate(dateReceived: Date): boolean {
  return Date.now() - dateReceived.getTime() >= UPDATE_INTERVAL_MS
}

function WeatherPanel() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const cached = localStorage.getItem('weather')
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

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=Baku&units=metric&appid=${WEATHER_API_KEY}`
    )
      .then((res) => res.json())
      .then((data: WeatherData) => {
        data.received = new Date().toISOString()
        localStorage.setItem('weather', JSON.stringify(data))
        setWeather(data)
      })
      .catch(() => setError('Failed to fetch weather'))
  }, [])

  if (error) {
    return (
      <div className="weather-container">
        <div className="text-white/50 text-sm">{error}</div>
      </div>
    )
  }

  if (!weather) {
    return (
      <div className="weather-container">
        <div className="text-white/50 text-sm">Loading weather…</div>
      </div>
    )
  }

  const now = new Date()
  const sunset = new Date(0)
  sunset.setUTCSeconds(weather.sys.sunset)
  const sunHoursLeft = Math.max(0, Math.floor(sunset.getHours() - now.getHours()))

  return (
    <div className="weather-container">
      <div className="weather-header">
        {weather.name}, {weather.sys.country}
      </div>
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
      <div className="weather-updated">
        last updated {getFormattedDateAndTime(new Date(weather.received))}
      </div>
    </div>
  )
}

export default WeatherPanel
