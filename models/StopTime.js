var mongoose = require('mongoose')
  , utils = require('../lib/utils')
  , StopTime = mongoose.model('StopTime', new mongoose.Schema({
        agency_key        :  { type: String, index: true }
      , trip_id           :  { type: String, index: true }
      , arrival_time      :  { type: String }
      , departure_time    :  { type: String}
      , stop_id           :  { type: String, index: true }
      , stop_sequence     :  { type: Number, index: true }
      , stop_headsign     :  { type: String }
      , pickup_type       :  { type: String }
      , drop_off_type     :  { type: String }
      , shape_dist_traveled :  { type: String }
    }));
