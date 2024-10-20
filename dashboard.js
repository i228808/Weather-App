
const API_KEY = API.OPENAPI;
const DEFAULT_CITY = 'Islamabad';

let temperatureChart, precipitationChart, windChart, weatherSummaryChart;
let currentUnit = 'metric';

const weatherConditions = {
    Clear: { from: 'from-yellow-300', to: 'to-blue-400', icon: '☀️' },
    Clouds: { from: 'from-gray-300', to: 'to-gray-500', icon: '☁️' },
    Rain: { from: 'from-blue-300', to: 'to-blue-500', icon: '🌧️' },
    Snow: { from: 'from-blue-100', to: 'to-gray-300', icon: '❄️' },
    Thunderstorm: { from: 'from-gray-600', to: 'to-gray-800', icon: '⛈️' },
    Drizzle: { from: 'from-blue-200', to: 'to-blue-400', icon: '🌦️' },
    Mist: { from: 'from-gray-300', to: 'to-gray-400', icon: '🌫️' }
};

function showSpinner() {
    document.getElementById('loadingSpinner').style.display = 'flex';
}

function hideSpinner() {
    document.getElementById('loadingSpinner').style.display = 'none';
}

async function fetchWeatherData(city) {
    showSpinner();
    try {
        const currentWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${currentUnit}`);
        const currentWeatherData = await currentWeatherResponse.json();

        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=${currentUnit}`);
        const forecastData = await forecastResponse.json();

        updateCurrentWeather(currentWeatherData);
        updateCharts(forecastData);
        updateBackgroundColor(currentWeatherData.weather[0].main);
        updateWeatherSummaryChart(forecastData.list);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data. Please try again.');
    } finally {
        hideSpinner();
    }
}

async function fetchWeatherByCoords(lat, lon) {
    showSpinner();
    try {
        const currentWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${currentUnit}`);
        const currentWeatherData = await currentWeatherResponse.json();

        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${currentUnit}`);
        const forecastData = await forecastResponse.json();

        updateCurrentWeather(currentWeatherData);
        updateCharts(forecastData);
        updateBackgroundColor(currentWeatherData.weather[0].main);
        updateWeatherSummaryChart(forecastData.list);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data. Please try again.');
    } finally {
        hideSpinner();
    }
}

