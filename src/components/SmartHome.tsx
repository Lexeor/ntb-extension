import { useState, useEffect } from 'react'

interface SensorData {
  temperature: number
  humidity: number
  battery: number
}

const DEVICE_ID = 'b8c38d8e-ae30-419c-a86c-a55386362737'

function SmartHome() {
  const [data, setData] = useState<SensorData | null>(null)

  useEffect(() => {
    fetch('http://localhost:8000/')
      .then((res) => res.json())
      .then((json) => {
        const sensor = json.devices?.find((d: { id: string }) => d.id === DEVICE_ID)
        if (sensor) {
          setData({
            temperature: sensor.properties[0].state.value,
            humidity: sensor.properties[1].state.value,
            battery: sensor.properties[2].state.value,
          })
        }
      })
      .catch(() => {
        // Local server not available — silently skip
      })
  }, [])

  if (!data) return null

  return (
    <div className="smarthome-container">
      <span className="text-sm font-medium mb-2 opacity-60">SmartHome</span>
      <span>
        <i className="ri-temp-hot-line" /> {data.temperature} °C
      </span>
      <span>
        <i className="ri-drop-line" /> {data.humidity} %
      </span>
      <span>
        <i className="ri-battery-line" /> {data.battery} %
      </span>
    </div>
  )
}

export default SmartHome
