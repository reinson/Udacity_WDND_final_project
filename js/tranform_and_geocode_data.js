
function transformAndGeocode(){
    d3.csv("data/RV028.csv",function(error,data) {
        data = data.filter(function (d) {
            return d.name.slice(0, 2) == "..";
        });
        data.forEach(function (d) {
            d.name = d.name.slice(2).split("(")[0];
        });


        var geocoder = new google.maps.Geocoder();

        function timeout(i) {
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
                    console.log(JSON.stringify(data));
                }
            }, 1000);
        }
        timeout(0);
    })
}
