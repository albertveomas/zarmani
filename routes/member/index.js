var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var customer = require('../../schema/Customer');
var member = require('../../schema/Member');
var fuel = require('../../schema/Fuel');


// define the home page route
router.post('/register', function (req, res) {
	let messengerId = req.body["messenger user id"];
	let memberId = req.body.id;
	let code = req.body.code;

	member.find({memberId}, function(error, result) {
		if(result[0] === undefined){
			res.json({
				"messages": [
					{"text": "Member not found"}
				]
			})
		}else{
			if(code === result[0].code && result[0].memberConfirm === false){
				member.updateOne({memberId}, {$set: {memberConfirm: true}}, function(err, update){
					if(update){
						customer.create({messengerId,memberId}, function(err, customers){
							if(customers){
								res.json({
									"messages": [
									{"text": "Complete member registration for customers"}
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

router.post('/fuel-price/octane', function(req, res) {
	let messengerId = req.body["messenger user id"];
	let Name = req.body.octane;

	console.log(`Messenger id is ${messengerId}`)
	console.log(`Fuel is ${Name}`)
	customer.find({messengerId}, function(err, customers) {
		if(customers[0] === undefined){
			res.json({
				"messages": [
					{"text": "You are not allowed"}
				]
			})
		}else{
			fuel.find({Name}, (err, result) => {
				if(result){
					res.json({
						"messages": [
							{"text": `Octane price is ${result[0].price}`}
						]
					})
				}
			})
		}
	})
})
module.exports = router;