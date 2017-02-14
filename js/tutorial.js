//Mengyu Liang Lab 4
//Leaflet Quick Start Guide

/*initialize a map with a set of view extent and zoom levels*/

var mymap=L.map('mapid').setView([51.505,-0.09],13);

// add a tileset from leaftlet provider and then add to mymap
L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
}).addTo(mymap);
//add a marker to the map at the specified lat and lon
var marker=L.marker([51.5,-0.09]).addTo(mymap); 
//add a circle to the map at the specified lat and lon, with styling properties included
var circle=L.circle([51.508,-0.11],{
	color:'red',
	fillColor:'#FFA07A',
	fillOpacity:0.5,
	radius:500
}).addTo(mymap);
// add a polygon with three pairs of corrdinates specifies to the map
var polygon=L.polygon([
	[51.509,-0.08],
	[51.503,-0.06],
	[51.51,-0.047]
]).addTo(mymap);
//binds the content with the marker
//open this popup when it's the only open popup, ie the previous popup will be closed when this one is open
marker.bindPopup('<b>Hello World!</b><br>I am a popup.').openPopup();
circle.bindPopup('I am a circle.'); //bind the popup to the circle
polygon.bindPopup('I am a polygon.');//bind the popup to the polygon

//create a popup that it's own layer at a specified location, and set it to popup when open mymap, and close the previous popup if there is one
var popup=L.popup()
	.setLatLng([51.5,-0.09])
	.setContent('I am a standalone popup.')
	.openOn(mymap);
//create a function method to interact with the user on the clicked location 
function onMapClick(e){
	alert('You clicked the map at '+ e.latlng.toString());
}
//call the function
mymap.on('click',onMapClick);

var popup=L.popup();
//instead of using alert, create a popup that informs user the clicked location using function call
function onMapClick(e){
	popup
		.setLatLng(e.latlng)
		.setContent('You clicked the map at '+ e.latlng.toString())
		.openOn(mymap);
}
mymap.on('click',onMapClick);

//
// Using GeoJSON with leaflet
//create a new geojson feature with descriptions on its type, properties and geometry
var geojsonFeature = {
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
};
//craete a geojson layer and add to the map
L.geoJSON(geojsonFeature).addTo(mymap);
//create two lines using two arrays of geojson objects
var myLines=[{
	'type':'LineString',
	'coordinates':[[-100,40],[-105,45],[-110,55]]
},{
	'type':"LineString",
	'coordinates':[[-105,40],[-110,45],[-115,55]]
}];
//create an empty geojson layer and assign it to a variable, then add the line works to the vairbale using .addData
var myLayer=L.geoJSON().addTo(mymap);
myLayer.addData(geojsonFeature);
//add the styles to a variable
var myStyle={
	'color':'#ff7800',
	'weight':5,
	'opacity':0.65
};
//add the style to the line strings and add to the map
L.geoJSON(myLines,{
	style:myStyle
}).addTo(mymap)
//create a variable with different properties
var states = [{
    "type": "Feature",
    "properties": {"party": "Republican"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-104.05, 48.99],
            [-97.22,  48.98],
            [-96.58,  45.94],
            [-104.03, 45.94],
            [-104.05, 48.99]
        ]]
    }
}, {
    "type": "Feature",
    "properties": {"party": "Democrat"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-109.05, 42.00],
            [-102.06, 40.99],
            [-102.03, 36.99],
            [-109.04, 36.99],
            [-109.05, 41.00]
        ]]
    }
}];
//pass a fucntion that styleize the features based on their properties
L.geoJSON(states, {
    style: function(feature) {
        switch (feature.properties.party) {
            case 'Republican': return {color: "#ff0000"};
            case 'Democrat':   return {color: "#0000ff"};
        }
    }
}).addTo(mymap);
//create a circle marker with these specified charcteristics
var geojsonMarkerOptions={
	radius:8,
	fillColor:'#FF7800',
	color:'#000',
	weight:1,
	opacity:1,
	fillOpacity:0.8
};
//create a circleMarker geojson layer from the varibale above and add to the map
L.geoJSON(someGeojsonFeature,{
	pointToLayer: function(feature, latlng){
		return L.circleMarker(latlng,geojsonMarkerOptions);
	}
}).addTo(mymap);
//call this function before adding the feature to a geojson layer, and attach a popup to the feature when the function is called
function onEachFeature(feature,layer){
	// if the feature has a property called popuoContent, bind this to the popup content 
	if (feature.properties && feature.properties.popupContent){
		layer.bindPopup(feature.properties.popupContent);
	}
}

var geojsonFeature={
	"type": "Feature",
    "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
};
//call the function to bind the pop up to the feature
L.geoJSON(geojsonFeature,{
	onEachFeature:onEachFeature
}).addTo(mymap);

//create a vairbale that has several different geojson features in it
var someFeatures=[{
	"type": "Feature",
    "properties": {
        "name": "Coors Field",
        "show_on_map": true
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
}, {
    "type": "Feature",
    "properties": {
        "name": "Busch Field",
        "show_on_map": false
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.98404, 39.74621]
    }
}];
//filter out some features to show on map based on its properties above
L.geoJSON(someFeatures,{
	filter: function(feature,layer){
		return feature.properties.show_on_map;
	}
}).addTo(mymap);


