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
	var outboundStopIDs = ['A','B','C','D','E','G','H', 'J'];
	var inboundStopIDs = ['J','I','G','D','F','C','B','A'];
	
	
	var inboundTripsWD = [];
	var outboundTripsWD = [];
	
	//populate with 6 dummy rows
	for(var i = 0; i<16; i++){
		inboundTripsWD.push({STOPS:[{STOP_ID:"A", TIME:"5:45"},{STOP_ID:"B", TIME:"5:45"},{STOP_ID:"C", TIME:"5:45"},{STOP_ID:"D", TIME:"5:45"},{STOP_ID:"E", TIME:"5:45"},{STOP_ID:"G", TIME:"5:45"},{STOP_ID:"J", TIME:"5:45"},{STOP_ID:"H", TIME:"5:45"},]});
	}
	for(var i = 0; i<16; i++){
		outboundTripsWD.push({STOPS:[{STOP_ID:"A", TIME:"5:45"},{STOP_ID:"B", TIME:"5:45"},{STOP_ID:"C", TIME:"5:45"},{STOP_ID:"D", TIME:"5:45"},{STOP_ID:"E", TIME:"5:45"},{STOP_ID:"G", TIME:"5:45"},{STOP_ID:"H", TIME:"5:45"},{STOP_ID:"J", TIME:"5:45"},]});
	}
								  
	var $outboundTable = $("#outbound");
	var $inboundTable = $("#inbound");
	
	var stopTemplate = _.template('<div class="stop">' +
					   '	<div class="sequence">' +
					   '		<span><%= ID %></span>' +
					   '</div>' +
					   '<span class="name"><%= NAME %></span>' +
			           '</div>');
	var rowTemplate = _.template('<div class="row <%= ampmClass %>"><div class="am-pm"><%= ampmText %></div><%= stopHTML %></div>');
	var timeTemplate = _.template('<div class="time"><%= TIME %></div>');
	
	var stopHTML = "";
	var timeHTML = "";
	var stopPercent = (100.0/outboundStopIDs.length) - .1 + "%";
	
	_.each(outboundStopIDs, function(ID){
		var matchingStop = _.find(stops, function(stop){ return stop.ID == ID;});
		if(matchingStop != undefined)
			stopHTML += stopTemplate(matchingStop);
	});	
	
	_.each(outboundTripsWD, function(trip){
		var rowHTML = "";
		_.each(outboundStopIDs, function(ID){
			var matchingTime = _.find(trip.STOPS, function(stop){ return stop.STOP_ID == ID});
			if(matchingTime != undefined)
				rowHTML += timeTemplate(matchingTime);
			else
				rowHTML += timeTemplate({TIME:'-'});
		});
		timeHTML += rowTemplate({ampmClass:'', ampmText: '', stopHTML: rowHTML});
	});
	
	
	$outboundTable.find(".stops").html(stopHTML);
	$outboundTable.find(".times").html(timeHTML);
	$outboundTable.find(".stops .stop").css("width", stopPercent);
	$outboundTable.find(".times .time").css("width", stopPercent);
	
	
	/*
	<div class="row">
					<div class="am-pm"></div>
					<div class="time">5:45</div>
					<div class="time">6:04</div>
					<div class="time">6:15</div>
					<div class="time">6:28</div>
					<div class="time">6:35</div>
				</div>
	*/
	
	
//	stopHTML = "";
//	stopPercent =  (100.0/inboundStopIDs.length) - .1 + "%";
//	_.each(inboundStopIDs, function(ID){
//		var matchingStop = _.find(stops, function(stop){ return stop.ID == ID;});
//		if(matchingStop != undefined)
//			stopHTML += stopTemplate(matchingStop);
//	});
//	$inboundTable.find(".stops").html(stopHTML);
//	$inboundTable.find(".stops .stop").css("width", stopPercent);
	
	
	$(".stops .sequence span").addClass("route-1");
	
	
	
	
})();