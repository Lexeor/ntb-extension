import React, {useState, useEffect} from 'react';
import {days, months} from '../utils';

function TimeDate() {
    const [time, setTime] = useState(getFormattedTime(new Date()));

    const day = days[new Date().getDay()];
    const date = new Date().getDate();
    const month = months[new Date().getMonth()];

    useEffect(() => {
        const timer = setInterval(() => {
            const date = new Date();
            const currentTime = getFormattedTime(date);
            setTime(currentTime);
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    function getFormattedTime(dateObj) {
        return `${('0'+dateObj.getHours()).slice(-2)}:${('0'+dateObj.getMinutes()).slice(-2)}`;
    }

    return (
        <div id="time">
            <h1 className="row-clock">{time}</h1>
            <p className="row-date">{day}, {date} {month}</p>
        </div>
        
    )
}

export default TimeDate