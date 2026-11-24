const day = document.querySelector("#day");

if (day) {
    // Show sample hours for the selected day group.
    day.addEventListener("change", function () {
        const weekend = day.value === "weekend";
        document.querySelector("#dining-hours").textContent =
            weekend ? "10:00 AM–7:00 PM" : "7:30 AM–8:00 PM";
        document.querySelector("#westover-hours").textContent =
            weekend ? "12:00 PM–6:00 PM" : "11:00 AM–9:00 PM";
    });
}

const weather = document.querySelector("#weather");
const alerts = document.querySelector("#alerts");
const refresh = document.querySelector("#refresh");

// Get current temperature and wind for Lynchburg from Open-Meteo.
async function loadWeather() {
    refresh.disabled = true;
    weather.textContent = "Loading weather…";
    try {
        const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=37.40&longitude=-79.18&current=temperature_2m,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph");
        if (!response.ok) {
            throw new Error("Weather request failed");
        }

        const data = await response.json();
        weather.textContent = data.current.temperature_2m + " °F · Wind " +
            data.current.wind_speed_10m + " mph";
    } catch {
        weather.textContent = "Weather is unavailable right now. Try refreshing.";
    } finally {
        refresh.disabled = false;
    }
}

// Check active alerts from the National Weather Service.
async function loadAlerts() {
    try {
        const response = await fetch("https://api.weather.gov/alerts/active?point=37.40,-79.18");
        if (!response.ok) {
            throw new Error("Alert request failed");
        }

        const data = await response.json();
        alerts.textContent = data.features.map(function (alert) {
            return alert.properties.event;
        }).join(", ") || "No active alerts.";
    } catch {
        alerts.textContent = "Weather alerts are unavailable right now.";
    }
}

if (weather) {
    refresh.addEventListener("click", function () {
        loadWeather();
        loadAlerts();
    });

    loadWeather();
    loadAlerts();
}
