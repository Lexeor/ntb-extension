import { useState } from 'react'
import type { Settings } from '../types'

interface SettingsBarProps {
  settings: Settings | undefined
  handleSettingToggle: (name: keyof Settings['modules']) => void
}

function SettingsBar({ settings, handleSettingToggle }: SettingsBarProps) {
  const [active, setActive] = useState(false)

  function isVisible(name: keyof Settings['modules']): string {
    if (!settings) return ' on'
    return (settings.modules[name]?.visible ?? true) ? ' on' : ' off'
  }

  const activeClass = active ? ' active' : ''

  return (
    <div className="settings-container">
      <div className={`settings-bar${activeClass}`}>
        <button className={`btn-settings${activeClass}`} onClick={() => setActive((p) => !p)}>
          <i className="ri-settings-4-line" />
        </button>
        <button className={`settings-item${activeClass}${isVisible('epl')}`}>
          <i className="ri-football-line" onClick={() => handleSettingToggle('epl')} />
        </button>
        <button className={`settings-item${activeClass}${isVisible('weather')}`}>
          <i className="ri-rainy-line" onClick={() => handleSettingToggle('weather')} />
        </button>
        <button className={`settings-item${activeClass}${isVisible('favourites')}`}>
          <i className="ri-star-line" onClick={() => handleSettingToggle('favourites')} />
        </button>
        <button className={`settings-item${activeClass}${isVisible('clock')}`}>
          <i className="ri-time-line" onClick={() => handleSettingToggle('clock')} />
        </button>
        <button className={`settings-item${activeClass}${isVisible('search')}`}>
          <i className="ri-search-line" onClick={() => handleSettingToggle('search')} />
        </button>
      </div>
    </div>
  )
}

export default SettingsBar
