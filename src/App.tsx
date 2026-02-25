import { useState, useEffect, useRef } from 'react'
import Trianglify from 'trianglify'
import TimeDate from './components/TimeDate'
import SearchBar from './components/SearchBar'
import Favourites from './components/Favourites'
import WeatherPanel from './components/WeatherPanel'
import SettingsBar from './components/SettingsBar'
import SmartHome from './components/SmartHome'
import Popup from './components/Popup'
import { defaultSettings, getCurrentTimeOfDay } from './utils'
import type { Settings } from './types'

const colorSchemes = {
  morning: ['#EEEEEE', '#173679', '#4888C8', '#FED500'],
  day: ['#4888C8', '#173679', '#4888C8', '#7FC5DC'],
  evening: ['#EEEEEE', '#173679', '#4888C8', '#FED500'],
  night: ['#111227', '#111227', '#272652', '#2E457D', '#82A0B9'],
}

function App() {
  const [settings, setSettings] = useState<Settings | undefined>()
  const [isPopupShowed, setIsPopupShowed] = useState(false)
  const bgRef = useRef<HTMLDivElement>(null)

  // Load settings
  useEffect(() => {
    if (import.meta.env.PROD && typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.get('settings', (data) => {
        setSettings((data?.settings as Settings) ?? defaultSettings)
      })
    } else {
      setSettings(defaultSettings)
    }
  }, [])

  // Persist settings changes
  useEffect(() => {
    if (!settings) return
    if (import.meta.env.PROD && typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.set({ settings })
    }
  }, [settings])

  // Render trianglify background
  useEffect(() => {
    if (!bgRef.current) return
    const scheme = colorSchemes[getCurrentTimeOfDay()]
    const pattern = Trianglify({
      width: window.screen.width,
      height: window.screen.height,
      cellSize: 100,
      xColors: [scheme[0]],
      yColors: scheme.slice(1),
    })
    bgRef.current.innerHTML = ''
    bgRef.current.appendChild(pattern.toSVG())
  }, [])

  function handleSettingToggle(name: keyof Settings['modules']) {
    setSettings((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        modules: {
          ...prev.modules,
          [name]: { visible: !prev.modules[name].visible },
        },
      }
    })
  }

  function switchPopup() {
    setIsPopupShowed((prev) => !prev)
  }

  return (
    <div className="App">
      <Popup isPopupShowed={isPopupShowed} switchPopup={switchPopup} />
      <div ref={bgRef} />
      <div className={`content-wrapper${isPopupShowed ? ' blurred' : ''}`}>
        <div className="main-container">
          <div className="column-left" />
          <div className="column-center">
            {settings?.modules.search.visible && <SearchBar />}
            {settings?.modules.favourites.visible && <Favourites switchPopup={switchPopup} />}
            {settings?.modules.clock.visible && <TimeDate />}
          </div>
          <div className="column-right">
            <SettingsBar settings={settings} handleSettingToggle={handleSettingToggle} />
            {settings?.modules.weather.visible && <WeatherPanel />}
            <SmartHome />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
