const inputSel = document.querySelector('input');
const buttonSel = document.querySelector('button');
const loadingGif = document.querySelector('form+img');
const dispContSel = document.querySelector('.display-container');
const Weather = {};

const getRawData = async function(location) {
    const url = `
      https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=6fc083200fa46b70a3e5260993320f8d
    `;
    const weatherDataResp = await fetch(url, {mode: 'cors'});
    return weatherDataResp.json();
};

const getWeatherObj = async function(weatherData) {
    const weather = weatherData.weather[0];
    const main = weatherData.main;
    Weather.description = weather.description;
    Weather.icon = weather.icon;
    Weather.temp = String(Math.round(weatherData.main.temp) - 273);
    Weather.feels_like = String(Math.round(main.feels_like) - 273);
    Weather.temp_min = String(Math.round(main.temp_min) - 273);
    Weather.temp_max = String(Math.round(main.temp_max) - 273);
    Weather.pressure = main.pressure;
    Weather.humidity = main.humidity;
    Weather.wind_speed = weatherData.wind.speed;
    Weather.cloud = weatherData.clouds.all;
    return Weather;
};

const getGif = async function getGifFromQuery(query) {
    const response = await fetch(
      `
        https://api.giphy.com/v1/gifs/translate?api_key=YqI80dJ8PAoAhtREc4fxyE4xE56oF1jE&s=${query}
      `,
      {mode: 'cors'}
    );
    return response.json();
}

const getSentenced = function getSentenceCased(string) {
    // capitalize the first word
    let sentence = string[0].toUpperCase();
    // capitalize every other word
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
        return;
    }
    try {
        // reset `img` `src`s set in the previous search
        document.querySelectorAll('img').forEach((img) => {
            img.src= '';
        });
        dispContSel.style.visibility = 'hidden';
        loadingGif.style.visibility = 'visible';

        const weatherData = await getRawData(inputSel.value);
        if (weatherData.cod === '404') {
            throw new Error('response status code 404');
        }

        const weatherObj = await getWeatherObj(weatherData);

        // store gif links for all possibilities of weather
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

        loadingGif.style.visibility = 'hidden';
        dispContSel.style.visibility = 'visible';

        // set gifs according to weather parameters
        dispContSel.querySelector('.weather-description>img').src
          = gifJsons[0].data.images.original.url;
        if (weatherObj.temp < 25) {
            dispContSel.querySelector('.temperature>img').src
              = gifJsons[1].data.images.original.url;
        } else {
            dispContSel.querySelector('.temperature>img').src
              = gifJsons[2].data.images.original.url;
        }
        if (weatherObj.temp === weatherObj.feels_like) {
            dispContSel.querySelector('.feels-like>img').src
              = gifJsons[3].data.images.original.url;
        } else {
            dispContSel.querySelector('.feels-like>img').src
              = gifJsons[4].data.images.original.url;
        }
        dispContSel.querySelector('.minimum-temperature>img').src
          = gifJsons[5].data.images.original.url;
        dispContSel.querySelector('.maximum-temperature>img').src
          = gifJsons[6].data.images.original.url;
        dispContSel.querySelector('.pressure>img').src
          = gifJsons[7].data.images.original.url;
        dispContSel.querySelector('.humidity>img').src
          = gifJsons[8].data.images.original.url;
        dispContSel.querySelector('.wind-speed>img').src
          = gifJsons[9].data.images.original.url;
        if (weatherObj.cloud < 35) {
            dispContSel.querySelector('.cloud>img').src
              = gifJsons[10].data.images.original.url;
        } else {
            dispContSel.querySelector('.cloud>img').src
              = gifJsons[11].data.images.original.url;
        }

        const domElements = [
          {
            htmlClass: 'weather-description',
            textContent: getSentenced(weatherObj.description)
          },
          {
            htmlClass: 'temperature',
            textContent: `Temperature: ${Math.round(weatherObj.temp)}\u00B0C`
          },
          {
            htmlClass: 'feels-like',
            textContent: `
              Feels Like: ${Math.round(weatherObj.feels_like)}\u00B0C
            `
          },
          {
            htmlClass: 'minimum-temperature',
            textContent: `Minimum Temperature: ${weatherObj.temp_min}\u00B0C`
          },
          {
            htmlClass: 'maximum-temperature',
            textContent: `Maximum Temperature: ${weatherObj.temp_max}\u00B0C`
          },
          {
            htmlClass: 'pressure',
            textContent: `Pressure: ${weatherObj.pressure/1000} atm`
          },
          {
            htmlClass: 'humidity',
            textContent: `Humidity: ${weatherObj.humidity}%`
          },
          {
            htmlClass: 'wind-speed',
            textContent: `Wind Speed: ${weatherObj.wind_speed} mps`
          },
          {
            htmlClass: 'cloud',
            textContent: `Cloud: ${weatherObj.cloud}%`
          },
        ];

        domElements.forEach((ele) => {
          dispContSel.querySelector(`.${ele.htmlClass}>.text`).textContent
            = ele.textContent;
        });
    } catch (err) {
        loadingGif.style.visibility = 'hidden';
        if (err.message === 'response status code 404') {
            inputSel.setCustomValidity('No such city exists.')
            inputSel.reportValidity();
        } else {
            throw err;
        }
    }
};
buttonSel.addEventListener('click', displayWeather);
