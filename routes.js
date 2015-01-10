var mongoose = require('mongoose');
var _ = require('underscore');
var utils = require('./lib/utils');
//var db = mongoose.connect('mongodb://localhost:27017/gtfs');

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

//var Agency = db.model('Agency')
//  , Calendar = db.model('Calendar')
//  , Route = db.model('Route')
//  , Stop = db.model('Stop')
//  , StopTime = db.model('StopTime')
//  , Trip = db.model('Trip')
//  , Calendar = db.model('Calendar');

var agencyKey = 'birmingham-jefferson-county-transit-authority';


module.exports = function routes(app){
	app.get('/', function(req, res) {
		res.render('route3', {});
    });
	app.get('/print', function(req, res) {
		res.render('printable', {});
    });
	
	app.get('/stops/', function(req, res){
		var r = {
			map: function(){
				emit(this.stop_id, this.trip_id);
			},
			reduce: function(stopID, tripCollection){
				
				return tripCollection.length;
			},
			finalize: function(stopID, tripValue){
				return isNumber(tripValue) ? tripValue : 1;
			}
			
		};
		
		StopTime.mapReduce(r, function(error, results){
			results = _.sortBy(results, function(res){
				var valInt = res.value;
				
				return isNaN(valInt) ? 0 : valInt;
			});
			results = results.reverse();

			var limit = 10;
			var returnResults = [];
			var stopIDs = [];
			for(var i = 0; i<limit; i++){
				stopIDs.push(results[i]["_id"]);
			}
				
				Stop.find().where("stop_id").in(stopIDs).exec(e, function(matchingStop){
					
					res.send(matchingStop);
				});
			
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
				_.each(stopTimes, function(time){ if(time.stop_id == "\t18024") console.log(time);});
				Stop.find().where('stop_id').in(stopIDsToHighlight).exec(function(e, stops){
					
					var inTrips = [];
					var outTrips = [];
					var inStops = [];
					var outStops = [];
					
					
					_.each(trips, function(trip){
						
						var tripStopTimes = _.filter(stopTimes, function(time){	
							
							return time.trip_id == trip.trip_id;
						});
						

						var newStopTimes = [];
						
						_.each(stops, function(stop){
							var currentStopID = stop.stop_id.replace('\t','');
							
							var matchingTime = _.find(tripStopTimes, function(time){ return time.stop_id.replace('\t','') == currentStopID});
				
														
							var newStopTime = {
								TIME: '',
								TIME_IN_SECONDS: 86400,
								STOP_ID: currentStopID,
								SEQUENCE: 666
							};
							if(matchingTime != undefined){
								var timeString = matchingTime.departure_time.replace('\t','');
								newStopTime = {
									STOP_ID: currentStopID,
									TIME: timeString.replace(":00",""),
									TIME_IN_SECONDS: timeString != "" ? utils.timeToSeconds(timeString) : 86400,
									SEQUENCE: matchingTime.stop_sequence
								};

							}
							
							var stopCollection = outStops;
								if(trip.trip_headsign == inboundStopName){
									stopCollection = inStops;
									//if(currentStopID == "18024") console.log("inbound: " + matchingTime != undefined);
								}
								
								
								var existingOrderedStop = _.find(stopCollection, function(orderedStop){
									return orderedStop.ID == currentStopID;
								});
								//if(trip.trip_headsign == inboundStopName && currentStopID =="18024") console.log(existingOrderedStop);
							
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
							
							newStopTimes.push(newStopTime);
							
						});

						var newTrip = {
							ID: trip.trip_id,
							STOP_TIMES: newStopTimes
						};
						
						
						var tripCollection = outTrips;
						
						if(trip.trip_headsign == inboundStopName){
							tripCollection = inTrips;
						}
						tripCollection.push(newTrip);
						
						
					});
					
					var sortTripsForOutput = function(outputTrips, outputStops){
						
						var returnTrips = outputTrips;
						
						_.each(returnTrips, function(trip){ 
							trip.STOP_TIMES = _.sortBy(trip.STOP_TIMES, function(time) {
								var matchingStop = _.find(outputStops, function(stop){ return stop.ID == time.STOP_ID; });
								
								return matchingStop ? matchingStop.EARLIEST_SEQUENCE : 0;
							}); 
						});
						
						returnTrips = _.sortBy(outputTrips, function(trip){
							var sortedTimes = _.sortBy(trip.STOP_TIMES, function(time){time.TIME_IN_SECONDS});
							var earliestTime = sortedTimes[sortedTimes.length - 1].TIME_IN_SECONDS;
							return earliestTime;
						});
						
						return returnTrips;
						
					};
					var sortStopsForOutput = function(outputStops){
						var returnStops = outputStops;
						
						returnStops = _.sortBy(returnStops, function(stop){
							return stop.EARLIEST_SEQUENCE;
						});
						
						return returnStops;
					};
					
					outTrips = sortTripsForOutput(outTrips, outStops);
					outStops = sortStopsForOutput(outStops);
					
					inTrips = sortTripsForOutput(inTrips, inStops);
					inStops = sortStopsForOutput(inStops);

					var output = {
						IN_TRIPS:  inTrips,
						OUT_TRIPS: outTrips,
						IN_STOPS: inStops,
						OUT_STOPS: outStops,
					};
					
					res.render('route', output);
				});
				
				
			});
		});
    });
};