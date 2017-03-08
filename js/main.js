//Mengyu Liang
//Module 6 Finished lab 6
//This lab creates a proportional symbol map of population chnage through time in several imaportant cities all
	//over the world; with an overlay for percetange of population hcnage, users could identify the popluation change 
	//pattern more easily, i.e. to identify the cities with population growth and decay. 
	//If with more help, I would definitly create an addiitonal attribute legend that display as the overlay turns on
	//and also style to attribute legend's text more. 

//initialize a function to create a map 
function createMap(){
	//create a mymap variable within the function and connect to the classid in html
	var mymap=L.map('mapid',{
		center:[41,29], //specify a map center location when load
		zoom:2 //specify the zoom levels
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
            console.log(property);
        };
        //bind the attribute information to this geojson layer
        layer.bindPopup(popupContent);
    };
};
//create a function to import data from the geojson file
function getData(mymap){
	//using ajax to load in the first dataset for the main layer
	$.ajax("data/cities_pop.geojson",{
		dataType:"json",
		//call the function to create proportional symbol marker when the data is loaded in
		success:function (response1){
			//store the loaded data as attributes1 which is an attribute array
			var attributes1=processData(response1);			
			//console.log(attributes1);
			//load in the second dataset for the overlay layer
			$.ajax("data/cities_popchange.geojson",{
				dataType:"json",
				//call the function to create proportional symbol marker when the data is loaded in
				success:function (response2){
					//store the loaded data as attributes2 which is an attribute array
					var attributes2=processData(response2);
					//call the function to craete the proportional symbols and the sequence trol after the data is successfully loaded
					createPropSymbols(response1,response2, mymap,attributes1, attributes2);
					createSequenceControls(mymap,attributes1);
					createLegend(mymap,attributes1);
					console.log(attributes2);
				}
			});
		}

	}).fail(function(){alert("Error in loading dataset.")});
};
//craete a function to build an attributes array from the data
function processData(data){
    //empty array to hold attributes
    var attributes= [];
    //properties of the first feature in the dataset
    var properties = data.features[0].properties;
    //push each attribute name into attributes array
    for (var attribute in properties){
        //only take attributes with population values
        if (attribute.indexOf("pop") > -1){
            attributes.push(attribute);
        };
    };
    console.log(attributes);
    return attributes;
};
/*function Popup(properties, attribute, layer, radius){
    this.properties = properties;
    this.attribute = attribute;
    this.layer = layer;
    this.year = attribute.split("_")[1].split("(")[0];
    this.population = this.properties[attribute];
    this.content = "<p><b>City:</b> " + this.properties.city + "</p><p><b>Population in " + this.year + ":</b> " + this.population + " million</p>";

    this.bindToLayer = function(){
        this.layer.bindPopup(this.content, {
            offset: new L.Point(0,-radius)
        });
    };
};*/
//a function to create the popup content and style the conteent which can be called later to avoid duplications
function createPopup(properties, attribute, layer, radius){
    //add city to popup content string
    var popupContent = "<p><b>" + properties.city + " </b></p><br>";

    //add formatted attribute to panel content string
    var year = attribute.split("_")[1].split("(")[0];
    //var panelContent="<p><b>"+properties.city+"</b></p>";
    popupContent += " <p>population in <b> " + year + "</b> is <b> " + properties[attribute] + "</b> thousand</p>";

    //replace the layer popup
    layer.bindPopup(popupContent, {
        offset: new L.Point(0,-radius)
    });
};

//create a function for adding the proportional symbols on the map with dataset and the map itself as parameters
function createPropSymbols(data1,data2,mymap, attributes1, attributes2){
	
	//create a geojson layer on map and add to map
	var pop=L.geoJson(data1,{

		//internally call the pointToLayer function to spawn the data points' lat and lon values to the geojson layer created
		pointToLayer: function(feature,latlng){
			return pointToLayer(feature,latlng,attributes1);

		}
	}).addTo(mymap);	
	//create another geojson layer with the second dataset 
	var popchange=L.geoJson(data2,{
		//internally call the pointToLayer function to spawn the data points' lat and lon values to the geojson layer created
		pointToLayer: function(feature,latlng){
			return pointToLayer(feature,latlng,attributes2);

		}
	});
	//create another geojson layer to embed the previous two datasets 
	var overlays={
		"city population": pop,
		"city population change (2000-2016)":popchange
	};
	//$(overlays).css({"font-family":"Avenir"});
	//create an attribute control with no baselayer, but with the previously define overlay layer and add to the map
	var layerControl=L.control.layers(null,overlays).addTo(mymap);
	mymap.addControl(layerControl);
	//mymap.addControl(new L.Control.PanelLayers(null,overlays));
	console.log(overlays);
};

