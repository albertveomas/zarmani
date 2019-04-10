var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Staff = require('../../schema/StaffCreate');
var StaffMessenger = require('../../schema/Staff');
var Assign = require('../../schema/Assign');
var customer = require('../../schema/Customer');
var Member = require('../../schema/Member');
var sale = require('../../schema/sale');

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
			Assign.find({staffId: staff[0].staffId}).sort({_id: -1})
			.then((assign) => {
				res.json({
					"messages": [
						{"text": 
						`You were assigned at PumpId ${assign[0].pumpId}
						 Start Date is ${(assign[0].start).toDateString()}
						 End Date is ${(assign[0].end).toDateString()}	
						`}
					]
				})
			})
		}
	})
})

router.post('/check-point', function(req, res) {
	let memberId = req.body.ID;

	sale.find({memberId}, function(err, member){
		if(member[0] === undefined){
			res.json({
				"messages": [
					{"text": `Member not found`}
				]
			})
		}else{
			res.json({
				"messages": [
					{"text": `The check point of Member ID ${memberId} is ${member[0].point}`}
				]
			})
		}
	})
})

router.post('/give-point', function(req,res){
	let messengerId = req.body["messenger user id"];
	let point = (req.body.liter)/10;
	let memberId = req.body.id;
	let date = new Date();

	customer.find({messengerId}, function(err, customers){
		if(customers[0]===undefined){
			res.json({
				"messages": [
					{"text": "You are not allowed"}
				]
			})
		}else{
			sale.find({memberId}, function(err, members){
				if(members[0] === undefined){
					sale.create({memberId,point,date}, function(err, sales){
						console.log(sales);
						if(sales){
							res.json({
								"messages": [
									{"text": `The points of memberID ${memberId} is now ${sales[0].point} `}
								]
							})
						}
					})
				}else{
					sale.updateOne({memberId}, {$set:{point,date}}, function(err, result) {
						console.log(`Resl is ${result[0]}`)
						if(result){
							res.json({
								"messages": [
									{"text": `The points of memberID ${memberId} is now ${result[0]} `}
								]
							})
						}
						
					
						
					})
				}
			})
		}
	})

})



module.exports = router;