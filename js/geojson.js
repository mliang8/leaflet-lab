//Mengyu Liang Lab 4


/*initialize a map with an initial center location and zoom levels*/
function createMap(){
    var map=L.map('mapid',{
    center:[20,0],
    zoom:2
});
//add tile style from the open source website to the map 
    L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
        //maxZoom: 18,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
//call the getData function to load data into the map
    getData(map);
};
// a function created to load data from MegaCities to the map
function getData(map){
    $.ajax('data/MegaCities.geojson',{
        dataType:'json',
        success: function (response){
            L.geoJson(response).addTo(map);
        }
    });
};
//craete the map by calling the inital function when the data is loaded
$(document).ready(createMap);
//using ajax go load the data 
$.ajax("data/MegaCities.geojson", {
        dataType: "json",
        success: function(response){
            //create marker options after the data is loaded
            var geojsonMarkerOptions = {
                radius: 8,
                fillColor: "#ff7800",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };

            //create a Leaflet GeoJSON layer and add it to the map
            L.geoJson(response, {
                pointToLayer: function (feature, latlng){
                    return L.circleMarker(latlng, geojsonMarkerOptions);
                }
            }).addTo(map);
        }
    });
//create a function to add the attribute information to the marker
function onEachFeature(feature, layer) {
    //no property named popupContent; instead, create html string with all properties
    var popupContent = "";
    if (feature.properties) {
        //loop to add feature property names and values to html string
        for (var property in feature.properties){
            popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
        }
        //bing the attribute information to the marker
        layer.bindPopup(popupContent);
    };
};

//function to retrieve the data and place it on the map
function getData(map){
    //load the data with ajax
    $.ajax("data/MegaCities.geojson", {
        dataType: "json",
        success: function(response){
            //create a Leaflet GeoJSON layer and add it to the map
            L.geoJson(response, {
                onEachFeature: onEachFeature
            }).addTo(map);
        }
    });
};
//load the data with ajax
 $.ajax("data/MegaCities.geojson", {
        dataType: "json",
        success: function(response){
            //create a Leaflet GeoJSON layer and add it to the map
            L.geoJson(response, {
                //use filter function to only show cities with 2015 populations greater than 20 million
                filter: function(feature, layer) {
                    return feature.properties.Pop_2015 > 20;
                }
            }).addTo(map);
        }
    });

