import React from 'react';
import { Cloud, Droplets, Wind, Thermometer, Sun } from 'lucide-react';

export const CurrentWeather = ({ currentWeather, location }) => {
  if (!currentWeather || !location) return null;

  return (
    <div className="current-weather">
      { /* Main Temp */ }
      <div className="glass main-info">
        <h2 className="location-name">{location.name}</h2>
        {location.elevation !== undefined && (
          <div className="elevation-info">{location.elevation} m n. m.</div>
        )}
        <div className="temp">{Math.round(currentWeather.temperature_2m)}°</div>
        <div className="desc">Oblačnosť: {currentWeather.cloud_cover}%</div>
      </div>

      { /* Details */ }
      <div className="details-grid">
        <div className="glass detail-card">
          <Thermometer className="detail-icon" />
          <div className="detail-info">
            <span className="detail-label">Pocitová teplota: </span>
            <span className="detail-value">{Math.round(currentWeather.apparent_temperature)}°C</span>
          </div>
        </div>
        <div className="glass detail-card">
          <Droplets className="detail-icon" />
          <div className="detail-info">
            <span className="detail-label">Zrážky: </span>
            <span className="detail-value">{currentWeather.precipitation || 0} mm</span>
          </div>
        </div>
        <div className="glass detail-card">
          <Wind className="detail-icon" />
          <div className="detail-info">
            <span className="detail-label">Vietor: </span>
            <span className="detail-value">{Math.round(currentWeather.wind_speed_10m)} km/h</span>
          </div>
        </div>
        <div className="glass detail-card">
          <Cloud className="detail-icon" />
          <div className="detail-info">
            <span className="detail-label">Vlhkosť: </span>
            <span className="detail-value">{currentWeather.relative_humidity_2m}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
