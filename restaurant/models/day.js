var mongoose = require("mongoose");
const tableSchema = require("./table").schema;

var daySchema = new mongoose.Schema({
  date: Date,
  tables: [tableSchema]
});
var day = mongoose.model("day", daySchema);

module.exports.model = day;
module.exports.schema = daySchema;