// components/WeatherRight.js
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setCurrentCity, fetchWeatherData } from "../../../store/WeatherSlice";

export default function WeatherRight() {
    const dispatch = useAppDispatch();
    const { currentCity, weather, popularCities } = useAppSelector((state) => state.weather);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const handleCityChange = (e) => {
        dispatch(setCurrentCity(e.target.value));
    };

    const handleSearch = () => {
        if (currentCity.trim()) {
            dispatch(fetchWeatherData(currentCity));
        }
    };

    const handleCityClick = (cityName) => {
        dispatch(setCurrentCity(cityName));
        dispatch(fetchWeatherData(cityName));
    };

    const [temp, setTemp] = useState(0);
    const [windSpeed, setWindSpeed] = useState(0);
    const [windDir, setWindDir] = useState(0);
    const [precip, setPrecip] = useState(0);

    const animateNumber = (target, setter) => {
        let count = 0;
        const interval = setInterval(() => {
            count += 1;
            if (count >= Math.round(target)) {
                clearInterval(interval);
                setter(Math.round(target));
            } else {
                setter(count);
            }
        }, 20);
    };

    useEffect(() => {
        if (weather) {
            animateNumber(weather.temperature, setTemp);
            animateNumber(weather.windspeed, setWindSpeed);
            animateNumber(weather.winddirection, setWindDir);
            animateNumber(weather.precipitation ?? 0, setPrecip);
        }
    }, [weather]);

    return (
        <div className="weather-home__right">
            <div className="weather-home__search">
                <input
                    type="text"
                    name="location"
                    value={currentCity}
                    onChange={handleCityChange}
                    placeholder="Enter region or city"
                    className="weather-home__input"
                    onKeyDown={handleKeyDown}
                />
                <div className="weather-home__icon" onClick={handleSearch}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="m18.031 16.617l4.283 4.282l-1.415 1.415l-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9s9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617m-2.006-.742A6.98 6.98 0 0 0 18 11c0-3.867-3.133-7-7-7s-7 3.133-7 7s3.133 7 7 7a6.98 6.98 0 0 0 4.875-1.975z"
                        />
                    </svg>
                </div>
            </div>

            <div className="weather-home__locations">
                {popularCities.map((cityName, index) => (
                    <p
                        key={index}
                        className="weather-home__location"
                        onClick={() => handleCityClick(cityName)}
                    >
                        {cityName}
                    </p>
                ))}
            </div>

            <div className="weather-home__divider"></div>

            <div className="weather-home__details">
                <h2>Weather Details</h2>
                {!weather ? (
                    <p className="weather-home__note">Search region to view weather</p>
                ) : (
                    <>
                        <div className="weather-home__detail-item">
                            <p>Temperature</p>
                            <span>{temp} °C</span>
                        </div>
                        <div className="weather-home__detail-item">
                            <p>Wind Speed</p>
                            <span>{windSpeed} km/h</span>
                        </div>
                        <div className="weather-home__detail-item">
                            <p>Wind Direction</p>
                            <span>{windDir}°</span>
                        </div>
                        <div className="weather-home__detail-item">
                            <p>Rain</p>
                            <span>{precip} mm</span>
                        </div>
                    </>
                )}
            </div>

            <div className="weather-home__divider"></div>
        </div>
    );
}