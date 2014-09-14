var mongoose = require('mongoose');
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
};