var map;
function initMap() {
    //transformAndGeocode();

    d3.json("data/cities.json",function(error,data){
        data.forEach(function(d){
            d.name = d.name.split(" ")[0];
        });
        init(data);
    });

    function init(data) {

        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 58.7413549, lng: 24.9980244},
            minZoom: 7,
            zoom: 7
        });

        var Place = function(data){
            this.name = ko.observable(data.name);
            this.latlng = ko.observable(data.latlng);
            this.population = ko.observable(data.population);
        };

        var ViewModel = function(data){
            var self = this;
            this.searchBox = document.getElementById("place-search");
            this.placeList = ko.observableArray([]);

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
                    m.setMap( strSearch(m.title,inputStr) ? map : null);
                });
                self.placeList.remove(function(item){
                    return item.name().toLowerCase().indexOf(inputStr.toLowerCase()) == -1;
                });
                self.pushMissingListItems(inputStr);
            };

            this.pushMissingListItems = function(searchString){
                searchString = searchString == undefined ? "" : searchString;
                var activePlaceNames = self.placeList().map(function(d){return d.name()});
                data.forEach(function(d){
                    if (strSearch(d.name,searchString) && activePlaceNames.indexOf(d.name) == -1)
                        self.placeList.push(new Place(d))
                });
            };

            this.listClick = function(){
                self.filterMarkers(this.name());
            };

            this.searchBox.addEventListener("keyup",function(e){
                self.filterMarkers(this.value);
            });

            self.pushMissingListItems();
        };

        ko.applyBindings(new ViewModel(data));
    }

    function strSearch(longer, shorter){
        return longer.toLowerCase().indexOf(shorter.toLowerCase()) > -1;
    }

}