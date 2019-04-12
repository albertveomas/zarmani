var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var customer = require('../../schema/Customer');
var member = require('../../schema/Member');
var fuel = require('../../schema/Fuel');
var debt = require('../../schema/debt');
var receivedGift = require('../../schema/gitReceived');

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
			
			if(code == result[0].code && result[0].memberConfirm === false){
				member.updateOne({memberId}, {$set: {memberConfirm: true}}, function(err, update){
					if(update){
						customer.create({messengerId,memberId}, function(err, customers){
							if(customers){
								res.json({
									"messages": [
									{"text": "Complete member registration for customers"}
									],
									"redirect_to_blocks": ["Admin"]
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

router.post('/fuel-price/disel', function(req, res) {
	let messengerId = req.body["messenger user id"];
	let Name = req.body.disel;
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
							{"text": `Disel price is ${result[0].price}`}
						]
					})
				}
			})
		}
	})
})

router.post('/fuel-price/premimum', function(req, res) {
	let messengerId = req.body["messenger user id"];
	let Name = req.body.premimum;
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
							{"text": `Premimum price is ${result[0].price}`}
						]
					})
				}
			})
		}
	})
})

router.post('/view-debt', function(req, res) {
	let memberId = req.body.ID;

	debt.find({memberId}, function(err, debts){
		if(debts[0] === undefined){
			res.json({
				"messages": [
				{"text": "Member Not Found"}
				]
			})
		}else{
			res.json({
				"messages": [
				{"text": `Member ID:${debts[0].memberId}\n Amount:${debts[0].amount}\npumpId:${debts[0].pumpId}\nStaff ID:${debts[0].staffId}\nDate${debts[0].date.toDateString()}`}
				]
			})
		}
	})
})

router.post('/view-receivedGift', function(req, res) {
	let messengerId = req.body["messenger user id"];
	
	customer.find({messengerId}, function(err, customers){
		if(customers[0]=== undefined) {
			res.json({
				"messages": [
					{"text": "You are not allowed"}
				]
			})
		}else{
			receivedGift.find({memberId:customers[0].memberId}, function(err, gifts){
				if(gifts[0] === undefined){
					res.json({
						"messages": [
							{"text": "Gifts have not been accepted yet"}
						]
					})
				}else{
					res.json({
						"messages": [
							gifts.forEach((current, index, arr) => {
								return {"text": `Current ${current}`}
							})
						]
					})
				}
			})
		}
	})
})
module.exports = router;