//function converting markers to circle markers based on the attributes' locations and values
function pointToLayer(feature, latlng, attributes){
	//var attribute= "pop_1970(thousands)";
	//assign the current attribute based on the first index of the attributes array
	var attribute=attributes[0];

	//an if sattement to check the first indexed attribute and determine whether it belongs to the main layer or the overlay layer
	if (attribute=="pop_1970(thousands)"){
		
		//for the circle markers in the main layers, define style options
		var options={
			//radius: 10,
			fillColor:"#2E86C1",
			color:"#2471A3",
			weight:1,
			opacity:0.65,
			fillOpacity:0.55
		};

		//define a varibale to store all the attributes of each feature after being casted into type Number
		var attValue=Number(feature.properties[attribute]);
		//style the symbols based on the style options above and the radius is based in calling the radius calculating function and 
			//pass in a scale factor of 0.5
		options.radius= calcPropRadius(attValue,0.5);
		/*var popup=new Popup(feature.properties,attribute,layer,options.radius);
		popup.bindToLayer();*/
		
		//define a layer to include the instantiated circle marker objects  
		var layer=L.circleMarker(latlng,options);
		createPopup(feature.properties, attribute, layer, options.radius);
		//define a variable to store strings and values to include as the pannel's content
	/*	var panelContent="<p><b>City: </b>"+feature.properties.city+"</p>";

		//define another variable to include the time infomrtaion of the data
		var year=attribute.split("_")[1].split("(")[0];
		//concatinate the time information to the panelcontent 
		panelContent+="<p><b>Population in "+year+": </b>"+feature.properties[attribute]+" thousand</p>";
		//define a varibale to include the city names to include in the popup 
		var popupContent=feature.properties.city;
		//bing the popuoContent which contains city names to the layer with cricle marker obejcts
		layer.bindPopup(popupContent,{
			//add an offeset so that the popup based on the fetaure's radius would not obscure the feature
			offset: new L.Point(0, -options.radius),
			//disable the presence of a close button for the popup
			closeButton: false
		});*/
		//create an event listener to open and close popup when mouse is over or our, also to add panelContent to the 
			//panel-content class when clicked on the feature
		layer.on({
			mouseover: function(){
				this.openPopup();
			},
			mouseout: function(){
				this.closePopup();
			},
			click: function(){
				$("#container").html(panelContent);
			}
		});
		//return the layer with circle markers
		return layer;
		//if the first indexed attribute macthed with the overlay layer's attribute, follow the following set of styling 
	} else if(attribute=="popchange_2000-2016(percentage)"){
		//for the circle markers in the overlay layer , define style options
		var options={
			//radius: 10,
			fillColor:"#F1C40F",
			color:"#F39C12",
			weight:0.7,
			opacity:0.85,
			fillOpacity:0.70
		};
		//style the symbols based on the style options above and the radius is based in calling the radius calculating function and 
			//pass in a scale factor of 230
		var attValue=Number(feature.properties[attribute]);
				//if the attribute values are negative, follow the alternative stylings to distinguish the fetaures
		if (attValue<0){
			var options={
			//radius: 10,
			fillColor:"#CB3626",
			color:"#CC2A19",
			weight:0.7,
			opacity:0.85,
			fillOpacity:0.85
			};
		//createPopup(feature.properties, attribute, layer, options.radius);
		};
		options.radius= calcPropRadius(attValue,230);
				//console.log(attValue);

		//define a layer to include the instantiated circle marker objects  
		var layer=L.circleMarker(latlng,options);
		//createPopup(feature.properties, attribute, layer, options.radius);
		//define a variable to store strings and values to include as the pannel's content
		var panelContent="<p><b>"+feature.properties.city+"</b></p>";
		//define another variable to include the time infomrtaion of the data
		var year=attribute.split("_")[1].split("(")[0];
		//concatinate the time information to the panelcontent 
		panelContent+="<p><b>Percentage</b> of population for<b> "+year+": </b><b>"+feature.properties[attribute]+" %</b></p>";
		console.log(panelContent);
		//define a varibale to include the city names to include in the popup 
		var popupContent=panelContent;
		//bing the popuoContent which contains city names to the layer with cricle marker obejcts
		layer.bindPopup(popupContent,{
			//add an offeset so that the popup based on the fetaure's radius would not obscure the feature
			offset: new L.Point(0, -options.radius),
			//disable the presence of a close button for the popup
			closeButton: false
		});
		//create an event listener to open and close popup when mouse is over or our, also to add panelContent to the 
			//panel-content class when clicked on the feature
		layer.on({
			mouseover: function(){
				this.openPopup();
			},
			mouseout: function(){
				this.closePopup();
			},
			click: function(){
				$("#panel-content").html(panelContent);
			}
		});
		//return the layer with circle markers
		return layer;
	}
};