function updateCurrentWeather(data) {
    document.getElementById('cityName').textContent = data.name;
    document.getElementById('weatherDescription').textContent = data.weather[0].description;
    document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°${currentUnit === 'metric' ? 'C' : 'F'}`;
    document.getElementById('feelsLike').textContent = `Feels like ${Math.round(data.main.feels_like)}°${currentUnit === 'metric' ? 'C' : 'F'}`;
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('windSpeed').textContent = `${data.wind.speed} ${currentUnit === 'metric' ? 'm/s' : 'mph'}`;
    document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;
    
    const weatherIcon = document.getElementById('weatherIcon');
    const condition = weatherConditions[data.weather[0].main] || weatherConditions.Clear;
    weatherIcon.textContent = condition.icon;
}

function updateCharts(data) {
    const next24Hours = data.list.slice(0, 8);
    
    updateTemperatureChart(next24Hours);
    updatePrecipitationChart(next24Hours);
    updateWindChart(next24Hours);
}

function updateTemperatureChart(data) {
    const labels = data.map(entry => new Date(entry.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    const temperatures = data.map(entry => entry.main.temp);

    if (temperatureChart) {
        temperatureChart.data.labels = labels;
        temperatureChart.data.datasets[0].data = temperatures;
        temperatureChart.options.scales.y.title.text = `Temperature (°${currentUnit === 'metric' ? 'C' : 'F'})`;
        temperatureChart.update();
    } else {
        const ctx = document.getElementById('temperatureChart').getContext('2d');
        temperatureChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `Temperature (°${currentUnit === 'metric' ? 'C' : 'F'})`,
                    data: temperatures,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    x: { ticks: { color: 'white' } },
                    y: { 
                        beginAtZero: false, 
                        ticks: { color: 'white' },
                        title: {
                            display: true,
                            text: `Temperature (°${currentUnit === 'metric' ? 'C' : 'F'})`,
                            color: 'white'
                        }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
}

function updatePrecipitationChart(data) {
    const labels = data.map(entry => new Date(entry.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    const precipitationChance = data.map(entry => (entry.pop || 0) * 100);

    if (precipitationChart) {
        precipitationChart.data.labels = labels;
        
        precipitationChart.data.datasets[0].data = precipitationChance;
        precipitationChart.update();
    } else {
        const ctx = document.getElementById('precipitationChart').getContext('2d');
        precipitationChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Precipitation Chance (%)',
                    data: precipitationChance,
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgb(54, 162, 235)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: { 
                        beginAtZero: true, 
                        max: 100, 
                        ticks: { color: 'white' },
                        title: {
                            display: true,
                            text: 'Precipitation Chance (%)',
                            color: 'white'
                        }
                    },
                    x: { ticks: { color: 'white' } }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
}

function updateWindChart(data) {
    const labels = data.map(entry => new Date(entry.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    const windSpeeds = data.map(entry => entry.wind.speed);

    if (windChart) {
        windChart.data.labels = labels;
        windChart.data.datasets[0].data = windSpeeds;
        windChart.options.scales.y.title.text = `Wind Speed (${currentUnit === 'metric' ? 'm/s' : 'mph'})`;
        windChart.update();
    } else {
        const ctx = document.getElementById('windChart').getContext('2d');
        windChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `Wind Speed (${currentUnit === 'metric' ? 'm/s' : 'mph'})`,
                    data: windSpeeds,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    x: { ticks: { color: 'white' } },
                    y: { 
                        beginAtZero: true, 
                        ticks: { color: 'white' },
                        title: {
                            display: true,
                            text: `Wind Speed (${currentUnit === 'metric' ? 'm/s' : 'mph'})`,
                            color: 'white'
                        }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
}

function updateWeatherSummaryChart(forecastData) {
    const labels = ['Clear', 'Clouds', 'Rain', 'Snow', 'Other'];
    const data = [0, 0, 0, 0, 0]; 

    forecastData.forEach(entry => {
        const main = entry.weather[0].main;
        if (main === 'Clear') data[0]++;
        else if (main === 'Clouds') data[1]++;
        else if (main === 'Rain' || main === 'Drizzle') data[2]++;
        else if (main === 'Snow') data[3]++;
        else data[4]++;
    });

    if (weatherSummaryChart) {
        weatherSummaryChart.data.datasets[0].data = data;
        weatherSummaryChart.update();
    } else {
        const ctx = document.getElementById('weatherSummaryChart').getContext('2d');
        weatherSummaryChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: [
                        'rgba(255, 206, 86, 0.8)', // Clear
                        'rgba(75, 192, 192, 0.8)', // Clouds
                        'rgba(54, 162, 235, 0.8)', // Rain
                        'rgba(153, 102, 255, 0.8)', // Snow
                        'rgba(255, 99, 132, 0.8)'  // Other
                    ],
                    borderColor: [
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 99, 132, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: 'white'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Weather Summary',
                        color: 'white'
                    }
                },
                animation: {
                    animateRotate: true,
                    animateScale: true
                }
            }
        });
    }
}

function updateBackgroundColor(weatherCondition) {
    const body = document.body;
    const condition = weatherConditions[weatherCondition] || weatherConditions.Clear;
    body.className = `h-full bg-gradient-to-br ${condition.from} ${condition.to} transition-all duration-500`;
}

document.getElementById('citySearch').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        fetchWeatherData(this.value);
    }
});

document.getElementById('searchButton').addEventListener('click', function () {
    fetchWeatherData(document.getElementById('citySearch').value);
});

document.getElementById('unitToggle').addEventListener('click', function() {
    currentUnit = currentUnit === 'metric' ? 'imperial' : 'metric';
    this.textContent = `Switch to °${currentUnit === 'metric' ? 'F' : 'C'}`;
    fetchWeatherData(document.getElementById('cityName').textContent);
});

document.getElementById('forecastLink').addEventListener('click', function(e) {
    e.preventDefault();
    const city = document.getElementById('cityName').textContent;
    window.location.href = `forecast.html?city=${encodeURIComponent(city)}&unit=${currentUnit}`;
});

document.getElementById('geolocateButton').addEventListener('click', function() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
        }, function(error) {
            console.error("Error: ", error);
            alert("Unable to retrieve your location. Please search for a city manually.");
        });
    } else {
        alert("Geolocation is not supported by your browser. Please search for a city manually.");
    }
});

fetchWeatherData(DEFAULT_CITY);