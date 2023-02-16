import { useEffect, useState } from "react"

const APIKEY = process.env.REACT_APP_OWM_APIKEY
const LAT = process.env.REACT_APP_LAT
const LON = process.env.REACT_APP_LON

function Weather() {
  const [weather, setWeather] = useState<string | null>(null)

  useEffect(() => {
    async function fetchWeather() {
      const QUERY = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${APIKEY}&units=metric`

      try {
        const response = await fetch(QUERY)
        if (!response.ok) {
          console.log("Failed to fetch weather data")
        }
        const data = await response.json()

        const weatherText = data.weather[0].description
        const weatherIconCode = data.weather[0].icon
        const weatherTemperature = Math.round(data.main.temp)

        const symbols: Record<string, string> = {
          "01d": "☼",
          "01n": "☾",
          "02d": "⛅",
          "02n": "☁",
          "03d": "☁",
          "03n": "☁",
          "04d": "☁",
          "04n": "☁",
          "09d": "☔",
          "09n": "☔",
          "10d": "☂",
          "10n": "☂",
          "11d": "⚡",
          "11n": "⚡",
          "13d": "❄",
          "13n": "❄",
          "50d": "⛆",
          "50n": "⛆",
        }

        const weatherSymbol = symbols[weatherIconCode] || weatherText

        setWeather(`${weatherSymbol} ${weatherTemperature}°`)
      } catch (error) {
        console.error(error)
      }
    }

    // Fetch weather data initially
    fetchWeather().then(console.log)

    // Set interval to fetch weather data
    const intervalId = setInterval(fetchWeather, 15 * 60 * 1000)

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId)
  }, [])

  return <span>{weather}</span>
}

export default Weather
