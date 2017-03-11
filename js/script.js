var map;
function initMap() {
    //transformAndGeocode();

    d3.json("data/cities.json",function(error,data){
        init(data);
    });

    function init(data) {

        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 58.7413549, lng: 24.9980244},
            minZoom: 7,
            zoom: 7
        });

        data.forEach(function(d){

        });

        var Place = function(data){
            this.name = ko.observable(data.name);
            this.latlng = ko.observable(data.latlng);
            this.population = ko.observable(data.population);
        };

        var ViewModel = function(data){
            var self = this;
            this.placeList = ko.observableArray([]);
            data.forEach(function(d){
                self.placeList.push(new Place(d))
            });

            this.markers = data.map(function(d,i){
                return new google.maps.Marker({
                    position: d.latlng,
                    map: map,
                    title: d.name,
                    id: i
                });
            });

            this.filterMarkers = function(inputStr){
                self.markers.forEach(function(m){
                    m.setMap(m.title.indexOf(inputStr) == -1 ? null : map);
                })
            };

            this.listClick = function(){
                self.filterMarkers(this.name());
            };
        };

        ko.applyBindings(new ViewModel(data));
    }

}