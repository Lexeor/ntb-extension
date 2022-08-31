import React, {useState, useEffect} from 'react';
import {apiKeys} from '../secured';
import {getFormattedDateAndTime} from '../utils';

function WeatherPanel() {
  const [weatherCache, setWeatherCache] = useState();

  useEffect(() => {
    if(!localStorage.getItem('weather') || isTimeToUpdate(new Date(JSON.parse(localStorage.getItem('weather')).received))) {
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=Moscow&units=metric&appid=${apiKeys.weather}`)
        .then(res => res.json())
        .then(data => {
          data['received'] = new Date().toISOString();
          localStorage.setItem('weather', JSON.stringify(data));
          setWeatherCache(data);
        })
        .catch(err => console.log(err));
    } else {
      // Store in state
      setWeatherCache(JSON.parse(localStorage.getItem('weather')));
    }
  }, []);

  // Function to determine is it time to update Weather from API
  // Updates should be done hourly
  function isTimeToUpdate(dateReceived) {
    const dateNow = new Date();
    const dateRes = new Date(dateReceived);

    const timePassed = dateNow - dateRes;

    if(timePassed >= 360 * 1000) {
      return true;
    }
    return false;
  }

  function getWeatherHtml() {
    if(weatherCache) {

      let now = new Date();
      let sunrise = new Date(0);
      sunrise.setUTCSeconds(`${weatherCache.sys.sunrise}`);

      let sunset = new Date(0);
      sunset.setUTCSeconds(`${weatherCache.sys.sunset}`);

      // Hours of solar light left today :)
      let sunHours = sunset.getHours() > now.getHours() ? sunset.getHours() - now.getHours() : 0;

      return (
        <>
          <div className="weather-header">
              {weatherCache.name}, {weatherCache.sys.country}
          </div>
          <div className="weather-body">
            <img className="weather-image" src={`/images/weather/${weatherCache.weather[0].icon}.png`} />
            <div className="weather-type">{weatherCache.weather[0].main}</div>
            <div className="weather-details">
              <div className="weather-details-item"><i className="ri-windy-line"></i> <span>{`${weatherCache.wind.speed}`} km/h</span></div>
              <div className="weather-details-item"><i className="ri-drop-line"></i> <span>{`${weatherCache.main.humidity}`}%</span></div>
              <div className="weather-details-item"><i className="ri-sun-line"></i> <span>{`${Math.floor(sunHours)}`}h</span></div>
              {weatherCache.rain && <div className="weather-details-item"><i className="ri-rainy-line"></i> {parseInt(weatherCache.rain['1h'] * 100)}%</div>}
            </div>
            <div className="weather-big">{Math.floor(weatherCache.main.temp)}°</div>
              {/* <img className="weather-image" src={`http://openweathermap.org/img/wn/${weatherCache.weather[0].icon}@4x.png`} /> */}
              
          </div>
          <div className="weather-updated">last updated {getFormattedDateAndTime(new Date(weatherCache.received))}</div>
        </>
      )
    }
    return (<div>No data yet.</div>)
  }

  return (
    <div className="weather-container">
        {getWeatherHtml()}
    </div>
  )
}

export default WeatherPanel