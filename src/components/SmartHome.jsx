import React, { useState, useEffect } from 'react';
import { smarthomeDevicesDict, measurementsDict } from '../utils';

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

    function getDeviceProperties(device) {
        const propertiesCollection = device.properties?.map(item => {
            const type = smarthomeDevicesDict[item.state.instance];

            return (
            <div key={item.state.value} className="sh-property">
                {/* Item property icon */}
                <i className={`sh-property-icon ${type ? type : 'ri-question-mark'}`}></i>
                {/* Item property value */}
                {parseFloat(item.state.value) ? item.state.value.toFixed(2) : item.state.value}
                {/* Item property measurement value */}
                {measurementsDict[item.state.instance]}
            </div>
            )
        });

        return propertiesCollection;
    }

    const devicesCollection = devices?.map(item => {
        const type = smarthomeDevicesDict[item.type];
        const onOffCapability = item.capabilities.find(cap => cap.type === "devices.capabilities.on_off");
        let isOn = false;

        if(onOffCapability && onOffCapability.state) {
            isOn = onOffCapability.state.value;
        }

        return (
            <div key={item.id} className="smarthome-item">
                {/* Smarthome item body */}
                <div className="sh-item-body">
                    <i className={`sh-item-icon ${type ? type : 'ri-question-mark'} ${isOn ? 'on' : ''}`}></i>
                    <span>{item.name}</span>
                </div>

                {/* Smarthome item properties */}
                {item.properties.length > 0 
                && 
                <div className="sh-item-properties">
                    {getDeviceProperties(item)}
                </div>
                }
            </div>)
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