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
function getData(mymap){
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
		}
	});
};


//call the createMap function when the document has loaded
$(document).ready(createMap);