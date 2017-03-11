var map;
function initMap() {
    //transformAndGeocode();

    d3.json("data/cities.json",function(error,data){
        init(data);
    });

    function init(data) {
        var r = d3.scaleSqrt().domain([0,500000]).range([10,50]);

        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 58.7413549, lng: 24.9980244},
            minZoom: 7,
            zoom: 7
        });

        data.forEach(function(d){
            var dr = r(+d.population);
            var image = {
                url: 'data:image/svg+xml;utf-8, \
                <svg width="20" height="20" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"> \
                <circle fill="red" r="10" cx="10" cy="10"></circle> \
                </svg>',
                size: new google.maps.Size(dr, dr),
                anchor: new google.maps.Point(dr/2, dr/2),
                scaledSize: new google.maps.Size(dr, dr)
            };

            new google.maps.Marker({
                position: d.latlng,
                map: map,
                title: d.name,
              //  icon: image
            });
        })


    }

}