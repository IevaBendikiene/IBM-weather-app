import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import "./Home.css";

// Default cities with codes
const DEFAULT_CITIES = ["Vilnius", "Kaunas", "Klaipeda"];

const Home = () => {
  const [popularCities, setPopularCities] = useState([]);
  const [cityNames, setCityNames] = useState({});
  const inputRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    loadPopularCities();
  }, []);

  useEffect(() => {
    if (popularCities.length > 0) {
      fetchCityNames();
    }
  }, [popularCities]);

  // Load cities from localStorage or defaults
  const loadPopularCities = () => {
    let cities = JSON.parse(localStorage.getItem("citySearchCounts")) || {};

    let sortedCities = Object.entries(cities)
      .sort((a, b) => b[1] - a[1])
      .map(([city]) => city);

    while (sortedCities.length < 3) {
      const nextDefault = DEFAULT_CITIES.find(
        (defaultCity) => !sortedCities.includes(defaultCity)
      );
      if (nextDefault) {
        sortedCities.push(nextDefault);
      } else {
        break;
      }
    }
    setPopularCities(sortedCities.slice(0, 3));
  };
  const fetchCityNames = async () => {
    let cityNamesObj = {};

    for (let city of popularCities) {
      const normalizedCity = normalizeText(city);
      const url = `/api/v1/places/${normalizedCity}/forecasts/long-term`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        if (!response.ok) {
          alert(data.message);
          return;
        }
        if (response.ok) {
          cityNamesObj[city] = data.place.name;
        } else {
          cityNamesObj[city] = city;
        }
      } catch (error) {
        cityNamesObj[city] = city;
        console.error("Couldn't fetch city data", error);
      }
    }

    setCityNames(cityNamesObj);
  };

  const normalizeText = (text) => {
    return text
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  const handleSearch = () => {
    const city = normalizeText(inputRef.current.value);
    if (!city) return alert("Enter a city name");

    let cityCounts = JSON.parse(localStorage.getItem("citySearchCounts")) || {};
    cityCounts[city] = (cityCounts[city] || 0) + 1;
    localStorage.setItem("citySearchCounts", JSON.stringify(cityCounts));

    loadPopularCities();
    navigate(`/weather/${city}`);
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };
  return (
    <div className="container text-center home">
      <h2 className="my-4">Search for Weather Forecast</h2>
      <div className="row justify-content-center">
        <div className="col-12 col-md-6">
          <div className="search-bar d-flex alighn-items-center p-2">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search city..."
              onKeyDown={handleKeyPress}
            />
            <BiSearch className="search-icon" onClick={handleSearch} />
          </div>
        </div>
      </div>

      <h3 className="mt-4">Most Searched Cities</h3>
      <div className="row justify-content-center popular-cities">
        {popularCities.map((city, index) => (
          <div
            key={index}
            className="col-12 col-sm-4
          "
          >
            <Link to={`/weather/${city}`} className="city-link">
              {cityNames[city] || city}{" "}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
