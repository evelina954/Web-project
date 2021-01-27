var mongoose = require("mongoose");

var reservationSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String
});
var reservation = mongoose.model("reservation", reservationSchema);

module.exports.model = reservation;
module.exports.schema = reservationSchema;