CREATE TABLE agency (agency_phone TEXT, agency_url TEXT, agency_id INTEGER, agency_name TEXT,  agency_timezone TEXT, agency_lang TEXT);
CREATE TABLE stops (stop_id INTEGER, stop_name TEXT, stop_lat REAL, stop_lon REAL, stop_url TEXT);
CREATE TABLE routes (route_id INTEGER, agency_id INTEGER, route_short_name TEXT, route_long_name TEXT,route_type INTEGER, route_color TEXT, route_text_color TEXT);
CREATE TABLE trips (route_id INTEGER,service_id INTEGER, trip_id INTEGER, trip_headsign TEXT, direction_id INTEGER,shape_id INTEGER);
CREATE TABLE stop_times (trip_id INTEGER, arrival_time TEXT, departure_time TEXT, stop_id INTEGER, stop_sequence INTEGER, stop_headsign TEXT, pickup_type INTEGER, drop_off_type INTEGER, shape_dist_traveled REAL);
CREATE TABLE calendar (service_id INTEGER,start_date TEXT,end_date TEXT, monday INTEGER,tuesday INTEGER,wednesday INTEGER,thursday INTEGER,friday INTEGER,saturday INTEGER,sunday INTEGER);
CREATE TABLE calendar_dates (service_id INTEGER, date TEXT, exception_type INTEGER);
CREATE TABLE shapes (shape_id INTEGER, shape_pt_lat REAL, shape_pt_lon REAL, shape_pt_sequence INTEGER);
.separator ,
.import calendar.txt calendar
.import agency.txt agency
.import calendar_dates.txt calendar_dates
.import routes.txt routes
.import shapes.txt shapes
.import stop_times2.txt stop_times
.import stops.txt stops
.import trips.txt trips