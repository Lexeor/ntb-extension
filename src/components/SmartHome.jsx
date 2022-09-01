import React, { useState, useEffect } from 'react';
import { smarthomeDevicesDict, measurementsDict } from '../utils';
import SmartHomeItem from './SmartHomeItem';

function SmartHome() {
    const [temprature, setTemprature] = useState(0);
    const [humidity, setHumidity] = useState(0);
    const [battery, setBattery] = useState(0);
    
    const [devices, setDevices] = useState([]);
    
    useEffect(() => {
        fetch("http://localhost:8000/")
            .then(res => res.json())
            .then(data => {
                if(data) {
                    const sensor = data.devices.filter( item => item.id === "b8c38d8e-ae30-419c-a86c-a55386362737")
                    setTemprature(sensor[0].properties[0].state.value);
                    setHumidity(sensor[0].properties[1].state.value);
                    setBattery(sensor[0].properties[2].state.value);
                }
            })
            .catch(err => console.log(err));
        
            fetch('http://localhost:8000/api/devices')
                .then(res => res.json())
                .then(data => {
                    if(data) {
                        setDevices(data);
                    }
                })
            .catch(err => console.log(err));
    }, []);

    const devicesCollection = devices?.map(item => {
        return <SmartHomeItem key={item.id} item={item} />;
    });

    return (
        <div className="smarthome-container">
            Smart Home
            {/* <div className="weather-details">
              <div className="weather-details-item"><i className="ri-temp-hot-fill"></i> <span>{temprature} °C</span> (21-27)</div>
              <div className="weather-details-item"><i className="ri-drop-line"></i> <span>{humidity} %</span> (40-70)</div>
              <div className="weather-details-item"><i className="ri-battery-line"></i> <span>{battery} %</span></div>
            </div> */}
            {devicesCollection}
        </div>
    )
}

export default SmartHome