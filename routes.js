var _ = require('underscore');

var agencyKey = 'birmingham-jefferson-county-transit-authority';


module.exports = function routes(app){
	app.get('/', function(req, res) {
		res.render('route3', {});
    });
	
	app.get('/stops/:routeID', function(req, res) {
		/*
		Get all trips, stops, and stop times for a route
		SELECT TRIPS.SERVICE_ID, TRIPS.TRIP_ID, TRIPS.TRIP_HEADSIGN, STOP_TIMES.ARRIVAL_TIME, STOP_TIMES.STOP_ID, STOPS.STOP_NAME FROM TRIPS INNER JOIN STOP_TIMES ON STOP_TIMES.TRIP_ID=TRIPS.TRIP_ID INNER JOIN STOPS ON STOPS.STOP_ID=STOP_TIMES.STOP_ID WHERE TRIPS.ROUTE_ID='R1'		
		*/

    });
};