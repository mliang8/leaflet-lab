//Mengyu Liang
//Module 4 15 cities 7 attributes

//initialize a function to create a map 
function createMap(){
	//create a mymap variable within the function and connect to the classid in html
	var mymap=L.map('mapid',{
		center:[39.9042,116.4074], //specify a map center location when load
		zoom:1 //specify the zoom levels
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
//create a function for adding the proportional symbols on the map with dataset and the map itself as parameters
function createPropSymbols(data,mymap, attributes){
	
	//create a geojson layer on map and add to map
	L.geoJson(data,{
		//internally call the pointToLayer function to spawn the data points' lat and lon values to the geojson layer created
		pointToLayer: function(feature,latlng){
			return pointToLayer(feature,latlng,attributes);
		}
	}).addTo(mymap);	
	console.log(attributes);
};


//function converting markers to circle markers


function pointToLayer(feature, latlng, attributes){
	//var attribute= "pop_1970(thousands)";
	var attribute=attributes[0];
	var options={
		//radius: 10,
		fillColor:"#85C1E9",
		color:"#3498DB",
		weight:2,
		opacity:1,
		fillOpacity:0.85
	};
	var attValue=Number(feature.properties[attribute]);
	options.radius= calcPropRadius(attValue);
	var layer=L.circleMarker(latlng,options);
	var panelContent="<p><b>City: </b>"+feature.properties.city+"</p>";
	var year=attribute.split("_")[1].split("(")[0];

	panelContent+="<p><b>Population in "+year+": </b>"+feature.properties[attribute]+" thousand</p>";
	var popupContent=feature.properties.city;
	layer.bindPopup(popupContent,{
		offset: new L.Point(0, -options.radius),
		closeButton: false
	});
	layer.on({
		mouseover: function(){
			this.openPopup();
		},
		mouseout: function(){
			this.closePopup();
		},
		click: function(){
			$("#panel").html(panelContent);
		}
	});
	//create the stylized circle markers at each city's locations 
	return layer;
		
	//var attribute= attributes[0];
	console.log(attribute);
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

function createSequenceControls(mymap, attributes){
	$('#panel').append('<input class="range-slider" type="range">');
	$('.range-slider').attr({
		max: 6,
		min:0,
		value: 0,
		step: 1
	});
	$('#panel').append('<button class="skip" id="reverse">Reverse</button>');
	$('#panel').append('<button class="skip" id="forward">Skip</button>');
	$('#reverse').html('<img src="img/back.png">');
	$('#forward').html('<img src="img/for.png">');
	$('.skip').click(function(){
		var index=$('.range-slider').val();
		if ($(this).attr('id')=='forward'){
			index++;
			index=index>6 ? 0 : index;
		} else if ($(this).attr('id')=='reverse'){
			index--;
			index=index<0 ? 6 : index;
		};

		$('.range-slider').val(index);
		updatePropSymbols(mymap,attributes[index]);
		
	});	

};

function updatePropSymbols(mymap, attribute){
	mymap.eachLayer(function(layer){
		if (layer.feature && layer.feature.properties[attribute]){
			var props= layer.feature.properties;
			var radius=calcPropRadius(props[attribute]);
			layer.setRadius(radius);
			var popupContent="<p><b>City:</b>"+props.city+"</p>";
			var year=attribute.split("_")[1].split("(")[0];
			popupContent+="<p><b>Population in "+year+": </b>"+layer.feature.properties[attribute]+" thousand</p>";
			layer.bindPopup(popupContent,{
				offset: new L.Point(0,-radius)
			});
		};
	});
};

//create a function to import data from the geojson file
function getData(mymap){
	//using ajax to load in the data  
	$.ajax("data/cities_pop.geojson",{
		dataType:"json",
		//call the function to create proportional symbol marker when the data is loaded in
		success:function (response){
			//create an attributes array
			var attributes=processData(response);
			createPropSymbols(response, mymap, attributes);
			createSequenceControls(mymap,attributes);

		}
	});
};

function processData(data){
    //empty array to hold attributes
    var attributes = [];

    //properties of the first feature in the dataset
    var properties = data.features[0].properties;

    //push each attribute name into attributes array
    for (var attribute in properties){
        //only take attributes with population values
        if (attribute.indexOf("pop") > -1){
            attributes.push(attribute);
        };
    };

    //check result
    console.log(attributes);

    return attributes;
};

//call the createMap function when the document has loaded
$(document).ready(createMap);