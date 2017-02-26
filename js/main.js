//Mengyu Liang
//Module 4 15 cities 7 attributes

//initialize a function to create a map 
function createMap(){
	//create a mymap variable within the function and connect to the classid in html
	var mymap=L.map('mapid',{
		center:[39.9042,116.4074], //specify a map center location when load
		zoom:10 //specify the zoom levels
	});
	//add tilestyle from the opensource website and add to the map
	L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		
	}).addTo(mymap);
	//call the getData function to load information and marker style to the map
	getData(mymap); 
};
//create a function to add the attribute information onto each marker
function onEachFeature(feature, layer){
	//create an empty variable to contain the attribute information
	var popupContent="";
	//add a condition to check if the geojson feature has attribute
	if (feature.properties) {
        //loop to add feature property names and values to html string
        for (var property in feature.properties){
            popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
        }
        //binf the attribute information to this geojson layer
        layer.bindPopup(popupContent);
    };
};


//create a getData function using the map as a parametr to add a stylized marker and the attribute information onto the map
/*function getData(mymap){
	//using ajax to load the geojson file
	$.ajax('data/cities_pop.geojson',{
		//specify the file type
		dataType:"json",
		//after the data is loaded successfully
		success: function(response){
			//create a variable with specified styles
			var geojsonMarkerOptions={
				radius:10,
				fillColor: "#3879B2",
				weight:2,
				opacity:1,
				fillOpacity:0.6
			};
			//create a geojson layer after the data loaded
			L.geoJson(response,{
				//then load the circle marker to the geojson layer by creating a function to load the geogrpahy of these markers
				pointToLayer: function(feature, latlng){
					return L.circleMarker(latlng,geojsonMarkerOptions);
				},
				onEachFeature: onEachFeature
			}).addTo(mymap);
			//create another geojson layer to add the attribute infomration to the popup marker to thelayer and then to the mpa
			/*L.geoJson(response, {
                onEachFeature: onEachFeature
            }).addTo(mymap);*/
/*		}
	});
};*/

//create a function for adding the proportional symbols on the map with dataset and the map itself as paarameters
function createPropSymbols(data,mymap){
	//define a variable for marker stylizing
	var geojsonMarkerOptions={
		radius: 10,
		fillColor:"#85C1E9",
		color:"#3498DB",
		weight:2,
		opacity:1,
		fillOpacity:0.85
	};
	//define a variable for the attribute to visualize with the proportional symbols on map, which is the population of 1970 in thousand 
	var attribute= "pop_1970(thousands)";
	//create a geojson layer on map and add to map
	L.geoJson(data,{
		//internally call the pointToLayer function to spawn the data points' lat and lon values to the geojson layer created
		pointToLayer: function (feature, latlng){
			//define a variable to store the attribute values which is 1970 population of each city and cast the value to a numeric value
			var attValue=Number(feature.properties[attribute]);
			//console.log(feature.properties, attValue);
			//acess the radius of each marker defined previously and change it based on pop size by calling the calcPropRadius function 
				//with the attribute value, whcih is the 1970 pop size
			geojsonMarkerOptions.radius=calcPropRadius(attValue);
			//create the stylized circle markers at each city's locations 
			return L.circleMarker(latlng, geojsonMarkerOptions);
		}
	}).addTo(mymap);
};
//create a function to import data from the geojson file
function getData(mymap){
	//using ajax to load in the data  
	$.ajax("data/cities_pop.geojson",{
		dataType:"json",
		//call the function to create proportional symbol marker when the data is loaded in
		success:function (response){
			createPropSymbols(response, mymap);
		}
	});
};
//create a function to calculate the radius of markers based on attValue which is the population size
function calcPropRadius(attValue){
	//define a variable scale factor to scale down all the marker symbols based on their numerical values
	var scaleFactor=0.5;
	//calculate the marker size based on the attribute values and the scale factor which adjusts the values
	var area=attValue * scaleFactor;
	//calculate the radius of circle marker based on basic equation for calculating circle area
	var radius= Math.sqrt(area/Math.PI);
	//return te radius of symbol
	return radius;

};




























//call the createMap function when the document has loaded
$(document).ready(createMap);