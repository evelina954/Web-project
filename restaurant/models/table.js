var mongoose = require("mongoose");

const reservationSchema = require("./reservation").schema;

var tableSchema = new mongoose.Schema({
  name: String,
  capacity: Number,
  isAvailable: Boolean,
  reservation: {
    required: false,
    type: reservationSchema
  }
});
var table = mongoose.model("table", tableSchema);

module.exports.model = table;
module.exports.schema = tableSchema;