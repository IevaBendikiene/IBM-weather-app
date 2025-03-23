import React from "react";
import "./DayForecast.css";
const DayForecast = ({
  date,
  icon,
  highTemp,
  lowTemp,
  humidity,
  windSpeed,
}) => {
  return (
    <div className="day-forecast">
      <h6>{date}</h6>
      <img src={icon} alt="Weather icon" className="weather-icon" />
      <div className="temperature">
        <p>High: {highTemp}°C</p>
        <p>Low: {lowTemp}°C</p>
      </div>
      <div className="weather-details">
        <p>Humidity: {humidity}%</p>
        <p>Wind Speed: {windSpeed} km/h</p>
      </div>
    </div>
  );
};

export default DayForecast;
