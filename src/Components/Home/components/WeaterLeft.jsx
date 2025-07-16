// components/WeatherLeft.js
import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../../../store/hooks";
import AOS from "aos";
import "aos/dist/aos.css";
import Foto from "../../../Assents/imges/Screenshot_2-removebg-preview.png";
import {
    WiDaySunny,
    WiCloudy,
    WiRain,
    WiSnow,
    WiFog,
    WiThunderstorm,
    WiNa,
} from "react-icons/wi";

export default function WeatherLeft() {
    const { weather, bgClass } = useAppSelector((state) => state.weather);
    const [tempCount, setTempCount] = useState(0);
    const intervalRef = useRef(null);
    const imgRef = useRef(null);

    useEffect(() => {
        AOS.init({ duration: 2000, once: false });
    }, []);

    useEffect(() => {
        if (weather?.temperature) {
            let count = 0;
            clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => {
                count += 1;
                if (count >= Math.round(weather.temperature)) {
                    clearInterval(intervalRef.current);
                    count = Math.round(weather.temperature);
                }
                setTempCount(count);
            }, 30);
        }
    }, [weather?.temperature]);


    if (!weather) return null;

    const date = new Date(weather.time);
    const formattedTime = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

    const formattedDate = date.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const getWeatherIcon = (condition) => {
        switch (condition) {
            case "Clear":
                return <WiDaySunny size={48} />;
            case "Cloudy":
                return <WiCloudy size={48} />;
            case "Rainy":
                return <WiRain size={48} />;
            case "Snowy":
                return <WiSnow size={48} />;
            case "Foggy":
                return <WiFog size={48} />;
            case "Thunderstorm":
                return <WiThunderstorm size={48} />;
            default:
                return <WiNa size={48} />;
        }
    };

    return (
        <div className={`weather-home__left ${bgClass}`}>
            <small className="weather-home__logo">the.weather</small>

            <img
                ref={imgRef}
                className="weather-home__image"
                src={Foto}
                alt="Weather"
                data-aos="fade-down-right"
                data-aos-duration="2500"
            />

            <div className="weather-home__main-info">
                <h1
                    className="weather-home__temp"
                    style={{ minWidth: "80px", textAlign: "left" }}
                >
                    {tempCount}&#176;
                </h1>

                <div className="weather-home__city">
                    <h2>{weather.city}</h2>
                    <small>
                        {formattedTime} - {formattedDate}
                    </small>
                </div>

                <div className="weather-home__condition">
                    {getWeatherIcon(weather.condition)}
                    <small>{weather.condition}</small>
                </div>
            </div>
        </div>
    );
}