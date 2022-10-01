const inputSel = document.querySelector('input');
const buttonSel = document.querySelector('button');
const Weather = {};

const getWeatherObj = async function(location) {
    const weatherData = await getRawData(location);
    if (weatherData.cod === '404') {
        throw new Error('response status code 404');
    }
    const weather = weatherData.weather[0];
    const main = weatherData.main;
    Weather.main = weather.main;
    Weather.description = weather.description;
    Weather.icon = weather.icon;
    Weather.temp = String(Number(weatherData.main.temp) - 273);
    Weather.feels_like = String(Number(main.feels_like) - 273);
    Weather.temp_min = String(Number(main.temp_min) - 273);
    Weather.temp_max = String(Number(main.temp_max) - 273);
    Weather.pressure = main.pressure;
    Weather.humidity = main.humidity;
    Weather.wind_speed = weatherData.wind.speed;
    Weather.cloud = weatherData.clouds.all;
    return Weather;
};
const getRawData = async function(location) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=6fc083200fa46b70a3e5260993320f8d`;
    const weatherDataResp = await fetch(url, {mode: 'cors'});
    return weatherDataResp.json();
};
const displayWeather = async function() {
    if (inputSel.value === '') {
        inputSel.setCustomValidity('This field cannot be empty.')
        inputSel.reportValidity();
    }
    try {
        const weatherObj = await getWeatherObj(inputSel.value);
        console.log(`Weather Type: ${weatherObj.main}`);
        console.log(`Weather Description: ${weatherObj.description}`);
        console.log(`Temperature: ${Math.round(weatherObj.temp)} degree Celcius`);
        console.log(`Feels Like: ${Math.round(weatherObj.feels_like)} degree Celcius`);
        console.log(`Minimum Temperature: ${Math.round(weatherObj.temp_max)} degree Celcius`);
        console.log(`Maximum Temperature: ${Math.round(weatherObj.temp_max)} degree Celcius`);
        console.log(`Pressure: ${weatherObj.pressure} hPa`);
        console.log(`Humidity: ${weatherObj.humidity}%`);
        console.log(`Wind Speed: ${weatherObj.wind_speed} meters per second`);
        console.log(`Cloud: ${weatherObj.cloud}%`);
    } catch (err) {
        if (err.message === 'response status code 404') {
            console.log('No such city exists.');
        } else {
            throw err;
        }
    }
};
buttonSel.addEventListener('click', displayWeather);
