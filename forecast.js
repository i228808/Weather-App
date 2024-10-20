
import {GoogleGenerativeAI} from "@google/generative-ai";

const API_KEY = API.OPENAPI;
const DEFAULT_CITY = 'Islamabad';
let currentPage = 1;
let totalPages = 1;
let forecastData = [];
let currentUnit = 'metric';

const weatherConditions = {
    Clear: { icon: '☀️' },
    Clouds: { icon: '☁️' },
    Rain: { icon: '🌧️' },
    Snow: { icon: '❄️' },
    Thunderstorm: { icon: '⛈️' },
    Drizzle: { icon: '🌦️' },
    Mist: { icon: '🌫️' }
};

const genAI = new GoogleGenerativeAI(API.GOOGLEAPI);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

function showSpinner() {
    document.getElementById('loadingSpinner').style.display = 'flex';
}

function hideSpinner() {
    document.getElementById('loadingSpinner').style.display = 'none';
}

async function fetchWeatherData(city) {
    showSpinner();
    try {
        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=${currentUnit}`);
        const data = await forecastResponse.json();
        if (data.cod === "404") {
            alert("City not found. Please try again.");
            return;
        }
        forecastData = data.list;
        totalPages = Math.ceil(forecastData.length / 8);
        currentPage = 1;
        updateForecastTable();
        updateBackgroundColor(data.list[0].weather[0].main);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert("An error occurred while fetching weather data. Please try again.");
    } finally {
        hideSpinner();
    }
}

async function fetchWeatherByCoords(lat, lon) {
    showSpinner();
    try {
        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${currentUnit}`);
        const data = await forecastResponse.json();
        forecastData = data.list;
        totalPages = Math.ceil(forecastData.length / 8);
        currentPage = 1;
        updateForecastTable();
        updateBackgroundColor(data.list[0].weather[0].main);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert("An error occurred while fetching weather data. Please try again.");
    } finally {
        hideSpinner();
    }
}

function updateForecastTable() {
    const tableContainer = document.getElementById('forecastTable');
    const startIndex = (currentPage - 1) * 8;
    const endIndex = startIndex + 8;
    const pageData = forecastData.slice(startIndex, endIndex);

    let tableHTML = `
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-white bg-opacity-20">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Date</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Temp</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Weather</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Wind</th>
                </tr>
            </thead>
            <tbody class="bg-white bg-opacity-10 divide-y divide-gray-200">
    `;

    pageData.forEach((entry, index) => {
        const date = new Date(entry.dt * 1000);
        const condition = weatherConditions[entry.weather[0].main] || weatherConditions.Clear;
        tableHTML += `
            <tr class="fade-in" style="animation-delay: ${index * 100}ms">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-white">${date.toLocaleString()}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-white">${Math.round(entry.main.temp)}°${currentUnit === 'metric' ? 'C' : 'F'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-white">
                    <span class="mr-2" aria-hidden="true">${condition.icon}</span>${entry.weather[0].description}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-white">${entry.wind.speed} ${currentUnit === 'metric' ? 'm/s' : 'mph'}</td>
            </tr>
        `;
    });

    tableHTML += `
            </tbody>
        </table>
    `;

    tableContainer.innerHTML = tableHTML;
    document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${totalPages}`;
}

async function sendMessage() {
    const message = document.getElementById('userMessage').value.toLowerCase();
    
    if (!message) return;

    const chatbox = document.getElementById('chatbox');
    const userMessage = document.createElement('div');
    userMessage.className = 'mb-2 text-right';
    userMessage.innerHTML = `<span class="inline-block bg-purple-500 text-white p-2 rounded-lg">${message}</span>`;
    chatbox.appendChild(userMessage);

    const botMessage = document.createElement('div');
    botMessage.className = 'mb-2';
    botMessage.innerHTML = '<span class="inline-block bg-white bg-opacity-20 text-white p-2 rounded-lg">Thinking...</span>';
    chatbox.appendChild(botMessage);

    // List of weather-related keywords
    const weatherKeywords = ['weather', 'forecast', 'rain', 'temperature', 'wind', 'cloud', 'clear', 'snow', 'thunderstorm', 'drizzle', 'mist'];

    const isWeatherRelated = weatherKeywords.some(keyword => message.includes(keyword));

    if (!isWeatherRelated) {
        botMessage.innerHTML = '<span class="inline-block bg-white bg-opacity-20 text-white p-2 rounded-lg">Please ask weather-related queries.</span>';
    } else {
        try {
            const result = await model.generateContent(message);
            const response = await result.response;
            const text = await response.text();
            botMessage.innerHTML = `<span class="inline-block bg-white bg-opacity-20 text-white p-2 rounded-lg">${text}</span>`;
        } catch (error) {
            console.error('Error:', error);
            botMessage.innerHTML = '<span class="inline-block bg-white bg-opacity-20 text-white p-2 rounded-lg">Sorry, I encountered an error while processing your request.</span>';
        }
    }

    document.getElementById('userMessage').value = '';
    chatbox.scrollTop = chatbox.scrollHeight;
}

function toggleUnit() {
    currentUnit = currentUnit === 'metric' ? 'imperial' : 'metric';
    document.getElementById('unitToggle').textContent = `Switch to °${currentUnit === 'metric' ? 'F' : 'C'}`;
    fetchWeatherData(document.getElementById('citySearch').value || DEFAULT_CITY);
}

function updateBackgroundColor(weatherCondition) {
    const body = document.body;
    const weatherConditions = {
        Clear: { from: 'from-yellow-300', to: 'to-blue-400' },
        Clouds: { from: 'from-gray-300', to: 'to-gray-500' },
        Rain: { from: 'from-blue-300', to: 'to-blue-500' },
        Snow: { from: 'from-blue-100', to: 'to-gray-300' },
        Thunderstorm: { from: 'from-gray-600', to: 'to-gray-800' },
        Drizzle: { from: 'from-blue-200', to: 'to-blue-400' },
        Mist: { from: 'from-gray-300', to: 'to-gray-400' }
    };
    const condition = weatherConditions[weatherCondition] || weatherConditions.Clear;
    body.className = `h-full bg-gradient-to-br  ${condition.from} ${condition.to} transition-all duration-500`;
}

document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        updateForecastTable();
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        updateForecastTable();
    }
});

document.getElementById('citySearch').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        fetchWeatherData(this.value);
    }
});

document.getElementById('searchButton').addEventListener('click', function() {
    fetchWeatherData(document.getElementById('citySearch').value);
});

document.getElementById('sendButton').addEventListener('click', sendMessage);

document.getElementById('unitToggle').addEventListener('click', toggleUnit);

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

// Initial fetch for default city
fetchWeatherData(DEFAULT_CITY);
