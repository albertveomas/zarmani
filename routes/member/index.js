var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var customer = require('../../schema/Customer');
var member = require('../../schema/Member');


// define the home page route
router.post('/register', function (req, res) {
	let messengerID = req.body["messenger user id"];
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
				res.json({
					"messages": [
					{"text": "Both confirm"}
					]
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

module.exports = router;