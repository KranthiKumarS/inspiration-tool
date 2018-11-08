var map;
var marker1, marker2, poly, geodesicPoly, isFirstTime=true;

function getInfoSVG(params) {
    return `<svg id="Ebene_1" data-name="Ebene 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 65 59">
    <defs>
        <style>
            .cls-1 {
                fill: #313c45;
            }

            .cls-2 {
                fill: #2e97de;
            }

            .small {
                font: 10px;
                fill:#ffffff;
                text-anchor: middle;
            }
        </style>
    </defs>
    <title>icon_destination_BG</title>
    <rect class="cls-1" width="65" height="25" />
    <rect class="cls-2" y="25" width="65" height="25" />
    <polygon class="cls-2" points="40 50 32.06 59 24 50 40 50" />
    <text x="50%" y="17" class="small">`+ params.destination.code + `</text>
    <text x="50%" y="42" class="small">`+ params.totalPrice + ` $</text>
    </svg>`;
}

function getMiniInfoSVG(params) {
    return `<svg id="Ebene_1" data-name="Ebene 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><defs><style>.cls-1{fill:#2e97de;}.cls-2{fill:#fff;}</style></defs><title>Icon_others</title><circle class="cls-1" cx="5" cy="5" r="4.5"/><path class="cls-2" d="M5,1A4,4,0,1,1,1,5,4,4,0,0,1,5,1M5,0a5,5,0,1,0,5,5A5,5,0,0,0,5,0Z"/></svg>`;
}

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 6
    });

    // Ditect Current Location
    ditectCurrentLocation();

    // Service Call to load json locations
    httpServiceCall();

    //getRouteMap();
}
var currlat;
var currlng;
// getting current location
function ditectCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                var icon = {
                    url: "images/my_pointer.svg", // url
                    scaledSize: new google.maps.Size(40, 50), // scaled size
                    origin: new google.maps.Point(0, 0), // origin
                    anchor: new google.maps.Point(20, 42) // anchor
                };

                currlat = position.coords.latitude;
                currlng = position.coords.longitude;
                // currlat = 50.4729;
                // currlng = 7.8569;

                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                // pos = {lat: 17.4480704, lng: 78.37123059999999}
                // var pos = {lat: 50.4729, lng: 7.8569}
                new google.maps.Marker({
                    //position: map.getCenter(),
                    position: pos,
                    icon: icon,
                    map: map
                });
                
                map.setCenter(pos);
            },

            function (e) {
                console.log(e);
                handleLocationError(true, infoWindow, map.getCenter());
            }
        );
    } else {
        console.log("GET USER STREET, Pincode...");
        //handleLocationError(false, infoWindow, map.getCenter());
    }

}

function httpServiceCall() {
    $.ajax({
        url: "locations.json",
        dataType: "json",
        success: function (data) {
            $.each(data, function (key, data) {
                console.log(key, data);

                // to load all points
                loadAllPinPoints(key, data);
            });
        }
    });
    /*$.post("demo_test_post.asp",
    {
        lanT: currlng,
        latT: currlat
    },
    function(data, status){
        $.each(data, function (key, data) {
            console.log(key, data);

            // to load all points
            loadAllPinPoints(key, data);
        });
    });*/
}

