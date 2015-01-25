CREATE TABLE agency (agency_phone TEXT, agency_url TEXT, agency_id INTEGER, agency_name TEXT,  agency_timezone TEXT, agency_lang TEXT);
CREATE TABLE stops (stop_lat REAL, stop_code INTEGER, stop_lon REAL, stop_id INTEGER, stop_url TEXT, parent_station INTEGER , stop_desc TEXT , stop_name TEXT, location_type INTEGER, zone_id INTEGER);
CREATE TABLE routes (route_long_name TEXT,route_type INTEGER,route_text_color TEXT,route_color TEXT,agency_id INTEGER,route_id INTEGER,route_url TEXT,route_desc TEXT, route_short_name TEXT);
CREATE TABLE trips (block_id INTEGER,route_id INTEGER,direction_id INTEGER,trip_headsign TEXT,shape_id INTEGER,service_id INTEGER,trip_id INTEGER);
CREATE TABLE stop_times (trip_id INTEGER, arrival_time TEXT, departure_time TEXT, stop_id INTEGER, stop_sequence INTEGER, stop_headsign TEXT, pickup_type INTEGER, drop_off_type INTEGER, shape_dist_traveled REAL);
CREATE TABLE calendar (service_id INTEGER,start_date TEXT,end_date TEXT, monday INTEGER,tuesday INTEGER,wednesday INTEGER,thursday INTEGER,friday INTEGER,saturday INTEGER,sunday INTEGER);
CREATE TABLE calendar_dates (service_id INTEGER, date TEXT, exception_type INTEGER);
CREATE TABLE shapes (shape_id INTEGER, shape_pt_lat REAL, shape_pt_lon REAL, shape_pt_sequence INTEGER, shape_dist_traveled REAL);
.separator ,
.import calendar.txt calendar
.import agency.txt agency
.import calendar_dates.txt calendar_dates
.import routes.txt routes
.import shapes.txt shapes
.import stop_times.txt stop_times
.import stops.txt stops
.import trips.txt trips