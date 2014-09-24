var mongoose = require('mongoose');
var _ = require('underscore');
var utils = require('./lib/utils');
var db = mongoose.connect('mongodb://localhost:27017/gtfs');

require('./models/Agency');
require('./models/Calendar');
require('./models/CalendarDate');
require('./models/FareAttribute');
require('./models/FareRule');
require('./models/FeedInfo');
require('./models/Frequencies');
require('./models/Route');
require('./models/Stop');
require('./models/StopTime');
require('./models/Transfer');
require('./models/Trip');

var Agency = db.model('Agency')
  , Calendar = db.model('Calendar')
  , Route = db.model('Route')
  , Stop = db.model('Stop')
  , StopTime = db.model('StopTime')
  , Trip = db.model('Trip')
  , Calendar = db.model('Calendar');

var agencyKey = 'birmingham-jefferson-county-transit-authority';


module.exports = function routes(app){
	app.get('/', function(req, res) {
		Route.find({agency_key:agencyKey}, function(e, data){
			res.send(data);
		});
    });
	app.get('/trips/:routeID', function(req, res) {
		Trip.find({route_id:req.params.routeID, service_id:'WD'}, function(e, data){
			res.send(data);
		});
    });
	app.get('/stops/:routeID', function(req, res) {
		
		var stopIDsToHighlight = [
			'SBO1',
			'18015',
			'18024',
			'18026'
		];
		var stopIDsToHighlightUnclean = _.map(stopIDsToHighlight, function(stop){ return '\t'+stop; });
		
		var inboundStopName = 'Central Station';
		
		Trip.find({route_id:req.params.routeID, service_id:'WD'}, function(e, trips){
			var allTripIDs = _.pluck(trips, 'trip_id');
			StopTime.find().where('trip_id').in(allTripIDs).where('stop_id').in(stopIDsToHighlightUnclean).sort('stop_sequence').exec(function(e, stopTimes){
				
				Stop.find().where('stop_id').in(stopIDsToHighlight).exec(function(e, stops){
					var returnTrips = _.map(trips, function(trip){
						
						var tripStops = _.filter(stopTimes, function(time){						
							return time.trip_id == trip.trip_id;
						});
						tripStops = _.map(tripStops, function(time){
							var timeString = time.departure_time.replace('\t','');
							
							return {
								STOP_ID: time.stop_id.replace('\t',''),
								TIME: timeString.replace(":00",""),
								TIME_IN_SECONDS: timeString != "" ? utils.timeToSeconds(timeString) : 86400
							}
						});
						
						
						return {
							ID: trip.trip_id,
							IS_INBOUND: trip.trip_headsign == inboundStopName ? true : false,
							STOP_TIMES: tripStops
						}
					});
					
					returnTrips = _.sortBy(returnTrips, function(trip){
						var earliestTime = _.sortBy(trip.STOP_TIMES, function(time){time.TIME_IN_SECONDS})[0].TIME_IN_SECONDS;
						return earliestTime;
					});
					
					
					var returnStops = _.map(stops, function(stop){
						return {
							ID:stop.stop_id+"",
							NAME: stop.stop_name
						};
					});
					
					var output = {
						STOPS: returnStops,
						TRIPS_OUT: _.filter(returnTrips, function(trip){return !trip.IS_INBOUND;}),
						TRIPS_IN: _.filter(returnTrips, function(trip){return trip.IS_INBOUND;})
					};
					//res.send(output);
					res.render('route', output);
				});
				
				
			});
		});
    });
};