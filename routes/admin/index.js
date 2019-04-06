var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Staff = require('../../schema/StaffCreate');


// define the home page route
router.post('/staff-register', function (req, res) {
  let staffId = req.body.id;
  let Name = req.body.name;
  let code = req.body.code;
  let phone = req.body.phone;
  let staffConfirm = false;


  Staff.find({staffId}, function(err, staff){
  	if(staff[0] === undefined){
  		Staff.create({staffId,Name,code,staffConfirm,phone}, function(err, result){
  			if(result){
  				console.log(result);
  				res.json({
  					"messages": [
  					{"text": "Staff Created Successfully"}
  					]
  				})
  			}
  		})
  	}else{
  		res.json({
  			"messages":[
  			{"text": "This Staff is already existed"}
  			]
  		})
  	}
  })



})

module.exports = router;