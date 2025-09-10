// Initialize map
const map = L.map('map').setView([28.6507, 77.3152], 13);

// OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Custom bus icons
const busIcons = {
  running: L.icon({
    iconUrl: 'https://raw.githubusercontent.com/cristia-bou/assets/main/bus-green.png',
    iconSize: [50, 50],
    iconAnchor: [25, 25],
    popupAnchor: [0, -25]
  }),
  delayed: L.icon({
    iconUrl: 'https://raw.githubusercontent.com/cristia-bou/assets/main/bus-yellow.png',
    iconSize: [50, 50],
    iconAnchor: [25, 25],
    popupAnchor: [0, -25]
  }),
  stopped: L.icon({
    iconUrl: 'https://raw.githubusercontent.com/cristia-bou/assets/main/bus-red.png',
    iconSize: [50, 50],
    iconAnchor: [25, 25],
    popupAnchor: [0, -25]
  })
};

// Dummy bus data
const buses = [
  { id: 1, number: "UP32 AB 1234", route: "Vaishali ↔ Ghaziabad", lat: 28.6507, lng: 77.3152, status: "running", speed: "40 km/h" },
  { id: 2, number: "UP32 CD 5678", route: "Ghaziabad ↔ Noida", lat: 28.662, lng: 77.32, status: "delayed", speed: "20 km/h" },
  { id: 3, number: "UP32 EF 9012", route: "Vaishali ↔ Anand Vihar", lat: 28.64, lng: 77.31, status: "stopped", speed: "0 km/h" }
];

const busMarkers = {};

// Add buses to map
buses.forEach(bus => {
  const marker = L.marker([bus.lat, bus.lng], { icon: busIcons[bus.status], rotationAngle: 0 })
    .addTo(map)
    .bindPopup(`<b>Bus:</b> ${bus.number}<br><b>Route:</b> ${bus.route}<br><b>Status:</b> ${bus.status}<br><b>Speed:</b> ${bus.speed}`);

  busMarkers[bus.id] = marker;
});

// Sidebar bus list
const busSelect = document.getElementById("bus-select");
const busDetails = document.getElementById("bus-details");

buses.forEach(bus => {
  const option = document.createElement("option");
  option.value = bus.id;
  option.textContent = `Bus ${bus.number}`;
  busSelect.appendChild(option);

  const card = document.createElement("div");
  card.className = `bus-card ${bus.status}`;
  card.innerHTML = `
    <h2>${bus.number}</h2>
    <p><b>Route:</b> ${bus.route}</p>
    <p><b>Status:</b> ${bus.status}</p>
    <p><b>Speed:</b> ${bus.speed}</p>
  `;
  busDetails.appendChild(card);
});

// Select bus → zoom map
busSelect.addEventListener("change", (e) => {
  const busId = e.target.value;
  if (busId && busMarkers[busId]) {
    map.setView(busMarkers[busId].getLatLng(), 15);
    busMarkers[busId].openPopup();
  }
});

// Function to move running buses
function animateBuses() {
  buses.forEach(bus => {
    if (bus.status === "running") {
      // Random move simulation
      bus.lat += (Math.random() - 0.5) * 0.001;
      bus.lng += (Math.random() - 0.5) * 0.001;

      // Update marker
      const marker = busMarkers[bus.id];
      if (marker) {
        marker.setLatLng([bus.lat, bus.lng]);

        // Random direction (rotation)
        const rotation = Math.floor(Math.random() * 360);
        marker.setRotationAngle(rotation);
      }
    }
  });
}

// Animate every 2 seconds
setInterval(animateBuses, 2000);
