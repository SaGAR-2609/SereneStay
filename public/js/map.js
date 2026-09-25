import fetch from "node-fetch"

const mapOptions = {
    center : [27.1936 , 77.9013],
    zoom: 15
}

// let map = new L.map('map' , mapOptions);
// let layer = new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
// map.addLayer(layer);


async function geocode(location) {
    const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
    );
    const data = await res.json();
    if (data.length > 0) {
        return { lat: data[0].lat, lon: data[0].lon };
    }
    return null;
}

console.log(listingLocation);

(async () => {
    const coords = await geocode(listingLocation);
    if (!coords) return;
    
    const map = L.map("map").setView([coords.lat, coords.lon], 14);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
    
    L.marker([coords.lat, coords.lon]).addTo(map);
})();
