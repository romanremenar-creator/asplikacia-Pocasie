import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine
} from 'recharts';

const CustomXAxisTick = ({ x, y, payload, activeTab, isMobile }) => {
  if (!payload || !payload.value) return null;
  const date = new Date(payload.value);
  if (activeTab === "dnes") {
    // Na mobiloch (aj na šírku) používame zjednodušenú hodinu
    const timeStr = isMobile 
      ? date.getHours() // Iba číslo (napr. 8)
      : date.toLocaleTimeString("sk-SK", { hour: "2-digit", minute: "2-digit" });
    
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" className="chart-tick-primary">{timeStr}</text>
      </g>
    );
  } else {
    const days = ["Ned", "Pon", "Ut", "Str", "Štvr", "Pia", "Sob"];
    // Pre 10-dňovú predpoveď zobrazujeme iba číslo dňa
    const dateStr = activeTab === "10dni" 
      ? date.getDate() 
      : date.toLocaleDateString("sk-SK", { day: "2-digit", month: "2-digit" });
    const dayStr = days[date.getDay()];
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" className="chart-tick-primary">{dateStr}</text>
        <text x={0} y={0} dy={32} textAnchor="middle" className="chart-tick-secondary">{dayStr}</text>
      </g>
    );
  }
};

const CustomTooltip = ({ active, payload, label, firstPointTime, labelFormatter, formatter }) => {
  if (active && payload && payload.length) {
    // Schovanie tooltipu na úplnom začiatku pre malé obrazovky (šírka < 900px alebo výška < 500px)
    const isSmallWidth = window.innerWidth < 900;
    const isSmallHeight = window.innerHeight < 500;
    if (label === firstPointTime && (isSmallWidth || isSmallHeight)) {
      return null;
    }

    return (
      <div className="glass" style={{ 
        padding: '10px', 
        backgroundColor: 'rgba(30, 30, 47, 0.9)', 
        borderColor: 'rgba(255, 255, 255, 0.1)', 
        borderRadius: '8px',
        color: '#fff',
        boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
      }}>
        <p style={{ margin: 0, fontSize: '13px', marginBottom: '5px', color: '#fff' }}>
          {labelFormatter(label)}
        </p>
        {payload.map((item, index) => (
          <p key={index} style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#ff8c42' }}>
            {item.name}: {item.value}{item.unit || (formatter && typeof formatter === 'function' ? formatter(item.value)[0].replace(/[0-9.]/g, '') : '°C')}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const WeatherCharts = ({ hourlyData, activeTab }) => {
  // Hraničná hodnota 900px pokryje aj mobily na šírku (landscape)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!hourlyData || hourlyData.length === 0) return null;

  const dataMax = Math.max(...hourlyData.map(i => i.temp));
  const dataMin = Math.min(...hourlyData.map(i => i.temp));
  const firstPointTime = hourlyData[0].time;
  
  const chartTicks = activeTab === "dnes" 
    ? (isMobile 
        ? hourlyData.filter(d => new Date(d.time).getHours() % 4 === 0).map(d => d.time) // Každé 4h na mobiloch
        : undefined) 
    : hourlyData.filter(d => new Date(d.time).getHours() === 12).map(d => d.time);

  let off = 1;
  if (dataMax <= 0) {
    off = 0;
  } else if (dataMin >= 0) {
    off = 1;
  } else {
    off = dataMax / (dataMax - dataMin);
  }

  const tooltipLabelFormatter = (label) => {
    if (!label) return '';
    const date = new Date(label);
    const ts = date.toLocaleTimeString('sk-SK', {hour:'2-digit', minute:'2-digit'});
    const ds = ['Ned','Pon','Ut','Str','Štvr','Pia','Sob'][date.getDay()];
    const dateStr = date.toLocaleDateString('sk-SK', {day:'2-digit',month:'2-digit'});
    return `Čas: ${ts} (${ds} ${dateStr})`;
  };

  return (
    <div className="charts-container">
      { /* Temp */ }
      <div className="glass chart-card">
        <h3 className="chart-header">Vývoj teploty</h3>
        <div style={{width: '100%', height: 300}}>
          <ResponsiveContainer>
            <AreaChart data={hourlyData} margin={{ top: 10,right: 10, left: -20, bottom: 30 }}>
              <defs>
                <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-temp-day)" stopOpacity={0.3} />
                  <stop offset={off} stopColor="var(--chart-temp-day)" stopOpacity={0.1} />
                  <stop offset={off} stopColor="var(--chart-temp-night)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--chart-temp-night)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="splitColorStroke" x1="0" y1="0" x2="0" y2="1">
                  <stop offset={off} stopColor="var(--chart-temp-day)" stopOpacity={1} />
                  <stop offset={off} stopColor="var(--chart-temp-night)" stopOpacity={1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              {hourlyData.filter(d => d.isNewDay).map((d, index) => (
                <ReferenceLine key={'ref-'+index} x={d.time} stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
              ))}
              <XAxis 
                dataKey="time" 
                ticks={chartTicks} 
                tick={<CustomXAxisTick activeTab={activeTab} isMobile={isMobile} />} 
                stroke="var(--text-secondary)" 
                fontSize={12} 
                tickMargin={10} 
                minTickGap={0} 
                interval={0}
              />
              <YAxis stroke="var(--text-secondary)" fontSize={12} tickFormatter={(value) => `${value}°`} />
              <Tooltip 
                content={<CustomTooltip firstPointTime={firstPointTime} labelFormatter={tooltipLabelFormatter} formatter={(v) => [`${v}°C`]} />}
              />
              <Legend verticalAlign="top" height={36} />
              <Area type="monotone" dataKey="temp" stroke="url(#splitColorStroke)" strokeWidth={2} fillOpacity={1} fill="url(#splitColor)" name="Teplota" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      { /* Precip */ }
      <div className="glass chart-card">
        <h3 className="chart-header">Zrážkový model</h3>
        <div style={{width: '100%', height: 250}}>
          <ResponsiveContainer>
            <BarChart data={hourlyData} margin={{ top: 10,right: 10, left: -20, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              {hourlyData.filter(d => d.isNewDay).map((d, index) => (
                <ReferenceLine key={'ref-'+index} x={d.time} stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
              ))}
              <XAxis 
                dataKey="time" 
                ticks={chartTicks} 
                tick={<CustomXAxisTick activeTab={activeTab} isMobile={isMobile} />} 
                stroke="var(--text-secondary)" 
                fontSize={12} 
                tickMargin={10} 
                minTickGap={0} 
                interval={0}
              />
              <YAxis stroke="var(--text-secondary)" fontSize={12} tickFormatter={(value) => `${value} mm`} />
              <Bar dataKey="precip" radius={[4, 4, 0, 0]} name="Úhrn Zrážok">
                {hourlyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.snowfall > 0 ? '#cccccc' : 'var(--chart-precip)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      { /* Clouds */ }
      <div className="glass chart-card">
        <h3 className="chart-header">Oblačnosť</h3>
        <div style={{width: '100%', height: 200}}>
          <ResponsiveContainer>
            <BarChart data={hourlyData} margin={{ top: 10,right: 10, left: -20, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              {hourlyData.filter(d => d.isNewDay).map((d, index) => (
                <ReferenceLine key={'ref-'+index} x={d.time} stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
              ))}
              <XAxis 
                dataKey="time" 
                ticks={chartTicks} 
                tick={<CustomXAxisTick activeTab={activeTab} isMobile={isMobile} />} 
                stroke="var(--text-secondary)" 
                fontSize={12} 
                tickMargin={10} 
                minTickGap={0} 
                interval={0}
              />
              <YAxis stroke="var(--text-secondary)" fontSize={12} domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
              <Bar dataKey="cloudCover" fill="var(--chart-cloud)" radius={[2, 2, 0, 0]} name="Oblačnosť" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
