
function transformAndGeocode(strSearch){
    // Reads in data file and finds latlong coordinates of cities using Google maps geocoder.
    d3.csv("data/RV028.csv",function(error,data) {

        // Filter and transform data
        data = data
            .filter(function (d) {
                return d.name.slice(0, 2) == "..";
            })
            .filter(function(d){
                return strSearch(d.name,"linn");
            })
            .filter(function(d){
                return !strSearch(d.name,"linnaosa")
            })
            .filter(function(d){
                return +d.population;
            })
            .map(function(d){
                d.name = d.name.split(" ")[0];
                d.name = d.name.split(".")[d.name.split(".").length-1];
                return d;
            });


        // Find coordinates using Google maps api
        var geocoder = new google.maps.Geocoder();

        function timeout(i) { // Loops through ~50 cities with 1 second intervals to avoid google maps API rps limits
            setTimeout(function () {
                if (i <= data.length - 1){
                    var town = data[i];
                    geocoder.geocode(
                        { address: town.name,
                         componentRestrictions: {country: 'Estonia'}
                        }, function(results, status) {
                            if (status == google.maps.GeocoderStatus.OK) {
                                console.log(i,town.name, JSON.stringify(results[0].geometry.location));
                                town.latlng = results[0].geometry.location;
                            } else {
                                console.log(i,town.name, "failed");
                            }
                        });
                    i++;
                    timeout(i);
                } else {
                    // Log json string to console in the end
                    // Copy paste to file
                    console.log(JSON.stringify(data));
                }
            }, 1000);
        }
        timeout(0);
    })
}
