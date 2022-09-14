const getWeatherData = async function(location) {
    const weatherDataResp = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=6fc083200fa46b70a3e5260993320f8d`, {mode: 'cors'});
    const weatherData = await weatherDataResp.json();
    console.log(weatherData);
};
getWeatherData('Phagwara');