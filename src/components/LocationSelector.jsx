import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin } from 'lucide-react';
import { searchLocation, DEFAULT_LOCATIONS } from '../hooks/useWeatherApi';

export const LocationSelector = ({ onSelectLocation, currentLocation }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length > 2) {
        setIsSearching(true);
        const res = await searchLocation(query);
        setResults(res);
        setIsSearching(false);
        setShowResults(true);
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelect = (loc) => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    onSelectLocation(loc);
  };

  return (
    <header>
      <div className="header-top">
        <h1>Meteo AI</h1>
        <div className="search-container" ref={searchRef}>
          <Search className="search-icon" size={20} />
          <input
            type="text"
            className="search-input"
            placeholder="Vyhlaďat lokalitu..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { if (query.length > 2) setShowResults(true); }}
          />
          {showResults && (
            <div className="search-results">
              {isSearching ? (
                <div className="search-item">
                  <span className="search-item-sub">Hľadám...</span>
                </div>
              ) : results.length > 0 ? (
                results.map((loc, i) => (
                  <div key={i} className="search-item" onClick={() => handleSelect(loc)}>
                    <div className="search-item-info">
                      <span className="search-item-name">{loc.name}</span>
                      <span className="search-item-sub">{loc.admin1 ? `${loc.admin1}, ` : ''}{loc.country} {loc.elevation ? `(${loc.elevation} m)` : ''}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="search-item"><span className="search-item-sub">Nenášli sa žiadne výsledky</span></div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="quick-locations">
        {DEFAULT_LOCATIONS.map(loc => (
          <button
            key={loc.name}
            className={`location-btn ${currentLocation?.name === loc.name ? 'active' : ''}`}
           onClick={() => handleSelect(loc)}
          >
            <MapPin size={16} /> {loc.name}
          </button>
        ))}
      </div>
    </header>
  );
};
