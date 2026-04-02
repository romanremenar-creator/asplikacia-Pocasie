import React, { useState, useMemo } from 'react';
import { useWeatherApi, DEFAULT_LOCATIONS } from './hooks/useWeatherApi';
import { LocationSelector } from './components/LocationSelector';
import { CurrentWeather } from './components/CurrentWeather';
import { WeatherCharts } from './components/WeatherCharts';

function App() {
  const [location, setLocation] = useState(DEFAULT_LOCATIONS[0]);
  const [activeTab, setActiveTab] = useState('dnes');
  const { data, loading, error } = useWeatherApi(location);

  const hourlyDataPrepared = useMemo(() => {
    if (!data?.hourly) return [];
    
    const limit = activeTab === 'dnes' ? 24 : activeTab === '3dni' ? 72 : 240;
    
    return data.hourly.time.slice(0, limit).map((t, i) => {
      const date = new Date(t);
      const days = ['Ned', 'Pon', 'Ut', 'Str', 'Štvr', 'Pia', 'Sob'];
      const dayStr = days[date.getDay()];
      return {
        time: t,
        timeLabel: activeTab === 'dnes' 
          ? date.toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' })
          : `${dayStr} ` + date.toLocaleDateString('sk-SK', { day: '2-digit', month: '2-digit', hour: '2-digit' }),
        temp: data.hourly.temperature_2m[i],
        precip: data.hourly.precipitation[i],
        snowfall: data.hourly.snowfall[i],
        snowfall: data.hourly.snowfall[i],
        cloudCover: data.hourly.cloud_cover[i],
        windSpeed: data.hourly.wind_speed_10m[i],
        windGusts: data.hourly.wind_gusts_10m[i],
        isNewDay: date.getHours() === 0
      };
    });
  }, [data, activeTab]);

  return (
    <div className="app-container">
      <LocationSelector 
        currentLocation={location}
        onSelectLocation={setLocation}
      />
      
      <div className="tabs">
        <button className={`tab-btn ${activeTab === 'dnes' ? 'active' : ''}`} onClick={() => setActiveTab('dnes')}>Dnes</button>
        <button className={`tab-btn ${activeTab === '3dni' ? 'active' : ''}`} onClick={() => setActiveTab('3dni')}>3 dni</button>
        <button className={`tab-btn ${activeTab === '10dni' ? 'active' : ''}`} onClick={() => setActiveTab('10dni')}>10 dní</button>
      </div>

      {error && <div className="glass" style={{padding: '2rem', color: '#ffaaaa', textAlign: 'center'}}>Error: {error}</div>}
      
      {loading ? (
        <div className="loader-container">
          <div className="spinner"></div>
          <div>Načítavam predpoveď...</div>
        </div>
      ) : data ? (
        <>
          <CurrentWeather 
            location={location}
            currentWeather={{
              temperature_2m: data.current?.temperature_2m || data.hourly?.temperature_2m[0],
              apparent_temperature: data.current?.apparent_temperature || data.hourly?.apparent_temperature[0],
              cloud_cover: data.current?.cloud_cover || data.hourly?.cloud_cover[0],
              precipitation: data.current?.precipitation || data.hourly?.precipitation[0],
              wind_speed_10m: data.current?.wind_speed_10m || data.hourly?.wind_speed_10m[0],
              relative_humidity_2m: data.current?.relative_humidity_2m || data.hourly?.relative_humidity_2m[0],
            }} 
          />
          <WeatherCharts hourlyData={hourlyDataPrepared} activeTab={activeTab} />
        </>
      ) : null}
    </div>
  );
}

export default App;
