(function(){
	$.ajax({
		url: '/stops/1',
		success: function(data) {

		var stops = [
			{
				IDS: ["SBO1"],
				NAME: "Central Station"
			},
			{
				IDS: ["SBI49", "SBO23"],
				NAME: "Babtist Medical Center Princeton"
			},
			{
				IDS: ["SBI41", "SBO32"],
				NAME: "West End Academy"
			},
			{
				IDS: ["SBI28", "SBO45"],
				NAME: "Jefferson & 40th St."
			},
			{
				IDS: ["SBO61"],
				NAME: "5th Ave. & 19th St. (Bess)"
			},
			{
				IDS: ["SBI13"],
				NAME: "5th Ave. & 18th St. (Bess)"
			},
			{
				IDS: ["SBO67","SBI6"],
				NAME: "West Lake Mall"
			},
			{
				IDS: ["SBO74"],
				NAME: "Social Security Building"
			},
			{
				IDS: ["SBI3"],
				NAME: "UAB Medical West"
			},
			{
				IDS: ["SBO75"],
				NAME: "Walmart"
			},
		];
		var outboundStopIDs = ['SBO1','SBO23','SBO32','SBO45','SBO61','SBO67','SBO74', 'SBO75'];
		var inboundStopIDs = ['SBO75','SBI3','SBI6','SBI13','SBI28','SBI41','SBI49','SBO1'];

		var letter = 0;
		_.each(stops, function(stop){
			stop.LETTER = String.fromCharCode(65 + letter);
			letter += 1;
		});
		
		var inboundTripsWD = data.weekdayInbound;
		var outboundTripsWD = data.weekdayOutbound;
		var outboundTripsWE = data.weekendOutbound;
		var inboundTripsWE = data.weekendInbound;
		
		//populate with 6 dummy rows
		// for(var i = 0; i<16; i++){
		// 	inboundTripsWD.push({STOPS:[{STOP_ID:"A", TIME:"5:45"},{STOP_ID:"B", TIME:"5:45"},{STOP_ID:"C", TIME:"5:45"},{STOP_ID:"D", TIME:"5:45"},{STOP_ID:"E", TIME:"5:45"},{STOP_ID:"G", TIME:"5:45"},{STOP_ID:"J", TIME:"5:45"},{STOP_ID:"H", TIME:"5:45"},]});
		// }
		// for(var i = 0; i<16; i++){
		// 	outboundTripsWD.push({STOPS:[{STOP_ID:"A", TIME:"5:45"},{STOP_ID:"B", TIME:"5:45"},{STOP_ID:"C", TIME:"5:45"},{STOP_ID:"D", TIME:"5:45"},{STOP_ID:"E", TIME:"5:45"},{STOP_ID:"G", TIME:"5:45"},{STOP_ID:"H", TIME:"5:45"},{STOP_ID:"J", TIME:"5:45"},]});
		// }
		// for(var i = 0; i<10; i++){
		// 	outboundTripsWE.push({STOPS:[{STOP_ID:"A", TIME:"5:45"},{STOP_ID:"B", TIME:"5:45"},{STOP_ID:"D", TIME:"5:45"},{STOP_ID:"G", TIME:"5:45"},{STOP_ID:"J", TIME:"5:45"}]});
		// }
		// for(var i = 0; i<10; i++){
		// 	inboundTripsWE.push({STOPS:[{STOP_ID:"A", TIME:"5:45"},{STOP_ID:"B", TIME:"5:45"},{STOP_ID:"C", TIME:"5:45"},{STOP_ID:"I", TIME:"5:45"},{STOP_ID:"J", TIME:"5:45"}]});
		// }
					  
		var $outboundTable = $("#outbound");
		var $inboundTable = $("#inbound");
		
		var stopTemplate = _.template('<div class="stop">' +
						   '	<div class="sequence">' +
						   '		<span><%= LETTER %></span>' +
						   '</div>' +
						   '<span class="name"><%= NAME %></span>' +
				           '</div>');

		var generateTimeHTML = function(tripCollection, stopIDs){
			var rowTemplate = _.template('<div class="row <%= ampmClass %>"><div class="am-pm"><%= ampmText %></div><%= stopHTML %></div>');
			var timeTemplate = _.template('<div class="time"><%= TIME %></div>');
			
			var isPM = false;
			var counter = 0;
			var timeHTML = "";
			_.each(tripCollection, function(trip){
				var rowHTML = "";
				_.each(stopIDs, function(ID){
					var matchingTime = _.find(trip.STOPS, function(stop){ return stop.STOP_ID == ID});
					if(matchingTime != undefined)
						rowHTML += timeTemplate(matchingTime);
					else
						rowHTML += timeTemplate({TIME:'-'});
				});
			
				var ampmText = "";
				counter += 1;
				if(counter>= 8){
					isPM = true;
				}
				if(counter == 1){
					//ampmText = "A.M.";
				}
				if(counter == 8){
					//ampmText = "P.M.";
				}
				timeHTML += rowTemplate({ampmClass:(isPM ? "pm" : ""), ampmText: ampmText, stopHTML: rowHTML});
			});
			return timeHTML;
		};
		
		var stopHTML = "";
		var stopPercent = (100.0/outboundStopIDs.length) - .1 + "%";
		_.each(outboundStopIDs, function(ID){
			var matchingStop = _.find(stops, function(stop){ return  _.contains(stop.IDS, ID); });
			if(matchingStop != undefined)
				stopHTML += stopTemplate(matchingStop);
		});	
		$outboundTable.find(".stops").html(stopHTML);
		$outboundTable.find(".times").eq(0).html(generateTimeHTML(outboundTripsWD, outboundStopIDs));
		$outboundTable.find(".times").eq(1).html(generateTimeHTML(outboundTripsWE, outboundStopIDs));
		$outboundTable.find(".stops .stop").css("width", stopPercent);
		$outboundTable.find(".times .time").css("width", stopPercent);
		
		
		stopHTML = "";
		var stopPercent = (100.0/inboundStopIDs.length) - .1 + "%";
		_.each(inboundStopIDs, function(ID){
			var matchingStop = _.find(stops, function(stop){ return _.contains(stop.IDS, ID); });
			if(matchingStop != undefined)
				stopHTML += stopTemplate(matchingStop);
		});	
		$inboundTable.find(".stops").html(stopHTML);
		$inboundTable.find(".times").eq(0).html(generateTimeHTML(inboundTripsWD, inboundStopIDs));
		$inboundTable.find(".times").eq(1).html(generateTimeHTML(inboundTripsWE, inboundStopIDs));
		$inboundTable.find(".stops .stop").css("width", stopPercent);
		$inboundTable.find(".times .time").css("width", stopPercent);
		
		
		$(".stops .sequence span, .day-divider").addClass("route-1");
	}
	});
})();