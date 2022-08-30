import React, { useState, useEffect} from 'react';

function SmartHome() {
    const [temprature, setTemprature] = useState(0);
    const [humidity, setHumidity] = useState(0);
    const [battery, setBattery] = useState(0);
    
    useEffect(() => {
        fetch("http://localhost:8000/")
            .then(res => res.json())
            .then(data => {
                if(data) {
                    // console.log('data', data);
                    const sensor = data.devices.filter( item => item.id === "b8c38d8e-ae30-419c-a86c-a55386362737")
                    // console.log('tempreture', sensor[0].properties[0].state.value);
                    setTemprature(sensor[0].properties[0].state.value);
                    // console.log('humidity', sensor[0].properties[1].state.value);
                    setHumidity(sensor[0].properties[1].state.value);
                    // console.log('battery', sensor[0].properties[2].state.value);
                    setBattery(sensor[0].properties[2].state.value);
                }
            });
    }, []);

    return (
        <div className="smarthome-container">
            SmartHome
            <div className="weather-details">
              <div className="weather-details-item"><i className="ri-temp-hot-fill"></i> <span>{temprature} °C</span></div>
              <div className="weather-details-item"><i className="ri-drop-line"></i> <span>{humidity} %</span></div>
              <div className="weather-details-item"><i className="ri-battery-line"></i> <span>{battery} %</span></div>
            </div>
        </div>
    )
}

export default SmartHome