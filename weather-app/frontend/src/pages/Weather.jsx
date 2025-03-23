import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./Weather.css";
import DayForecast from "../components/DayForecast";
import clear from "../assets/sunny.png";
import humidity from "../assets/humidity.png";
import windSpeed from "../assets/wind-speed.png";
import cloudyWithSunnyIntervals from "../assets/sunny-cloud.png";
import rain from "../assets/rain.png";
import lightRain from "../assets/sunny-rain.png";
import partlyCloudy from "../assets/sun-heavy-cloud.png";
import cloudy from "../assets/cloudy.png";

// Icons for weather conditions
const allIcons = {
  clear: clear,
  "cloudy-with-sunny-intervals": cloudyWithSunnyIntervals,
  rain: rain,
  "light-rain": lightRain,
  "partly-cloudy": partlyCloudy,
  cloudy: cloudy,
};

const Weather = () => {
  const { city } = useParams();
  const [weatherData, setWeatherData] = useState(null);

  const normalizeText = (text) => {
    return text
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  const fetchWeatherData = async (placeCode) => {
    const normalizedInput = normalizeText(placeCode);
    try {
      const url = `/api/v1/places/${normalizedInput}/forecasts/long-term`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }
      const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const day = date.getDate();
        const month = date.getMonth() + 1; // Month starts at 0
        const weekday = date.toLocaleString("en-US", { weekday: "long" });
        return `${weekday}, ${day}-${month}`;
      };

      const forecast = [];
      let currentDay = null;
      let dailyData = [];

      data.forecastTimestamps.forEach((entry) => {
        const forecastDate = new Date(
          entry.forecastTimeUtc
        ).toLocaleDateString();
        if (currentDay === null || currentDay !== forecastDate) {
          if (dailyData.length > 0) {
            forecast.push(dailyData);
          }
          currentDay = forecastDate;
          dailyData = [entry];
        } else {
          dailyData.push(entry);
        }
      });

      if (dailyData.length > 0) {
        forecast.push(dailyData);
      }
      const fiveDayForecast = forecast.slice(0, 5).map((dayData) => {
        const highestTemp = Math.max(
          ...dayData.map((entry) => entry.airTemperature)
        );
        const lowestTemp = Math.min(
          ...dayData.map((entry) => entry.airTemperature)
        );
        const humidity = dayData[0].relativeHumidity;
        const windSpeed = dayData[0].windSpeed;
        const icon = allIcons[dayData[0].conditionCode] || clear;

        return {
          date: formatDate(dayData[0].forecastTimeUtc),
          highTemp: Math.round(highestTemp),
          lowTemp: Math.round(lowestTemp),
          humidity,
          windSpeed,
          icon,
        };
      });

      const icon = allIcons[data.forecastTimestamps[0]?.conditionCode] || clear;

      setWeatherData({
        humidity: data.forecastTimestamps[0].relativeHumidity,
        windSpeed: data.forecastTimestamps[0].windSpeed,
        temperature: Math.round(data.forecastTimestamps[0].airTemperature),
        location: data.place.name,
        icon: icon,
        forecast: fiveDayForecast,
      });
    } catch (error) {
      console.error("Couldn't get data", error);
      setWeatherData(false);
    }
  };

  useEffect(() => {
    if (city) {
      fetchWeatherData(city);

      fetch("http://localhost:3001/log-city", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ city }),
      }).catch((err) => console.error("Failed to log city selection", err));
    }
  }, [city]);

  return weatherData ? (
    <div className="container weather">
      <Link
        to="/"
        className="btn btn-light back-to-home position-absolute top-0 start-0 m-3"
      >
        Home
      </Link>
      <div className="row justify-content-center align-items-center text-center">
        <div className="col-md-6">
          <img
            src={weatherData.icon}
            alt={weatherData.icon}
            className="weather-icon img-fluid"
          />
          <p className="temperature">{weatherData.temperature}°C</p>
          <h3 className="location">{weatherData.location}</h3>
        </div>
      </div>

      <div className="row weather-data text-center">
        <div className="col-6 col-md-4 d-flex alighn-items-center">
          <img
            src={humidity}
            alt="Humidity-icon"
            className="weather-icon-small"
          />
          <div>
            <p>{weatherData.humidity}%</p>
            <span>Humidity</span>
          </div>
        </div>
        <div className="col-6 col-md-4 d-flex alighn-items-center">
          <img src={windSpeed} alt="Wind-icon" className="weather-icon-small" />
          <div>
            <p>{weatherData.windSpeed} Km/h</p>
            <span>Wind Speed</span>
          </div>
        </div>
      </div>
      <div className="forecast">
        <h3 className="forecast-title">5-Day Forecast</h3>
        <div className="row justify-content-center gap2">
          {weatherData.forecast.map((day, index) => (
            <div key={index} className="col-6 col-md-2 forecast-list">
              <DayForecast
                key={index}
                date={day.date}
                icon={day.icon}
                highTemp={day.highTemp}
                lowTemp={day.lowTemp}
                humidity={day.humidity}
                windSpeed={day.windSpeed}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default Weather;
