// components/WeatherHome.js
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchWeatherData } from "../../store/WeatherSlice";
import WeatherLeft from "./components/WeaterLeft";
import WeatherRight from "./components/WeatherRight";
import LoadingSpinner from "../UI/Loading";

export default function WeatherHome() {
  const dispatch = useAppDispatch();
  const { isLoading, bodyBgClass } = useAppSelector((state) => state.weather);

  useEffect(() => {
    dispatch(fetchWeatherData("Tashkent"));
  }, [dispatch]);

  useEffect(() => {
    document.body.className = bodyBgClass;
  }, [bodyBgClass]);

  return (
    <div className="weather-home">
      {isLoading && <LoadingSpinner />}
      <div className="weather-home__card">
        <WeatherLeft />
        <WeatherRight />
      </div>
    </div>
  );
}