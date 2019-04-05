var express = require('express');
var router = express.Router();
var Member = require('../../schema/Member');


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

module.exports = router;