var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Staff = require('../../schema/StaffCreate');
var Admin = require('../../schema/Admin');
var AdminMessenger = require('../../schema/adminMessenger');
var pump = require('../../schema/Pump');
var supplier = require('../../schema/Supplier');
var assgin = require('../../schema/Assign');
var fuel = require('../../schema/Fuel');


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
  let type = (req.body.type).toLowerCase();

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
  let name = (req.body.name).toLowerCase();
  let phone = req.body.phone;
  let messengerId = req.body["messenger user id"];
  let debt = req.body.debt;

  AdminMessenger.find({messengerId}, function(err, admin) {
    if(admin[0] === undefined){
      res.json({
        "messages": [
        {"text": "You are not allowed"}
        ]
      })
    }else{
        supplier.find({name}, function(err, suppliers){
    if(suppliers[0] === undefined){
      supplier.create({name,phone,debt}, function(err, result){
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
    }
  })

})

router.post('/assign', function(req, res){
  let messengerId = req.body["messenger user id"];
  let staffId = req.body.ID;
  let pumpId = req.body.pump;
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

  
  AdminMessenger.find({messengerId}, function(err, admins){
    if(admins[0]===undefined){
      res.json({
        "messages":[
          {"text": "You can't do admin task"}
        ]
      })
    }else{
      Staff.find({staffId}, function(err, staffs){
        if(staffs[0] === undefined){
          res.json({
            "messages":[
              {"text": "Staff not found"}
            ]
          })
        }else{
          pump.find({pumpId}, function(err, pumps){
            if(pumps[0] === undefined){
              res.json({
                "messages":[
                  {"text": "pump not found"}
                ]
              })
            }else{
              assgin.create({messengerId,staffId,pumpId,start,end}, (err ,assigns) => {
              if(assigns){
                res.json({
                  "messages": [
                    {"text": `You set assign on Staff ID ${staffId}`}
                  ]
                })
              }
              })
            }
          })
        }
      })
    }
  })
  


})

router.post('/update-fuel', function(req,res) {
  let name = req.body.name;
  let Name = name.toLowerCase();
  let price = req.body.price;
  let messengerId = req.body["messenger user id"];

  AdminMessenger.find({messengerId}, (err, admin) => {
    if(admin[0] === undefined){
      res.json({
        "messages": [
          {"text": "You are not allowed to do this operation"}
        ]
      })
    }else{
      fuel.find({Name}, function(err, fuels){
        if(fuels[0] === undefined){
          res.json({
            "messages": [
              {"text": "Fuel Not found"}
            ]
          })
        }else{
          fuel.updateOne({Name}, {$set:{price}}, function(err, update){
            if(update){
              res.json({
                "messages": [
                  {"text": `You updated price of fuel ${Name} to ${price}`}
                ]
              })
            }
          })
        }
      })
    }
  })
  
rotuer.post('/check-debt', function(req, res) {
  let name = req.body.name;
  let messengerId = req.body["messenger user id"];

  AdminMessenger.find({messengerId}, function(err, admin){
    if(admin[0]=== undefined){
      res.json({
        "messages": [
        {"text": "You are not allowed"}
        ]
      })
    }else{
      supplier.find({name: {$regex: name}}, function(err, supplier) {
        if(supplier[0] === undefined){
          res.json({
            "messages": [
              {"text": "Supplier not found"}
              ]
              })
        }else{
          res.json({
            "messages": [
            {"text": `Name:${supplier[0].name}\nDebt: ${supplier[0].debt}`}
            ]
          })
        }
      })
    }
  })

})
  
})
module.exports = router;