let allTrips = [];

async function fetchTrips() {
    try {
        const response = await fetch("http://127.0.0.1:5000/trips/sample");
        allTrips = await response.json();
        renderDashboard(allTrips);
    } catch (error) {
        console.error("Failed to fetch trips:", error);
    }
}

function applyFilters() {
    const vendor = document.getElementById("vendorSelect").value;
    const passengers = document.getElementById("passengerSelect").value;
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    return allTrips.filter(trip => {

        if (vendor !== "all" && trip.vendor_id != vendor) return false;

        if (passengers !== "all") {
            if (passengers === "6" && trip.passenger_count < 6) return false;
            if (passengers !== "6" && trip.passenger_count != passengers) return false;
        }

        if (startDate && new Date(trip.pickup_datetime) < new Date(startDate)) return false;
        if (endDate && new Date(trip.pickup_datetime) > new Date(endDate)) return false;

        return true;
    });
}

function renderDashboard(data) {
    updateSummaryMetrics(data);
    renderSpeedChart(data);
    renderDurationChart(data);
    renderSpeedDistanceChart(data);
    renderLongestTrips(data);
}

function updateSummaryMetrics(data) {
    document.getElementById("metricTotalTrips").innerText = data.length;

    if (data.length === 0) {
        document.getElementById("metricAvgSpeed").innerText = 0;
        document.getElementById("metricAvgDuration").innerText = 0;
        document.getElementById("metricAvgDistance").innerText = 0;
        return;
    }

    const avgSpeed = (data.reduce((sum, t) => sum + (t.trip_speed_mph || t.speed_kmh || 0), 0) / data.length).toFixed(1);
    const avgDuration = (data.reduce((sum, t) => sum + (t.trip_duration_minutes || t.duration_minutes || 0), 0) / data.length).toFixed(1);
    const avgDistance = (data.reduce((sum, t) => sum + (t.trip_distance || t.distance_km || 0), 0) / data.length).toFixed(1);

    document.getElementById("metricAvgSpeed").innerText = avgSpeed;
    document.getElementById("metricAvgDuration").innerText = avgDuration;
    document.getElementById("metricAvgDistance").innerText = avgDistance;
}

function renderLongestTrips(data) {
    const tableBody = document.querySelector("#longestTripsTable tbody");
    const emptyMessage = document.getElementById("emptyStateMessage");

    tableBody.innerHTML = "";

    if (data.length === 0) {
        emptyMessage.style.display = "block";
        return;
    }

    emptyMessage.style.display = "none";

    const longestTrips = [...data]
        .sort((a, b) => (b.trip_duration_minutes || b.duration_minutes || 0) - (a.trip_duration_minutes || a.duration_minutes || 0))
        .slice(0, 5);

    longestTrips.forEach(trip => {
        const duration = (trip.trip_duration_minutes || trip.duration_minutes || 0).toFixed(1);
        const distance = (trip.trip_distance || trip.distance_km || 0).toFixed(2);
        const speed = (trip.trip_speed_mph || trip.speed_kmh || 0).toFixed(1);
        const row = `
            <tr>
                <td>${trip.id}</td>
                <td>${duration}</td>
                <td>${distance}</td>
                <td>${speed}</td>
                <td>${trip.passenger_count}</td>
                <td>${trip.vendor_id}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

document.getElementById("applyFiltersBtn").addEventListener("click", () => {
    const filteredTrips = applyFilters();
    renderDashboard(filteredTrips);
    renderExtraCharts(filteredTrips);
});

document.getElementById("exportCsvBtn").addEventListener("click", () => {
    const filteredTrips = applyFilters();
    downloadCSV(filteredTrips);
});
const API_BASE = 'http://127.0.0.1:5000';

let zonesMap = {};

async function fetchZones() {
    try {
        const res = await fetch(`${API_BASE}/api/zones/`);
        const data = await res.json();
        if (data.zones) {
            data.zones.forEach(z => {
                zonesMap[z.location_id] = z;
            });
        }
    } catch (err) {
        console.warn('Could not fetch zones:', err);
    }
}

function renderExtraCharts(data) {
    renderBoroughChart(data, zonesMap);
    renderPaymentChart(data);
    renderHourlyChart(data);
    renderFareDistanceChart(data);
    renderHeatmap(data);
}

async function initDashboard() {
    try {
        await fetchZones();

        const res = await fetch(`${API_BASE}/api/trips/?per_page=1000`);
        const data = await res.json();

        if (data.trips && data.trips.length > 0) {
            allTrips = data.trips;
            renderDashboard(allTrips);
            renderExtraCharts(allTrips);
            return;
        }
    } catch (err) {
        console.warn('API fetch failed, trying original endpoint:', err);
    }

    fetchTrips();
}

initDashboard();