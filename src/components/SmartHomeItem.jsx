import React, { useState } from 'react';
import { smarthomeDevicesDict, measurementsDict } from '../utils';

function SmartHomeItem({item}) {
    const type = smarthomeDevicesDict[item.type];
    const onOffCapability = item.capabilities.find(cap => cap.type === "devices.capabilities.on_off");
    const [isOn, setIsOn] = useState(() => {
        return (onOffCapability && onOffCapability.state) ? onOffCapability.state.value : false
    });

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

    // Handlers
    function handleClick() {
        console.log('clicked item: ', item.id);
        const deviceObject = {
            "id": item.id
        }

        fetch('http://localhost:8000/on', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(deviceObject)
        })
        .then(res => res.json())
        .then(data => {
            if(data.status === 'ok') {
                setIsOn(prev => !prev);
            }
        })
        .catch(err => console.log(err));
    }

    return (
        <div key={item.id} className="smarthome-item">
            {/* Smarthome item body */}
            <div className="sh-item-body">
                <i className={`sh-item-icon ${type ? type : 'ri-question-mark'} ${isOn ? 'on' : ''}`} onClick={handleClick}></i>
                <span>{item.name}</span>
            </div>

            {/* Smarthome item properties */}
            {item.properties.length > 0 
            && 
            <div className="sh-item-properties">
                {getDeviceProperties(item)}
            </div>
            }
        </div>
    )
}

export default SmartHomeItem