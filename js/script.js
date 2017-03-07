var map;
function initMap() {
    transformAndGeocode();
    
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 58.7413549, lng: 24.9980244},
        minZoom: 7,
        zoom: 7
    });
}