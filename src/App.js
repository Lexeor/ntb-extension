import React, {useState, useEffect} from "react";
import Trianglify from 'react-trianglify';
import TimeDate from "./components/TimeDate";
import SearchBar from "./components/SearchBar";
import Favourites from "./components/Favourites";
import WeatherPanel from "./components/WeatherPanel";
import SettingsBar from "./components/SettingsBar";
import SmartHome from "./components/SmartHome";
import Popup from "./components/Popup";
import {defaultSettings, getCurrentTimeOfDay} from './utils.js';

function App() {
    const [settings, setSettings] = useState();
    const [isPopupShowed, setIsPopupShowed] = useState(false);

    // Initial load
    useEffect(() => {
      if(process.env.NODE_ENV === 'production') {
        chrome.storage.sync.get('settings', function(data) {
            if (typeof data === 'undefined') {
                chrome.storage.sync.set({'settings': defaultSettings}, function() {
                    setSettings(defaultSettings);
                });
              } else {
                setSettings(data.settings);
              }
          });
      } else {
        // Working with default settings in DEVELOPMENT enviroment due to
        // Chrome API is unavailable
        setSettings(defaultSettings);
      }
    }, []);

    // Track changes
    useEffect(() => {
      if(process.env.NODE_ENV === 'production') {
        chrome.storage.sync.set({'settings': settings});
      }
    }, [settings]);

    function handleSettingToggle(settingName) {
      setSettings(prevState => {
          let newObj = prevState.modules[settingName];
          newObj.visible = !newObj.visible;

          return {
                  modules: {
                      ...prevState.modules,
                      [settingName]: newObj
                  },
                  colors: prevState.colors
              }
          }
      );
    }

    function switchPopup() {
      setIsPopupShowed(prev => !prev);
    }

    let colorScheme;

    const black = ['#999999'];
    const gray = ['#000000', '#4CAFE8', '#98C3DB'];
    const green = ['#000000', '#22577A', '#38A3A5', '#57CC99', '#80ED99'];
    const fall = ['#1B1A17', '#F0A500', '#E45826', '#E6D5B8'];

    const sunrise = ['#EEEEEE', '#173679', '#4888C8', '#FED500'];
    const sunset = ['#E96C72', '#312678', '#180F44', '#312678', '#E96C72', '#ECC36F'];
    const night = ['#111227', '#111227', '#272652', '#2E457D', '#82A0B9'];

    const day = ['#4888C8', '#173679', '#4888C8', '#7FC5DC'];

    let dayTime = getCurrentTimeOfDay();
    if (dayTime === 'morning') {
      colorScheme = sunrise;
    } else if (dayTime === 'day') {
      colorScheme = day;
    } else if(dayTime === 'evening') {
      colorScheme = sunrise;
    } else {
      colorScheme = night;
    }
      
    return (
        <div className="App">
          <Popup isPopupShowed={isPopupShowed} header="Create new entry" switchPopup={switchPopup} />
          <div className={`content-wrapper${isPopupShowed ? ' blurred' : ''}`}>
            <Trianglify 
              cellSize="100"
              width={window.screen.width}
              height={window.screen.height}
              xColors={new Array(colorScheme[0])}
              yColors={colorScheme.splice(1,colorScheme.length-1)}
            />
            <div className="main-container">
              <div className="column-left">
                {/* Left column */}
                <SmartHome />
              </div>
              <div className="column-center">
                {settings && settings.modules.search.visible && <SearchBar />}
                {settings && settings.modules.favourites.visible && <Favourites switchPopup={switchPopup} />}
                {settings && settings.modules.clock.visible && <TimeDate />}
              </div>
              <div className="column-right">
                {/* Right Column */}
                <SettingsBar settings={settings} handleSettingToggle={handleSettingToggle} />
                {settings && settings.modules.weather.visible && <WeatherPanel />}
              </div>
            </div>
          </div>
        </div>
    );
}

export default App;
