import { useState, useEffect } from 'react'
import { days, months } from '../utils'

function getFormattedTime(dateObj: Date): string {
  return `${('0' + dateObj.getHours()).slice(-2)}:${('0' + dateObj.getMinutes()).slice(-2)}`
}

function TimeDate() {
  const [time, setTime] = useState(() => getFormattedTime(new Date()))

  const now = new Date()
  const day = days[now.getDay()]
  const date = now.getDate()
  const month = months[now.getMonth()]

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getFormattedTime(new Date()))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div id="time">
      <h1 className="row-clock">{time}</h1>
      <p className="row-date">
        {day}, {date} {month}
      </p>
    </div>
  )
}

export default TimeDate
