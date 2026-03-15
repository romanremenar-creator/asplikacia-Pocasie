import { useState, useEffect } from 'react';

export const DEFAULT_LOCATIONS = [
  { name: 'Bratislava', lat: 48.1486, lon: 17.1077, elevation: 152 },
  { name: 'Ostrý Grúň', lat: 48.5655, lon: 18.6617, elevation: 441 }
];

export const useWeatherApi = (location) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!location) return;

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const { lat, lon, elevation } = location;
        
        // Added &current=... to get real-time data
        let url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,snowfall,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_probability_max&models=best_match&timezone=Europe%2FBratislava&forecast_days=10`;
        
        if (elevation !== undefined && elevation !== null) {
             url += `&elevation=${elevation}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
           throw new Error('Failed to fetch weather data');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location]);

  return { data, loading, error };
};

export const searchLocation = async (query) => {
  if (!query) return [];
  try {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=sk&format=json`);
    if (!response.ok) throw new Error('Failed to fetch location');
    const result = await response.json();
    return result.results?.map(loc => ({
      name: loc.name,
      country: loc.country,
      admin1: loc.admin1,
      lat: loc.latitude,
      lon: loc.longitude,
      elevation: loc.elevation
    })) || [];
  } catch (err) {
    console.error(err);
    return [];
  }
};
