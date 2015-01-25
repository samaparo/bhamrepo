var _ = require('underscore');

var agencyKey = 'birmingham-jefferson-county-transit-authority';


module.exports = function routes(app){
	app.get('/', function(req, res) {
		res.render('route3', {});
    });
	
	app.get('/stops/:routeID', function(req, res) {
		
    });
};