const inputSel = document.querySelector('input');
const buttonSel = document.querySelector('button');
const dispContSel = document.querySelector('.display-container');
const Weather = {};

const getWeatherObj = async function(location) {
    const weatherData = await getRawData(location);
    if (weatherData.cod === '404') {
        throw new Error('response status code 404');
    }
    const weather = weatherData.weather[0];
    const main = weatherData.main;
    Weather.description = weather.description;
    Weather.icon = weather.icon;
    Weather.temp = String(Number(Math.round(weatherData.main.temp)) - 273);
    Weather.feels_like = String(Number(Math.round(main.feels_like)) - 273);
    Weather.temp_min = String(Number(Math.round(main.temp_min)) - 273);
    Weather.temp_max = String(Number(Math.round(main.temp_max)) - 273);
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
const getGif = async function getGifFromQuery(query) {
    const response = await fetch(`https://api.giphy.com/v1/gifs/translate?api_key=YqI80dJ8PAoAhtREc4fxyE4xE56oF1jE&s=${query}`, {mode: 'cors'});
    return response.json();
}
const getSentenced = function getSentenceCased(string) {
    let sentence = string[0].toUpperCase();
    for (let i = 1; i < string.length; i++) {
        if (string[i - 1] !== ' ') {
            sentence += string[i];
        } else {
            sentence += string[i].toUpperCase();
        }
    }
    return sentence;
}
const displayWeather = async function() {
    if (inputSel.value === '') {
        inputSel.setCustomValidity('This field cannot be empty.')
        inputSel.reportValidity();
    }
    try {
        const weatherObj = await getWeatherObj(inputSel.value);
        const gifJsons = await Promise.all([
            getGif(weatherObj.description), 
            getGif('low temperature'), 
            getGif('high temperature'), 
            getGif('same'),
            getGif('different'), 
            getGif('lowest'), 
            getGif('maximum temperature'), 
            getGif('atmospheric pressure'), 
            getGif('atmospheric humidity'), 
            getGif('wind'), 
            getGif('calm sky'),
            getGif('cloudy')
        ]);
        dispContSel.querySelector('.weather-description>img').src = gifJsons[0].data.images.original.url;
        if (weatherObj.temp < 25) {
            dispContSel.querySelector('.temperature>img').src = gifJsons[1].data.images.original.url;
        } else {
            dispContSel.querySelector('.temperature>img').src = gifJsons[2].data.images.original.url;
        }
        if (weatherObj.temp === weatherObj.feels_like) {
            dispContSel.querySelector('.feels-like>img').src = gifJsons[3].data.images.original.url;
        } else {
            dispContSel.querySelector('.feels-like>img').src = gifJsons[4].data.images.original.url;
        }
        
        dispContSel.querySelector('.minimum-temperature>img').src = gifJsons[5].data.images.original.url;
        dispContSel.querySelector('.maximum-temperature>img').src = gifJsons[6].data.images.original.url;
        dispContSel.querySelector('.pressure>img').src = gifJsons[7].data.images.original.url;
        dispContSel.querySelector('.humidity>img').src = gifJsons[8].data.images.original.url;
        dispContSel.querySelector('.wind-speed>img').src = gifJsons[9].data.images.original.url;
        if (weatherObj.cloud < 35) {
            dispContSel.querySelector('.cloud>img').src = gifJsons[10].data.images.original.url;
        } else {
            dispContSel.querySelector('.cloud>img').src = gifJsons[11].data.images.original.url;
        }
        dispContSel.querySelector('.weather-description>.text').textContent = getSentenced(weatherObj.description);
        dispContSel.querySelector('.temperature>.text').textContent = `Temperature: ${Math.round(weatherObj.temp)}\u00B0C`;
        dispContSel.querySelector('.feels-like>.text').textContent = `Feels Like: ${Math.round(weatherObj.feels_like)}\u00B0C`;
        dispContSel.querySelector('.minimum-temperature>.text').textContent = `Minimum Temperature: ${weatherObj.temp_min}\u00B0C`;
        dispContSel.querySelector('.maximum-temperature>.text').textContent = `Maximum Temperature: ${weatherObj.temp_max}\u00B0C`;
        dispContSel.querySelector('.pressure>.text').textContent = `Pressure: ${weatherObj.pressure/1000} atm`;
        dispContSel.querySelector('.humidity>.text').textContent = `Humidity: ${weatherObj.humidity}%`;
        dispContSel.querySelector('.wind-speed>.text').textContent = `Wind Speed: ${weatherObj.wind_speed} mps`;
        dispContSel.querySelector('.cloud>.text').textContent = `Cloud: ${weatherObj.cloud}%`;
    } catch (err) {
        if (err.message === 'response status code 404') {
            console.log('No such city exists.');
        } else {
            throw err;
        }
    }
};
buttonSel.addEventListener('click', displayWeather);
