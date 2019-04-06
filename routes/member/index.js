var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var customer = require('../../schema/Customer');
var member = require('../../schema/Member');


// define the home page route
router.post('/register', function (req, res) {
	let messengerID = req.body["messenger user id"];
	let memberId = req.body.id;

	member.find({memberId}, function(error, result) {
		if(result[0] === undefined){
			res.json({
				"messages": [
					{"text": "Member not found"}
				]
			})
		}else{
			customer.create({messengerID,memberId}, function(err, customer){
				if(customer){
					res.json({
						"messages": [
							{"text": "Customer is created with the MemberID"}
						]
					})
				}
			})
		}
	})
})

module.exports = router;