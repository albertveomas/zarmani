var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Member = require('../../schema/Member');
var Staff = require('../../schema/StaffCreate');
var StaffMessenger = require('../../schema/Staff');
var Assign = require('../../schema/Assign');

// define the home page route
router.post('/create-member', function (req, res) {
  let memberId = req.body.ID;
  let Name = req.body.name;
  let code = req.body.code;
  let memberConfirm = false;


  Member.find({memberId}, function(err, member){
  	if(member[0] === undefined){
  		Member.create({memberId,Name,code,memberConfirm}, function(err, result){
  			if(result){
  				console.log(result);
  				res.json({
  					"messages": [
  					{"text": "Member Created Successfully"}
  					]
  				})
  			}
  		})
  	}else{
  		res.json({
  			"messages":[
  			{"text": "This member is already existed"}
  			]
  		})
  	}
  })
})

router.post('/register', function (req, res) {
	let messengerId = req.body["messenger user id"];
	let staffId = req.body.id;
	let code = req.body.code;

	Staff.find({staffId}, function(error, result) {
		if(result[0] === undefined){
			res.json({
				"messages": [
					{"text": "staff not found"}
				]
			})
		}else{
			if(code === result[0].code && result[0].staffConfirm === false){
				Staff.updateOne({staffId}, {$set: {staffConfirm: true}}, function(err, update){
					if(update){
						StaffMessenger.create({messengerId,staffId}, function(err, staffs){
							if(staffs){
								res.json({
									"messages": [
									{"text": "Complete member registration for staff"}
									]
								})
							}
						})
					}
				})
			}else{
				res.json({
					"messages": [
					{"text": "The Enter Code is Wrong or you are already registered"},
					{"text": "Please ask adminstrator"}
					]
				})
			}
		}
	})
})

router.post('/view-assign/', function(req, res) {
	let messengerId = req.body["messenger user id"];
	console.log(`Messenger id is ${messengerId}`)

	StaffMessenger.find({messengerId}, function(err, staff){
		if(staff[0] === undefined){
			res.json({
				"messages": [
					{"text": "You are not allowed to do"}
				]
			})
		}else{
			Assign.find({stafId: staff[0].staffId}, function(err, assign){
				if(assign){
					res.json({
						"messages": [
							{"text": 
							`You were assigned at PumpId ${assgin[0].pumpId}
							 Start Date is ${assign[0].start}
							 End Date is ${assign[0].end}	
							`}
						]
					})
				}
			})
		}
	})
})

module.exports = router;