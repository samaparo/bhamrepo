(function(){
	var stops = [
		{
			ID: "A",
			NAME: "Central Station"
		},
		{
			ID: "B",
			NAME: "Babtist Medical Center Princeton"
		},
		{
			ID: "C",
			NAME: "West End Academy"
		},
		{
			ID: "D",
			NAME: "Jefferson & 40th St."
		},
		{
			ID: "E",
			NAME: "5th Ave. & 19th St. (Bess)"
		},
		{
			ID: "F",
			NAME: "5th Ave. & 18th St. (Bess)"
		},
		{
			ID: "G",
			NAME: "West Lake Mall"
		},
		{
			ID: "H",
			NAME: "Social Security Building"
		},
		{
			ID: "I",
			NAME: "UAB Medical West"
		},
		{
			ID: "J",
			NAME: "Walmart"
		},
	];
	var outboundStopIDs = ['A','B','C','D','E','F','G','H'];
	var inboundStopIDs = ['A','B','C','D','F','H','I','J'];
		
	var inboundTripsWD = [];
	var outboundTripsWD = [];
	
	//populate with 6 dummy rows
	for(var i = 0; i<16; i++){
		inboundTripsWD.push({STOPS:[{STOP_ID:"A", TIME:"5:45"},{STOP_ID:"B", TIME:"5:45"},{STOP_ID:"C", TIME:"5:45"},{STOP_ID:"D", TIME:"5:45"},{STOP_ID:"E", TIME:"5:45"},{STOP_ID:"F", TIME:"5:45"},{STOP_ID:"G", TIME:"5:45"},{STOP_ID:"H", TIME:"5:45"},]});
	}
	for(var i = 0; i<16; i++){
		outboundTripsWD.push({STOPS:[{STOP_ID:"A", TIME:"5:45"},{STOP_ID:"B", TIME:"5:45"},{STOP_ID:"C", TIME:"5:45"},{STOP_ID:"D", TIME:"5:45"},{STOP_ID:"I", TIME:"5:45"},{STOP_ID:"F", TIME:"5:45"},{STOP_ID:"J", TIME:"5:45"},{STOP_ID:"H", TIME:"5:45"},]});
	}
								  
	var $outboundTable = $("#outbound");
	var $inboundTable = $("#inbound");
	
	var stopTemplate = _.template('<div class="stop">' +
					   '	<div class="sequence">' +
					   '		<span><%= ID %></span>' +
					   '</div>' +
					   '<span class="name"><%= NAME %></span>' +
			           '</div>');
	
	var outboundStopHTML = "";
	
	_.each(outboundStopIDs, function(ID){
		var matchingStop = _.find(stops, function(stop){ return stop.ID == ID;});
		if(matchingStop != undefined)
			outboundStopHTML += stopTemplate(matchingStop);
	});
	
	
	
	$outboundTable.find(".stops").html(outboundStopHTML);
	
	
	
	
	
})();