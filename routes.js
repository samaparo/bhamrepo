var _ = require('underscore');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./gtfsData.db');
var agencyKey = 'birmingham-jefferson-county-transit-authority';


module.exports = function routes(app){
	app.get('/', function(req, res) {
		res.render('route3', {});
    });
	
	app.get('/stops/:routeID', function(req, res) {



		var output = {};
		var selectStatement = "SELECT TRIPS.SERVICE_ID, TRIPS.TRIP_ID, TRIPS.TRIP_HEADSIGN, STOP_TIMES.ARRIVAL_TIME, STOP_TIMES.STOP_ID " + 
							  "FROM TRIPS INNER JOIN STOP_TIMES ON STOP_TIMES.TRIP_ID=TRIPS.TRIP_ID WHERE TRIPS.ROUTE_ID='R1'"
		db.all(selectStatement, function(err, rows){
			//ID - STOPS, HEADSIGN, ISWEEKDAY
			var allTrips = {};
			rows = _.sortBy(rows, function(row){
				var timeAsInt = parseInt(row.arrival_time.replace(/\D/g,''));
				return timeAsInt;
			});

			_.each(rows, function(row){
				var tripID = row.trip_id;
				if(allTrips[tripID] == undefined){
					allTrips[tripID] = {IS_INBOUND: row.trip_headsign === "Central Station", IS_WEEKDAY: row.service_id === "WD", STOPS: []};
				}

				var stop = {STOP_TIME: row.arrival_time, STOP_ID: row.stop_id};
				allTrips[tripID].STOPS.push(stop);
			});

			output = {
				weekdayInbound: [],
				weekdayOutbound: [],
				weekendInbound: [],
				weekendOutbound: []
			};

			_.each(allTrips, function(trip){
				if(trip.IS_INBOUND){
					if(trip.IS_WEEKDAY) output.weekdayInbound.push(trip);
					else output.weekendInbound.push(trip);
				}
				else{
					if(trip.IS_WEEKDAY) output.weekdayOutbound.push(trip);
					else output.weekendOutbound.push(trip);
				}
			});


			res.json(output);
		});
		
	
    });
};