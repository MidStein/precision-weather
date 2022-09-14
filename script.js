const Weather = {};

const getWeatherObj = async function(location) {
    const weatherData = await getRawData(location);
    const weather = weatherData.weather[0];
    const main = weatherData.main;
    Weather.main = weather.main;
    Weather.description = weather.description;
    Weather.icon = weather.icon;
    Weather.temp = weatherData.main.temp;
    Weather.feels_like = main.feels_like;
    Weather.temp_min = main.temp_min;
    Weather.temp_max = main.temp_max;
    Weather.pressure = main.pressure;
    Weather.humidity = main.humidity;
    Weather.wind_speed = weatherData.wind.speed;
    Weather.cloud = weatherData.clouds.all;
    return Weather;
};
const getRawData = async function(location) {
    const weatherDataResp = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=6fc083200fa46b70a3e5260993320f8d`, {mode: 'cors'});
    const weatherData = await weatherDataResp.json();
    return weatherData;
};