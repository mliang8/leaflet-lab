//Mengyu Liang
//Module 2 Debugging

//initialize function called when the script loads
function initialize(){
	cities();
	//jQueryAjax();
	//call the debugAjax function that is defined later
	debugAjax();
};

//function to create a table with cities and their populations
function cities(){
	//define two arrays for cities and population
	var cityPop = [
		{ 
			city: 'San Diego',
			population: 1394928
		},
		{
			city: 'Saratoga Springs',
			population: 26586
		},
		{
			city: 'Chicago',
			population: 2695598
		},
		{
			city: 'Beijing',
			population: 21700000
		}
	];

	//append the table element to the div
	$("#mydiv").append("<table>");

	//append a header row to the table
	$("table").append("<tr>");
	
	//add the "City" and "Population" columns to the header row
	$("tr").append("<th>City</th><th>Population</th>");
	
	//loop to add a new row for each city
    for (var i = 0; i < cityPop.length; i++){
        //assign longer html strings to a variable
        var rowHtml = "<tr><td>" + cityPop[i].city + "</td><td>" + cityPop[i].population + "</td></tr>";
        //add the row's html string to the table
        $("table").append(rowHtml);
    };
	//call the addColumns function after the table has been constructed
    addColumns(cityPop); //BUG!!
	// call the addEvents function to perform interacting tasks after the table and addiitonal columns have been loaded
    addEvents();
};
// function to create an additional column to tell the size of the cities based on the population threshold
// include an argument CP in the function addColumns as a paremeter
function addColumns(CP){
    //using the each() method to iterate thrugh all the rows based on the index value
    $("tr").each(function(i){
		// when the locator is at the first row, append the row header to this element
    	if (i == 0){
			//select the current element which is the first row and appenf 
    		$(this).append('<th>City Size</th>');
		// for rows other than the first row	
    	} else {  
			// define a variable citySize
    		var citySize;
			//then access the population attribute of the current element and check if it is less than 100,000
    		if (CP[i-1].population < 100000){
				//if less, then assign a string value to the variable citySize
    			citySize = 'Small';
			//then access the population attribute of the current element and check if it is less than 500,000
    		} else if (CP[i-1].population < 500000){
				//if less, then assign a string value to the variable citySize
    			citySize = 'Medium';
			// if the population value is above the previous two thresholds, assign another string
    		} else {
    			citySize = 'Large';
    		}
			//append the variable citySize with its value back to the current element in the rows
    		$(this).append('<td>'+citySize+'</td>');
    	};
    });
};
//function to add event listener methods to the table
function addEvents(){
	// add a mouseover event by first define a handler function
	$('table').mouseover(function(){
		//define a variable color
		var color = "rgb(";
		//create a for loop to add a three rgb color values to the color vairbale
		for (var i=0; i<3; i++){
			// define a varibale called random by rnadomly selcting a number from 255 rgb values
			var random = Math.round(Math.random() * 255);
			//add the randomly selected number to the defined variable
			color += random;
			//add commas after the first two values 
			if (i<2){
				color += ",";
			//add the right half of parentheses after the last value
			} else {
				color += ")";
			}
		//append the color change as a css method to the table
		$(this).css('color', color);
		};
	});
	//a function to create a clickme event and display a message as a feedback
	function clickme(){

		alert('Hey, you clicked me!');
	};
	//using the on method to start the event listener for event clickme 
	$('table').on('click', clickme);
};

//define the callback fucntion to execute the script to display the geojson file conetent after the data is retrived 
	//from the server
function debugCallback(response, status, jqXHRobject){
	//print the string and the data readily retrived from the served into mydiv
	$(mydiv).append('<br>GeoJSON data:<br>'+JSON.stringify(response));
};
// define the Ajax request function for data in geojson file to be sent to and retrived from server without loading time
function debugAjax(){
	//using the jquery ajax method to opent he server connection and get to the data in Megacities.geojson
	$.ajax("data/MegaCities.geojson",{
		//set the resposne type
		dataType:"json",
		//if the data request has been sent, call the callback fucntion
		success: debugCallback
		//function(response){
			//debugCallback(mydata);
		//}
	});
//	$(mydiv).append('<br>GeoJSON data:<br>' + JSON.stringify(mydata));

};


//call the initialize function when the document has loaded
$(document).ready(initialize);