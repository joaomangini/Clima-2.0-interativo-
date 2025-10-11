
// --- CONFIGURAÇÕES DA API ---
const apiKey ="7d3c2ca7bd1e4eb3962220908250410"; 
const days = 7; // Reduzi para 7 dias, fica melhor no mobile

// --- ELEMENTOS DO HTML ---
const cityInput = document.getElementById("city-input");
const searchButton = document.getElementById("search-btn");
const cityDisplay = document.querySelector(".city-display"); // Novo elemento para o nome da cidade
const tempDisplay = document.querySelector(".temp");
const humidityDisplay = document.querySelector(".humidity");
const windDisplay = document.querySelector(".wind");
const weatherIcon = document.querySelector(".weather-icon");
const forecastContainer = document.querySelector(".forecast-container");

// --- FUNÇÃO PRINCIPAL PARA BUSCAR O CLIMA ---
async function getWeather(city) {
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=${days}&aqi=no&alerts=no&lang=pt`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Cidade não encontrada.");
        
        const data = await response.json();
        const forecastData = data.forecast.forecastday.map(day => ({
            date: new Date(day.date_epoch * 1000).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
            minTemp: day.day.mintemp_c,
            maxTemp: day.day.maxtemp_c,
            humidity: day.day.avghumidity,
            wind: day.day.maxwind_kph,
            icon: 'https:' + day.day.condition.icon,
            conditionText: day.day.condition.text
        }));

        displayForecast(forecastData, data.location.name);
        updateMainDisplay(0, forecastData, data.location.name);

    } catch (error) {
        alert(error.message);
    }
}

// --- FUNÇÕES DE EXIBIÇÃO ---
function updateMainDisplay(index, forecastData, cityName) {
    const day = forecastData[index];
    cityDisplay.textContent = cityName;
    tempDisplay.textContent = Math.round(day.maxTemp) + "°C";
    humidityDisplay.textContent = day.humidity + "%";
    windDisplay.textContent = Math.round(day.wind) + " km/h";
    weatherIcon.src = day.icon;
    weatherIcon.alt = day.conditionText;

    document.querySelectorAll('.forecast-day').forEach(dayElement => dayElement.classList.remove('active'));
    document.querySelectorAll('.forecast-day')[index]?.classList.add('active');
}

function displayForecast(forecastData, cityName) {
    forecastContainer.innerHTML = "";
    forecastData.forEach((day, index) => {
        const dayDiv = document.createElement("div");
        dayDiv.classList.add("forecast-day");
        dayDiv.innerHTML = `
            <p class="day-date">${day.date}</p>
            <img src="${day.icon}" alt="${day.conditionText}">
            <p class="day-temp"><strong>${Math.round(day.maxTemp)}°</strong></p>
            <p class="day-temp">${Math.round(day.minTemp)}°</p>`;
        dayDiv.addEventListener('click', () => updateMainDisplay(index, forecastData, cityName));
        forecastContainer.appendChild(dayDiv);
    });
}

// --- EVENTOS DE BUSCA ---
const handleSearch = () => {
    if (cityInput.value) {
        getWeather(cityInput.value);
    }
};

searchButton.addEventListener("click", handleSearch);
cityInput.addEventListener("keyup", (e) => e.key === "Enter" && handleSearch());

// --- INICIALIZAÇÃO ---
window.addEventListener("load", () => getWeather("Brasilia"));
