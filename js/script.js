var map;
function initMap() {
    //transformAndGeocode();
    d3.json("udacity_google_maps/data/cities.json",function(error,data){
        data.forEach(function(d){
            d.name = d.name.split(" ")[0];
        });
        init(data);
    });

    function init(data) {

        var largeInfowindow = new google.maps.InfoWindow({
            maxWidth: 200
        });

        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 58.7413549, lng: 24.9980244},
            minZoom: 6,
            zoom: 7
        });

        var Place = function(data){ // Class for towns and cities.
            this.name = ko.observable(data.name);
            this.latlng = ko.observable(data.latlng);
            this.population = ko.observable(data.population);
        };

        var ViewModel = function(data){
            var self = this;
            this.searchBox = document.getElementById("place-search");
            this.placeList = ko.observableArray([]);

            this.markers = data.map(function(d){
                var marker = new google.maps.Marker({
                    position: d.latlng,
                    map: map,
                    animation: google.maps.Animation.DROP,
                    title: d.name,
                    icon: makeMarkerIcon(populationScale(d.population)),
                    data: d
                });
                marker.addListener('click', function(){
                    toggleInfowindow(this,largeInfowindow);
                });
                return marker;
            });

            this.filterMarkers = function(inputStr){
                // Hide markers that do not match with the given search string
                self.markers.forEach(function(m){
                    m.setMap( strSearch(m.title,inputStr) ? map : null);
                });

                // Remove places from list (ko.observableArray)
                self.placeList.remove(function(item){
                    return !strSearch(item.name(),inputStr);
                });

                // Add names back to 'self.placeList' if they have started to match the search string again
                self.pushMissingListItems(inputStr);
            };

            this.pushMissingListItems = function(searchString){
                // Add places that matches the search string to 'self.placeList'
                searchString = searchString == undefined ? "" : searchString;
                var activePlaceNames = self.placeList().map(function(d){return d.name()});
                data.forEach(function(d){
                    // Add place to the list if it matches the search string and is not already there
                    if (strSearch(d.name,searchString) && activePlaceNames.indexOf(d.name) == -1)
                        self.placeList.push(new Place(d))
                });
            };

            this.listClick = function(){
                var name = this.name();
                var marker = self.markers.filter(function(d){
                    return d.title == name;
                })[0];
                toggleInfowindow(marker,largeInfowindow);
            };

            this.searchBox.onkeypress = function(e){
                // http://stackoverflow.com/questions/585396/how-to-prevent-enter-keypress-to-submit-a-web-form
                 e = e || event;
                 var txtArea = /textarea/i.test((e.target || e.srcElement).tagName);
                 return txtArea || (e.keyCode || e.which || e.charCode || 0) !== 13;
            };

            this.searchBox.addEventListener("keyup",function(e){
                self.filterMarkers(this.value);
            });

            var sidebar = document.getElementsByClassName("sidebar")[0];
            var menuIcon = document.getElementById("sidebar-toggle");

            menuIcon.addEventListener("click",function(e){
                sidebar.classList.toggle("visible-sidebar");
                e.stopPropagation();
            });

            self.pushMissingListItems();

            drawLegend()
        };

        ko.applyBindings(new ViewModel(data));
    }

    function drawLegend(){
        var svg = d3.select("#legend");
        var width = 160;
        var height = 20;

        // Scale that matches population values to relative distance from start of the legend rectangle.
        var legendScale = d3.scaleLinear()
            .domain([1,2,4,8,16,32,64,128,256,512])
            .range(d3.range(0,1,0.11));

        svg.append("text").text("Population (x1000)")
            .attr("y",12);

        svg.append("defs") // Genereate linear gradient
            .append("linearGradient")
            .attr("id", "fillGrad")
            .attr("x1", "0%").attr("y1", "0%")
            .attr("x2", "100%").attr("y2", "0%")
            .each(function (grad_data) {
                var linearGradient = d3.select(this);
                linearGradient.selectAll("stop").data(legendScale.domain())
                    .enter().append("stop")
                    .attr("offset",function(d,i){
                        return i/legendScale.domain().length*100 + "%";
                    })
                    .attr("stop-color",function(d){
                        return "#" + populationScale(d*1000);
                    });
            });

        svg.append("rect")
            .attr("width",width)
            .attr("fill","url(#fillGrad)")
            .attr("y",21)
            .attr("height",20);

        svg.selectAll(".tick").data([1,10,100,500]).enter()
            .append("g").attr("class","tick")
            .attr("transform",function(d,i){
                return "translate(" + legendScale(d)*width + ",60)";
            })
            .append("text")
            .attr("text-anchor",function(d){return d==1 ? "start" : "middle"})
            .text(function(d){return d});
    }

    function strSearch(longer, shorter){
        // Return true if shorter is contained in the longer
        return longer.toLowerCase().indexOf(shorter.toLowerCase()) > -1;
    }

    function toggleInfowindow(marker,infowindow){
        // 'infowindow.marker' is the currently active marker
        
        if (infowindow.marker != marker){ // A new marker is clicked
            if (infowindow.marker) infowindow.marker.setAnimation(null); // stop bouncing of the previously active one
            infowindow.marker = marker;
            infowindow.setContent("");
            infowindow.open(map, marker);
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick',function(){
                infowindow.marker = null;
                marker.setAnimation(null);
            });
            wikiRequest(marker,infowindow);
            marker.setAnimation(google.maps.Animation.BOUNCE);
        } else { // currently active marker is clicked
            infowindow.marker = null;
            infowindow.close();
            marker.setAnimation(null);
        }
    }

    function populationScale(population){
        // return hex color (w.o '#' in the beginning that corresponds to given population value
        var scale = d3.scaleLinear()
            .range([0,0.1,0.375,0.75,0.95])
            .domain([800,2000,10000,100000,420000]);
        var color = d3.color(d3.interpolateReds(scale(population)));
        return rgbToHex(color.r,color.g,color.b).slice(1);
    }

    function componentToHex(c) {
        // From http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    function rgbToHex(r, g, b) {
        // From http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    function makeMarkerIcon(markerColor) {
        // From Udacity Google Maps API course
        return new google.maps.MarkerImage(
          'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
          '|40|_|%E2%80%A2',
          new google.maps.Size(21, 34),
          new google.maps.Point(0, 0),
          new google.maps.Point(10, 34),
          new google.maps.Size(21,34));
    }

    function wikiRequest(marker,infowindow){
        $(document).ready(function(){
            $.ajax({
                type: "GET",
                url: "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles="+marker.title+"&callback=?",
                contentType: "application/json; charset=utf-8",
                async: false,
                dataType: "json",
                success: function (data, textStatus, jqXHR) {
                    if (textStatus == "success" && data.query){
                        var page = data.query.pages;
                        if (page && page[Object.keys(page)[0]]){
                            var wikiExtract = page[Object.keys(page)[0]].extract;
                            infowindow.setContent('<h3>'+marker.title+'</h3>' +
                                '<div class="population-value"><i class="fa fa-male" aria-hidden="true"></i> '+marker.data.population+'</div> '+
                                '<div class="wiki-header"><i>Description from Wikipedia</i></div>'+
                                '<div id="windowText">'+wikiExtract+'</div>')
                        } else {
                            setContentToError();
                        }
                    } else {
                        setContentToError();
                    }
                },
                error: function (errorMessage) {
                    setContentToError();
                }
            });
            function setContentToError(){
                var errorMessage = "There was a probel with the wikipedia request";
                infowindow.setContent('<div>'+errorMessage+'</div>');
            }
        });
    }
}