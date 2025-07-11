const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // <-- Replace with your real key

const citySelect = document.getElementById('citySelect');
const getWeatherBtn = document.getElementById('getWeatherBtn');
const weatherResult = document.getElementById('weatherResult');

getWeatherBtn.addEventListener('click', () => {
  // Dynamically build the URL each time to avoid stale data
  const city = citySelect.value;
  const url = new URL('https://api.openweathermap.org/data/2.5/weather');
  url.searchParams.set('q', city);
  url.searchParams.set('units', 'metric');
  url.searchParams.set('appid', API_KEY);
  fetchWeather(url);
});

async function fetchWeather(url) {
  try {
    const res = await fetch(url.toString());
    if (!res.ok) {
      // Handle specific HTTP errors
      if (res.status === 404) throw new Error('City not found');
      if (res.status === 429) throw new Error('Too many requests – please try again later');
      throw new Error(`HTTP error ${res.status}`);
    }
    const data = await res.json();
    displayWeather(data);
  } catch (err) {
    console.error('Fetch error:', err);
    weatherResult.innerHTML = `<p style="color: red;">Error: ${err.message}</p>`;
  }
}

function displayWeather(data) {
  const { name } = data;
  const { temp, humidity } = data.main;
  const { description, icon } = data.weather[0];
  const windSpeed = data.wind.speed;

  weatherResult.innerHTML = `
    <h2>Weather in ${name}</h2>
    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
    <p><strong>${temp.toFixed(1)}°C</strong> – ${description}</p>
    <p>Humidity: ${humidity}% | Wind: ${windSpeed} m/s</p>
  `;
}
