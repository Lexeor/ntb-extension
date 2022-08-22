/*global chrome*/
import React, {useState, useEffect} from 'react';

function SettingsBar(props) {
    const [active, setActive] = useState(false);

    function handleSettingsClick() {
        setActive(prev => !prev);
    }

    function isSettingVisible(settingName) {
        if(props.settings) {
            return props.settings.modules[settingName].visible ? ' on' : ' off';
        }
        return ' on';
    }

    const activeClass = active ? ' active' : '';

    return (
        <div className="settings-container">
            <div className={`settings-bar${activeClass}`}>
                <button className={`btn-settings${activeClass}`} onClick={handleSettingsClick}><i className="ri-settings-4-line"></i></button>
                <button className={`settings-item${activeClass}${isSettingVisible('weather')}`}>
                    <i className="ri-rainy-line" onClick={() => props.handleSettingToggle('weather')}></i>
                </button>
                <button className={`settings-item${activeClass}${isSettingVisible('favourites')}`}>
                    <i className="ri-star-line" onClick={() => props.handleSettingToggle('favourites')}></i>
                </button>
                <button className={`settings-item${activeClass}${isSettingVisible('clock')}`}>
                    <i className="ri-time-line" onClick={() => props.handleSettingToggle('clock')}></i>
                </button>
                <button className={`settings-item${activeClass}${isSettingVisible('search')}`}>
                    <i className="ri-search-line" onClick={() => props.handleSettingToggle('search')}></i>
                </button>
            </div>
        </div>
    )
}

export default SettingsBar