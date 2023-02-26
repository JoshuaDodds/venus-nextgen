import { useState, useEffect } from "react"
import WeatherWidget from "../WeatherWidget"

function Clock() {
  const [date, setDate] = useState(new Date())

  function refreshClock() {
    setDate(new Date())
  }
  useEffect(() => {
    const timerId = setInterval(refreshClock, 1000)
    return function cleanup() {
      clearInterval(timerId)
    }
  }, [])
  return (
    <div>
      <span className="text--clock">{date.toLocaleTimeString()}</span>
      <span style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <WeatherWidget />
      </span>
    </div>
  )
}
export default Clock
