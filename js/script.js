var map;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
	  center: {lat: 58.7413549, lng: 24.9980244},
	  zoom: 7
	});
}