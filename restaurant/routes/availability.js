const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({extended: false});
const Day = require("../models/day").model;
// Parameters:
// {
//   "date": String ("01-01-2020")
// }
const availTime = [14, 18, 22];
router.post("/", urlencodedParser,function(req, res, next) {
  console.log(req.body);
  if(!req.body) 
    return res.sendStatus(400);
  let date = req.body.date.split("-");  
  let result1 = []; 
  let result2 = []; 
  let result3 = []; 
  
    Day.findOne({ date: new Date(parseInt(date[0]), parseInt(date[1])-1, parseInt(date[2]), 14, 0) }, (err, day) => { 
    if (!err) {
      //result1 += "14 hour: "
        day.tables.forEach(table => {            
            if (table.isAvailable) {
            result1.push(table.name);               
            }         
        });
        Day.findOne({ date: new Date(parseInt(date[0]), parseInt(date[1])-1, parseInt(date[2]), 18, 0) }, (err, day) => { 
        if (!err) {
           //result2 += "18 hour: "
            day.tables.forEach(table => {
                if (table.isAvailable) {
                result2.push(table.name);            
                  
                }                
            });
            Day.findOne({ date: new Date(parseInt(date[0]), parseInt(date[1])-1, parseInt(date[2]), 22, 0) }, (err, day) => { 
            if (!err) {
               //result3 += "22 hour: "
                day.tables.forEach(table => {
                    if (table.isAvailable) {
                    result3.push(table.name);                                
                    }                   
                });
            res.render("tables.hbs", {result1:result1, result2:result2, result3:result3, 
              hour1: "14:00", hour2: "18:00", hour3: "22:00"});
            }
          });
          //res.send(result);
        }
      });
      //res.send(result);
    }
  }); 
});

module.exports = router;