//create a function to calculate the radius of markers based on attValue which is the population size
//include the attribute values and the scale factors as two parameters that will get passed into the functions when calles
function calcPropRadius(attValue, scaleFactor){
	//define a variable scale factor to scale down all the marker symbols based on their numerical values
	//var scaleFactor=0.5;
	//calculate the marker size based on the attribute values and the scale factor which adjusts the values
	var area=attValue * scaleFactor;
	//calculate the radius of circle marker based on basic equation for calculating circle area
	var radius= Math.sqrt(Math.abs(area)/Math.PI);
	//return te radius of symbol
	return radius;
};
//fucntion to create a sequence control to iterate attribute array
function createSequenceControls(mymap, attributes){
	var SequenceControl=L.Control.extend({
		options:{
			position:"bottomright"
		},
		onAdd: function(mymap){
			var container=L.DomUtil.create('div','sequence-control-container');
			$(container).append('<input class="range-slider" type="range">');
			//add skip buttons to the range-slider 
			$(container).append('<button class="skip" id="reverse">Reverse</button>');
			$(container).append('<button class="skip" id="forward">Skip</button>');
			$(container).on('mousedown dblclick',function(e){
				L.DomEvent.stopPropagation(e);
			});
			return container;
		}
	});
	mymap.addControl(new SequenceControl());
	//createLegend(attributes[index]);
	//craete a slider to store range input elements
	//$('#range-slider').append('<input class="range-slider" type="range">');
	//set slider attribute with a max, a min value, an incrament and a starting point
	$('.range-slider').attr({
		max: 6,
		min:0,
		value: 0,
		step: 1
	});
	
	//using images instead of words for moving forward and reverse
	$('#reverse').html('<img src="img/back.png">');
	$('#forward').html('<img src="img/for.png">');
	//create an event listener for the buttons
	$('.skip').click(function(){
		//get the old index value
		var index=$('.range-slider').val();
		//var year = attributes[index].split("_")[1].split("(")[0];
		//incrament or decrament based on the button closed
		if ($(this).attr('id')=='forward'){
			index++;
			//if past the last attribute, wrap around to the first attribute
			index=index>6 ? 0 : index;
		} else if ($(this).attr('id')=='reverse'){
			index--;
			//if past the first attribute, wrap around to the last attribute
			index=index<0 ? 6 : index;
		};
		//update the range slider usign the index value
		$('.range-slider').val(index);
		console.log(attributes[index]);

		//call the updataproportionalsymbol function to update the proporitonal symbols on map based on the index
		updatePropSymbols(mymap,attributes[index]);
		updateLegend(mymap,attributes[index]);
		//$(".temporal-legend").text(attributes[index]);
		//console.log(attributes[index]);	
		
	});	
};
//this function creates a temporal and an attribute legend
function createLegend(mymap, attributes){
    var LegendControl = L.Control.extend({
        options: {
            position: 'bottomleft'
        },

        onAdd: function (mymap) {
            // create the control container with a particular class name
            var container = L.DomUtil.create('div', 'legend-control-container');
            //$(container).append('div id="overlay-legend" height="100px">');
            /*var svg2 = '<svg id="overlay-legend" width="300px" height="100px">';
            var circles2={
            	r1:20,
            	r2:20
            };
            for (var circle2 in circles2){
            	svg2 += '<circle class="legend-circle" id="' + circle2 + 
            	'" fill="#2E86C1" fill-opacity="0.55" stroke="#2471A3" cx="80"/>';
            	//text string includes the location 
            	svg2+= '<text id="'+circle2+'-text" x="175" y="' +(circles2[circle2]+55)+'"></text>';
            };
            svg2 += "</svg>";
            $(container).append(svg2);*/
            //craete a image element to store and style the legend icon
            var elem = document.createElement("img");
			elem.setAttribute("src", "img/symbol1.png");
			elem.setAttribute("height", "20");
			elem.setAttribute("width", "20");

			//append this element into the contianer
			$(container).append(elem);

			//craete a text element to store the legend text info
			var txt1=document.createElement("span");
			txt1.innerHTML='negative pop change 2010-2016';
			$(container).append(txt1);
			//craete a text element to store the legend text info
			var txt2=document.createElement("span");
			txt2.innerHTML='positive pop change 2010-2016<br>';
			$(container).append(txt2);

			//craete a image element to store and style the legend icon
			var elem2 = document.createElement("img");
			elem2.setAttribute("src", "img/symbol2.png");
			elem2.setAttribute("height", "20");
			elem2.setAttribute("width", "20");
			elem2.style.top="1000px";
			$(container).append(elem2);

				
            //add temporal legend div to container
            $(container).append('<div id="temporal-legend">');

            //Step 1: start attribute legend svg string
            var svg = '<svg id="attribute-legend" width="300px" height="190px">';
            //var circles=getCircleValues(mymap,attributes[0]);
            //array of circle names to base loop on
        	var circles = {
        		max: 20,
        		mean:40,
        		min:60
        	};
        	var i=0;
        	// loop to add each circle and text to svg string
        	for (var circle in circles){
                //circle svg string describing class and styles and location
            	svg += '<circle class="legend-circle" id="' + circle + 
            	'" fill="#2E86C1" fill-opacity="0.55" stroke="#2471A3" cx="80"/>';
            	//text string includes the location 
            	svg+= '<text id="'+circle+'-text" x="175" y="' +(circles[circle]+35+i)+'"></text>';
            	i+=20;

            	console.log(circles[circle]);
        	};
        	//close svg string
        	svg += "</svg>";
        	console.log(svg);
            //add attribute legend svg to container
            $(container).append(svg);
            //return the container with temporal and attribute legends
            return container;
        }
    });

    mymap.addControl(new LegendControl());
    //console.log('hello world');
    updateLegend(mymap, attributes[0]);
};
//calculates the max mean and min values for a given attribute
function getCircleValues(mymap,attribute){
	//start with min at highest possiable and max at lowest possiable
	var min=Infinity,
		max= -Infinity;
	//attch this function to set the min and ax for each layer on mymap
	mymap.eachLayer(function(layer){
		//accss the attribute value
		if (layer.feature){
			var attributeValue=Number(layer.feature.properties[attribute]);
			//test to find the max
			if (attributeValue<min){
				min=attributeValue;
			};
			//test to find the mean
			if (attributeValue>max){
				max=attributeValue;
			};
		};
	});
	//set the mean value from max and min
	var mean=(max+min)/2;
	return{
		max: max,
		mean:mean,
		min: min
	};
};
//update the ledgen with new attribute value
function updateLegend(mymap,attribute){
	//create legend title from the attribute
	var year= attribute.split("_")[1].split("(")[0];
	var content="<p><b>Population in "+year+"</b></p>";
	//replace legend content for the temporal legend
	$('#temporal-legend').html(content);
	//get the max min and mean values as obejct store  in circlValue
	var circleValues=getCircleValues(mymap,attribute);
	console.log(circleValues);
	//loop thorugh all threes values stored via keys
	for (var key in circleValues){
		console.log(circleValues[key]);
		//set the legend circles' radius using the values accssable through keys
		var radius=calcPropRadius(circleValues[key],0.5);
		console.log(radius);
		//assign a vertical location and radius to the circles in attribute legend
		$('#'+key).attr({
			cy: 156-radius,
			r:radius
		});
		$('#'+key+'-text').text(Math.round(circleValues[key]*100)/100+" thousand");
		//$('#'+key+'-text').offset(new L.Point(0,-radius));
	};
};

