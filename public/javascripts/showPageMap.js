mapboxgl.accessToken = mapToken
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    zoom: 9,
    center: geocode
});

new mapboxgl.Marker()
    .setLngLat(geocode)
    .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<h3>${title}</h3>`))
    .addTo(map);