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
					
					var inTrips = [];
					var outTrips = [];
					var inStops = [];
					var outStops = [];
					
					
					_.each(trips, function(trip){
						
						var tripStopTimes = _.filter(stopTimes, function(time){						
							return time.trip_id == trip.trip_id;
						});
						//tripStopTimes _.sortBy(tripStopTimes, function(time){ return });
						
						var newStopTimes = [];
						
						_.each(stops, function(stop){
							var matchingTime = _.find(tripStopTimes, function(time){ return time.stop_id.replace('\t','') == stop.stop_id.replace('\t','')});
							
							
							var newStopTime = {
								TIME: '',
								TIME_IN_SECONDS: 86400,
								STOP_ID: stop.stop_id
							};
							if(matchingTime != undefined){
								var timeString = matchingTime.departure_time.replace('\t','');
								newStopTime = {
									STOP_ID: stop.stop_id.replace('\t',''),
									
									TIME: timeString.replace(":00",""),
									TIME_IN_SECONDS: timeString != "" ? utils.timeToSeconds(timeString) : 86400,
									SEQUENCE: matchingTime.stop_sequence
								};
								
								var stopCollection = outStops;
								if(trip.trip_headsign == inboundStopName){
									stopCollection = inStops;
								}
								var currentStopID = stop.stop_id.replace('\t','');
								var existingOrderedStop = _.find(stopCollection, function(orderedStop){
									return orderedStop.ID == currentStopID;
								});
							
								if(existingOrderedStop && newStopTime.SEQUENCE < existingOrderedStop.EARLIEST_SEQUENCE){
									existingOrderedStop.EARLIEST_SEQUENCE = newStopTime.SEQUENCE;
								}
								else if(existingOrderedStop == undefined){
									stopCollection.push({
										ID: currentStopID,
										NAME: stop.stop_name,
										EARLIEST_SEQUENCE: newStopTime.SEQUENCE
									});
								}
								
							}
							
							newStopTimes.push(newStopTime);
							
						});
						
						
						
						
						var newTrip = {
							ID: trip.trip_id,
							STOP_TIMES: newStopTimes
						};
						
						
						var tripCollection = outTrips;
						
						if(trip.trip_headsign == inboundStopName){
							tripCollection = inTrips;
							stopCollection = inStops;
						}
						tripCollection.push(newTrip);
						
						
						
						
					});
					
					_.each(outTrips, function(trip){ 
						trip.STOP_TIMES = _.sortBy(trip.STOP_TIMES, function(time) {
							var matchingStop = _.find(outStops, function(stop){ return stop.ID == time.STOP_ID; });
							return matchingStop.EARLIEST_SEQUENCE;
						}); 
					});
					
//					inTrips = _.sortBy(inTrips, function(trip){
//						var sortedTimes = _.sortBy(trip.STOP_TIMES, function(time){time.TIME_IN_SECONDS});
//						var earliestTime = sortedTimes[sortedTimes.length - 1].TIME_IN_SECONDS;
//						return earliestTime;
//					});
					
					outStops = _.sortBy(outStops, function(stop){
						return stop.EARLIEST_SEQUENCE;
					});
					console.log(outStops);
					outTrips = _.sortBy(outTrips, function(trip){
						var sortedTimes = _.sortBy(trip.STOP_TIMES, function(time){time.TIME_IN_SECONDS});
						var earliestTime = sortedTimes[sortedTimes.length - 1].TIME_IN_SECONDS;
						
						return earliestTime;
					});
					
					
					
					var output = {
						IN_TRIPS:  [],
						OUT_TRIPS: outTrips,
						IN_STOPS: [],
						OUT_STOPS: outStops,
					};
					//res.send(output);
					res.render('route', output);
				});
				
				
			});
		});
    });
};