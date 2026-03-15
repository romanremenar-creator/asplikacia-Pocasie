import React from 'react';
import {
  AreaChart, Area, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine
} from 'recharts';

export const WeatherCharts = ({ hourlyData }) => {
  if (!hourlyData || hourlyData.length === 0) return null;

  const dataMax = Math.max(...hourlyData.map(i => i.temp));
  const dataMin = Math.min(...hourlyData.map(i => i.temp));
  
  let off = 1;
  if (dataMax <= 0) {
    off = 0;
  } else if (dataMin >= 0) {
    off = 1;
  } else {
    off = dataMax / (dataMax - dataMin);
  }

  return (
    <div className="charts-container">
      { /* Temp */ }
      <div className="glass chart-card">
        <h3 className="chart-header">Vývoj teploty</h3>
        <div style={{width: '100%', height: 300}}>
          <ResponsiveContainer>
            <AreaChart data={hourlyData} margin={{ top: 10,right: 10, left: -20, bottom: 0 }}>
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
                <ReferenceLine key={'ref-'+index} x={d.timeLabel} stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
              ))}
              <XAxis dataKey="timeLabel" stroke="var(--text-secondary)" fontSize={12} tickMargin={10} minTickGap={30} />
              <YAxis stroke="var(--text-secondary)" fontSize={12} tickFormatter={(value) => `${value}°`} />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 30, 47, 0.9)', borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px' ,color: '#fff' }} itemStyle={{ color: '#ff8c42' }} labelFormatter={(label, payload) => payload && payload.length > 0 && payload[0].payload.time ? `Cas: ${new Date(payload[0].payload.time).toLocaleTimeString('sk-SK', {hour: '2-digit', minute:'2-digit'})} (${label})` : `Čas: ${label}`} formatter={(value) => [`${value}°C`, 'Teplota']} />
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
            <BarChart data={hourlyData} margin={{ top: 10,right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              {hourlyData.filter(d => d.isNewDay).map((d, index) => (
                <ReferenceLine key={'ref-'+index} x={d.timeLabel} stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
              ))}
              <XAxis dataKey="timeLabel" stroke="var(--text-secondary)" fontSize={12} tickMargin={10} minTickGap={30} />
              <YAxis stroke="var(--text-secondary)" fontSize={12} tickFormatter={(value) => `${value} mm`} />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 30, 47, 0.9)', borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px' ,color: '#fff' }} itemStyle={{ color: '#ff8c42' }} labelFormatter={(label, payload) => payload && payload.length > 0 && payload[0].payload.time ? `Cas: ${new Date(payload[0].payload.time).toLocaleTimeString('sk-SK', {hour: '2-digit', minute:'2-digit'})} (${label})` : `Čas: ${label}`} formatter={(value) => [`${value} mm`, 'Zrážky']} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
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
            <BarChart data={hourlyData} margin={{ top: 10,right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              {hourlyData.filter(d => d.isNewDay).map((d, index) => (
                <ReferenceLine key={'ref-'+index} x={d.timeLabel} stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
              ))}
              <XAxis dataKey="timeLabel" stroke="var(--text-secondary)" fontSize={12} tickMargin={10} minTickGap={30} />
              <YAxis stroke="var(--text-secondary)" fontSize={12} domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 30, 47, 0.9)', borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px' ,color: '#fff' }} itemStyle={{ color: '#ff8c42' }} labelFormatter={(label) => `Čas: ${label}`} formatter={(value) => [`${value}%`, 'Oblačnosť']} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
              <Bar dataKey="cloudCover" fill="var(--chart-cloud)" radius={[2, 2, 0, 0]} name="Oblačnosť" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
