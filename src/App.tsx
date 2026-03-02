import { useEffect, useState } from 'react';
import EPLWidget from './components/EPLWidget';
import Favourites from './components/Favourites';
import Popup from './components/Popup';
import SearchBar from './components/SearchBar';
import SettingsBar from './components/SettingsBar';
import TimeDate from './components/TimeDate';
import WeatherPanel from './components/WeatherPanel';
import type { Settings } from './types';
import { defaultSettings } from './utils';

function App() {
  const [settings, setSettings] = useState<Settings | undefined>();
  const [isPopupShowed, setIsPopupShowed] = useState(false);

  // Load settings
  useEffect(() => {
    if (import.meta.env.PROD && typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.get('settings', (data) => {
        setSettings((data?.settings as Settings) ?? defaultSettings);
      });
    } else {
      const saved = localStorage.getItem('settings');
      setSettings(saved ? (JSON.parse(saved) as Settings) : defaultSettings);
    }
  }, []);

  // Persist settings changes
  useEffect(() => {
    if (!settings) return;
    if (import.meta.env.PROD && typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.set({ settings });
    } else {
      localStorage.setItem('settings', JSON.stringify(settings));
    }
  }, [settings]);

  function handleSettingToggle(name: keyof Settings['modules']) {
    setSettings((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        modules: {
          ...prev.modules,
          [name]: { visible: !prev.modules[name].visible },
        },
      };
    });
  }

  function switchPopup() {
    setIsPopupShowed((prev) => !prev);
  }

  return (
    <div className="App">
      <Popup isPopupShowed={isPopupShowed} switchPopup={switchPopup} />
      <div className={`w-full h-screen${isPopupShowed ? ' blurred' : ''}`}>
        <div className="flex h-full">

          {/* Left Bar */}
          <aside
            className="hidden min-[930px]:flex w-[420px] shrink-0 flex-col items-center justify-start mt-[64px] p-4">
            {(settings?.modules.epl?.visible ?? true) && <EPLWidget />}
          </aside>

          {/* Center */}
          <main className="flex-1 min-w-0 flex flex-col items-center justify-start text-[#666666]">
            {settings?.modules.search.visible && <SearchBar />}
            {settings?.modules.favourites.visible && <Favourites switchPopup={switchPopup} />}
            {settings?.modules.clock.visible && <TimeDate />}
          </main>

          {/* Right bar */}
          <aside className="hidden min-[930px]:flex w-[420px] shrink-0 flex-col items-end p-4">
            <SettingsBar settings={settings} handleSettingToggle={handleSettingToggle} />
            {settings?.modules.weather.visible && <WeatherPanel />}
            {/*<SmartHome />*/}
          </aside>

        </div>
      </div>
    </div>
  );
}

export default App;