//resize proportional symbols according to the new attribute values
function updatePropSymbols(mymap, attribute){
	//iterates over the layers of mymap and call the function to pass into the layer
	mymap.eachLayer(function(layer){
		//if both the fetaure of the layer and the attribute matched
		if (layer.feature && layer.feature.properties[attribute]){

			//access the feature properties
			var props= layer.feature.properties;
			//update each feature's radius based on new attribute values
			var radius=calcPropRadius(props[attribute],0.5);
			//console.log(props, attribute,radius);
			//set the radius of the cricles for this layers
			layer.setRadius(radius);
			createPopup(props, attribute, layer, radius);

			//define the content which are the city names for each updated layer
			/*var popupContent="<p><b>City:</b>"+props.city+"</p>";
			//deine the time information
			var year=attribute.split("_")[1].split("(")[0];
			//concatenate the time information to the popup content
			popupContent+="<p><b>Population in "+year+": </b>"+layer.feature.properties[attribute]+" thousand</p>";
			//bind the popup information to each layer
			layer.bindPopup(popupContent,{
				//add an offeset so that the popup based on the fetaure's radius would not obscure the feature
				offset: new L.Point(0,-radius)
			});*/
		};
	});
};
//to open up a pop up window when the page load with the opations to show the content ot to hide it
function PopUp(hideOrshow) {
    if (hideOrshow == 'hide') document.getElementById('ac-wrapper').style.display = "none";
    else document.getElementById('ac-wrapper').removeAttribute('style');
};
//after the document loaded, call the popup funciton to display the pop up
$(document).ready(function(){
   setTimeout(function(){
      PopUp();
   },50); // to load it after slightly later from page load
});


//call the createMap function when the document has loaded
$(document).ready(createMap);
	




