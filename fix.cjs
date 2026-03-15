const fs = require('fs');

let api = fs.readFileSync('src/hooks/useWeatherApi.js', 'utf8');
api = api.replace('precipitation,weather_code', 'precipitation,snowfall,weather_code');
fs.writeFileSync('src/hooks/useWeatherApi.js', api);

let app = fs.readFileSync('src/App.jsx', 'utf8');
app = app.replace('precip: data.hourly.precipitation[i],', 'precip: data.hourly.precipitation[i],\n        snowfall: data.hourly.snowfall[i],');
fs.writeFileSync('src/App.jsx', app);

let wc = fs.readFileSync('src/components/WeatherCharts.jsx', 'utf8');
wc = wc.replace('BarChart, Bar, XAxis', 'BarChart, Bar, Cell, XAxis');
wc = wc.replace('<Bar dataKey="precip" fill="var(--chart-precip)" radius={[4, 4, 0, 0]} name="Úhnn Zrážkok" />', 
  '<Bar dataKey="precip" radius={[4, 4, 0, 0]} name="Úhrn Zrážok">\n' +
  '  {hourlyData.map((entry, index) => (\n' +
  '    <Cell key={`cell-${index}`} fill={entry.snowfall > 0 ? \'#cccccc\' : \'var(--chart-precip)\'} />\n' +
  '  ))}\n' +
  '</Bar>'
);
wc = wc.replace('<Bar dataKey="precip" fill="var(--chart-precip)" radius={[4, 4, 0, 0]} name="Úhrn Zrážok" />', 
  '<Bar dataKey="precip" radius={[4, 4, 0, 0]} name="Úhrn Zrážok">\n' +
  '  {hourlyData.map((entry, index) => (\n' +
  '    <Cell key={`cell-${index}`} fill={entry.snowfall > 0 ? \'#cccccc\' : \'var(--chart-precip)\'} />\n' +
  '  ))}\n' +
  '</Bar>'
);
fs.writeFileSync('src/components/WeatherCharts.jsx', wc);
