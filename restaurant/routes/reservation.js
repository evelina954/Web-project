const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Day = require("../models/day").model;
const Reservation = require("../models/reservation").model;
const urlencodedParser = bodyParser.urlencoded({extended: false});
// Parameters:
// {
// 	"name": String,
// 	"phone": String,
// 	"email": String
//  "date": String ("01-01-2021"),
//  "time": String("14:00")
//  "table": Number
// }
const dir = __dirname;
var dirLength = dir.length;
const availTime = ["14:00", "18:00", "22:00"];
router.post("/", urlencodedParser,function(req, res, next) {
  //console.log(req.body);
  if(!req.body) 
    return res.sendStatus(400);

  let date = req.body.date.split("-");
  let time = req.body.time.split(":");

  if (availTime.indexOf(req.body.time) == -1) {
   console.log("Time not available");
   res.status(200).sendFile(dir.substring(0, dirLength-7) + "/views/time_not_avail.html");
  }
  else {
    //console.log(new Date(parseInt(date[0]), parseInt(date[1])-1, parseInt(date[2]), parseInt(time[0])));
    Day.find({ date: new Date(parseInt(date[0]), parseInt(date[1])-1, parseInt(date[2]), parseInt(time[0]),parseInt(time[1])) }, (err, days) => {      
    if (!err) {
        let day = days[0];
        day.tables.forEach(table => {
          if (table.name == "Столик №" + req.body.table) {
            if (table.isAvailable) {
              //Резервируем столик
              table.reservation = new Reservation({
                name: req.body.name,
                phone: req.body.phone,
                email: req.body.email
              });
              table.isAvailable = false;

              day.save(err => {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log("Reserved");
                    res.status(200).sendFile(dir.substring(0, dirLength-7) + "/views/yes_reservation.html");
                  }
               });
            }
            else {
              console.log("Table is busy");
              res.status(200).sendFile(dir.substring(0, dirLength-7) + "/views/table_busy.html");
            }
          }
        });
      }
    });
  }
});

module.exports = router;