function loadAllPinPoints(key, data) {
    var mylatlng = new google.maps.LatLng(
        data.origin.latitude,
        data.origin.longitude
    );

    if (key < 10) {
        var icon = {
            url: 'data:image/svg+xml;utf-8, ' + getInfoSVG(data),
            scaledSize: new google.maps.Size(100, 80), // scaled size
            origin: new google.maps.Point(0, 0), // origin
            anchor: new google.maps.Point(50, 80) // anchor
        };
    } else {
        var icon = {
            url: 'data:image/svg+xml;utf-8, ' + getMiniInfoSVG(data), // url
            scaledSize: new google.maps.Size(12, 12), // scaled size
            origin: new google.maps.Point(0, 0), // origin
            anchor: new google.maps.Point(0, 0) // anchor
        };
    }


    var marker = new google.maps.Marker({
        position: mylatlng,
        scaledSize: new google.maps.Size(12, 12),
        map: map,
        icon: icon
    });


    var infoDetailsPopup =
        `<div class="infoBubbleDetail">
            <div id="fromlocation">` +
                data.origin.code +
                `</div>
                    <div id="tolocation">` +
                data.destination.code +
                `</div>
                    <div id="fromtodate">` +
                dateStyling(data.departureDate) +
                `</div>
                    <div id="fromtodate">` +
                dateStyling(data.returnDate) +
                `</div>
                    <div id="totalprice">` +
                data.totalPrice +
                ` € </div> 
                    <div id="airlines"><img src="` +
                data.airline +
                `">
                    <div id="airlinescode">` +
                data.airlineCode +
            `</div>
            </div>                                       
        </div>`;


    infoDetailsBubble = new InfoBubble({
        map: map,
        position: new google.maps.LatLng(
            data.origin.latitude,
            data.origin.longitude
        ),
        shadowStyle: 0,
        padding: 0,
        backgroundColor: "transparent",
        borderRadius: 0,
        arrowSize: 0,
        borderWidth: 0,
        disableAutoPan: true,
        hideCloseButton: true,
        arrowSize: 0,
        pixelOffset: new google.maps.Size(130, 120),
        arrowPosition: 32,
        arrowStyle: 0
    });

    $(infoDetailsBubble.bubble_).on("click", ".infoBubbleDetail", function (e) {
        console.log("LOAD Page....");
    });

    // MOUSE HOVER START HERE

    if (key >= 30) {
        google.maps.event.addListener(marker, "mouseover", function () {
            //infoBubble.close();
            infoBubble.setContent(infoPopup);
            infoBubble.open(map, this);

        });
    } else {
        google.maps.event.addListener(marker, "mouseover", function () {
            //infoBubble.close();
            infoDetailsBubble.setContent(infoDetailsPopup);
            infoDetailsBubble.open(map, this);


        });
        google.maps.event.addListener(marker, "click", function (event) {

            var latitude = event.latLng.lat();
            var longitude = event.latLng.lng();

            marker1 = new google.maps.Marker({
                map: map,
                draggable: true,
                position: { lat: currlat, lng: currlng }
            });

            marker2 = new google.maps.Marker({
                map: map,
                draggable: true,
                position: { lat: latitude, lng: longitude }
            });

            google.maps.event.addListener(marker1, 'position_changed', update);
            google.maps.event.addListener(marker2, 'position_changed', update);

            if(isFirstTime == true) {
                poly = new google.maps.Polyline({
                    strokeColor: '#d6d6d6',
                    strokeOpacity: 1.0,
                    strokeWeight: 3,
                    map: map,
                });
    
                geodesicPoly = new google.maps.Polyline({
                    strokeColor: '#313c45',
                    strokeOpacity: 1.0,
                    strokeWeight: 3,
                    geodesic: true,
                    map: map
                });
                
                isFirstTime = false;
            }            

            update();

        });
    }

    google.maps.event.addListener(marker, "click", function () {
    console.log("....MAP....");
    });
    // MOUSE HOVER END HERE

    marker.setMap(map);
}
function update() {
    marker1.setVisible(false); // maps API hide call
    marker2.setVisible(false); // maps API hide call
    var path = [marker1.getPosition(), marker2.getPosition()];
    poly.setPath(path);
    geodesicPoly.setPath(path);
}

// Location ditect Error Handling
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
        browserHasGeolocation
            ? "Error: The Geolocation service failed."
            : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
}

// Libs
function month_name(dt) {
    mlist = [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC"
    ];
    return mlist[dt];
}

function dateStyling(params) {
    // console.log(params);
    var date = params.split("/");
    return date[0] + "<small> " + month_name(date[1]) + "</small>";
}