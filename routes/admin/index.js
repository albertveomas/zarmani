var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Staff = require('../../schema/StaffCreate');
var Admin = require('../../schema/Admin');
var AdminMessenger = require('../../schema/adminMessenger');


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

router.post('/register', function (req, res) {
  let messengerId = req.body["messenger user id"];
  let adminId = req.body.id;
  let code = req.body.code;

  Admin.find({adminId}, function(error, result) {
    if(result[0] === undefined){
      res.json({
        "messages": [
          {"text": "staff not found"}
        ]
      })
    }else{
      if(code === result[0].code && result[0].used === false){
        Admin.updateOne({adminId}, {$set: {used: true}}, function(err, update){
          if(update){
            AdminMessenger.create({messengerId,adminId}, function(err, admins){
              if(admins){
                res.json({
                  "messages": [
                  {"text": "Complete member registration for Admin"}
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
          {"text": "Please ask database admin"}
          ]
        })
      }
    }
  })
})

module.exports = router;