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

    const avgSpeed = (data.reduce((sum, t) => sum + t.speed_kmh, 0) / data.length).toFixed(1);
    const avgDuration = (data.reduce((sum, t) => sum + t.duration_minutes, 0) / data.length).toFixed(1);
    const avgDistance = (data.reduce((sum, t) => sum + t.distance_km, 0) / data.length).toFixed(1);

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
        .sort((a, b) => b.duration_minutes - a.duration_minutes)
        .slice(0, 5);

    longestTrips.forEach(trip => {
        const row = `
            <tr>
                <td>${trip.id}</td>
                <td>${trip.duration_minutes.toFixed(1)}</td>
                <td>${trip.distance_km.toFixed(2)}</td>
                <td>${trip.speed_kmh.toFixed(1)}</td>
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
});

document.getElementById("exportCsvBtn").addEventListener("click", () => {
    const filteredTrips = applyFilters();
    downloadCSV(filteredTrips);
});

fetchTrips();
