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
		db.each(selectStatement, function(err, row){
			
		}, function(){
			res.json({output: output});
		});
		
	
    });
};