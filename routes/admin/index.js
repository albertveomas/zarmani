var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Staff = require('../../schema/StaffCreate');
var Admin = require('../../schema/Admin');
var AdminMessenger = require('../../schema/adminMessenger');
var pump = require('../../schema/Pump');
var supplier = require('../../schema/Supplier');


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
          {"text": "admin not found"}
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

router.post('/pump-register', function(req,res) {
  let pumpId = req.body.pump;
  let type = req.body.type;

  pump.find({pumpId}, function(err, pumps){
    if(pumps[0] === undefined){
      pump.create({pumpId,type}, function(err, result){
        res.json({
          "messages": [
          {"text": `Petrol type ${type} with Pump ID ${pumpId} is registered`}
          ]
        })
      })
    }else{
      res.json({
        "messages": [
        {"text": "Pump ID is alreaday registered"}
        ]
      })
    }
  })
})

router.post('/supplier-register', function(req,res) {
  let name = req.body.name;
  let phone = req.body.phone;

  supplier.find({name}, function(err, suppliers){
    if(suppliers[0] === undefined){
      supplier.create({name,phone}, function(err, result){
        res.json({
          "messages": [
          {"text": `Supplier Name ${name} is registered Successfully`}
          ]
        })
      })
    }else{
      res.json({
        "messages": [
        {"text": "Supplier is alreaday registered"}
        ]
      })
    }
  })
})

router.post('/assign', function(req, res){
  let messengerId = req.body["messenger user id"];
  let staffId = req.body.ID;
  let pumpId = req.body.pumpId;
  let startDate = req.body.start;
  let endDate = req.body.end;
  let start = new Date(startDate);
  let end = new Date(endDate);


  if(start == 'Invalid Date' || end == 'Invalid Date'){
    res.json({
      "messages":[
        {"text": "Please check your start date and end date"}
      ]
    })
  }

  let admin = AdminMessenger.find({messengerId}, function(err, res){
    if(res[0] === undefined){
      return false
    }
    console.log(`Result is ${res[0]}`)
    return res[0]
  })

  console.log(`Admin is ${admin.messengerId}, ${admin.adminId}, ${Object.keys(admin)}`);
  // AdminMessenger.find({messengerId}, function(err, res){
  //   if(res[0]===undefined){
  //     res.json({
  //       "messages":[
  //         {"text": "You can\'t do admin task"}
  //       ]
  //     })
  //   }else{
  //     Staff.find({staffId}, function(err, staffs){
  //       if(staffs[0] === undefined){
  //         res.json({
  //           "messages":[
  //             {"text": "Staff not found"}
  //           ]
  //         })
  //       }
  //     })
  //   }
  // })
  


})
module.exports = router;