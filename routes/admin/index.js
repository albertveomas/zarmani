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
var gift = require('../../schema/Gift');
var debt = require('../..//schema/debt');


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

  console.log(`Messenger is ${messengerId}, adminId is ${adminId}, code is ${code}`)

  AdminMessenger.find({messengerId}, function(err, admin){
    if(admin[0] === undefined){
      Admin.find({adminId}, function(err, admins){
        if(admins[0] === undefined){
          res.json({
            "messages": [
              {"text": "Admin Id is not found"}
            ]
          })
        }else{
          if(admins[0].code === code){
            if(admins[0].used){
              res.json({
                "messages": [
                  {"text": "this admin ID is used"}
                ]
              })
            }else{
              AdminMessenger.create({messengerId, adminId}, function(err, result){
                Admin.update({admin}, {$set: {used:true}}, function(err, updae){
                  res.json({
                    "messages": [
                      {"text": "Admin Register Success"},
                     
                    ],
                    "redirect_to_blocks": ["Admin"]
                  })
                })
               
              })
            }
          }else{
            res.json({
              "messages": [
                {"text": "Admin Code is wrong"}
              ]
            })
          }
        }
       
      })
    }else{
      res.json({
        "messages": [
          {"text": "Admin Already exists with this messenger ID"}
        ]
      })
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
          {"text": `Petrol Type ${type} with Pump ID ${pumpId} is registered`}
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
  let date = new Date (req.body.date);

  if(date == 'Invalid Date'){
    res.json({
      "messages": [
        {"text": "Date is invalid"}
      ]
       
      
    })
  }

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
      supplier.create({name,phone,debt,date}, function(err, result){
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
                  {"text": `You updated Price of Fuel ${Name} to ${price}`}
                ]
              })
            }
          })
        }
      })
    }
  })
 }) 

router.post('/check-debt', (req, res) => {
  let name = req.body.name;
  let messengerId = req.body["messenger user id"];
  
  AdminMessenger.find({messengerId}, function(err, admin) {
    if(admin[0] === undefined){
      res.json({
        "messages": [
          {"text": "You are not allowed"}
        ]
      })
    }else{
      supplier.find({name}, function(err, suppliers) {
        if(suppliers[0] === undefined){
          res.json({
            "messages": [
              {"text": "Supplier is not found"}
            ]
          })
        }else{
          res.json({
            "messages": [
              {"text": `Name: ${suppliers[0].name}\nDebt:${suppliers[0].debt} \nDate: ${suppliers[0].date.toDateString()}`}
            ]
          })
        }
      })
    }
  })
  
})


router.post('/edit-debt', function(req, res) {
  let name = req.body.name;
  let messengerId = req.body["messenger user id"];
  let debt = req.body.amount;
  let date = new Date(req.body.date);

  if(date == 'Invalid Date'){
    res.json({
      "messages": [
        {"text": "Date format is invalid"}
      ]
    })
  }
  
  AdminMessenger.find({messengerId}, function(err, admin) {
    if(admin[0] === undefined){
      res.json({
        "messages": [
          {"text": "You are not allowed"}
        ]
      })
    }else{
      supplier.find({name}, function(err, suppliers) {
        if(suppliers[0] === undefined){
          res.json({
            "messages": [
              {"text": "Supplier is not found"}
            ]
          })
        }else{
          supplier.updateOne({name}, {$set:{debt,date}}, function(err, result){
            if(result){
              res.json({
                "messages": [
                  {"text": `Debt amount ${debt} is updated`}
                ]
              })
            }
          })
        }
      })
    }
  })
  
})

router.post('/gift-reg', function(req, res) {
	let Name = req.body.name.toLowerCase();
	let point = req.body.point;
	let messengerId = req.body["messenger user id"];

  AdminMessenger.find({messengerId}, function(error, admin){
    if(admin[0] === undefined){
      res.json({
        "messages": [
          {"text": "You are not allowed"}
        ]
      })
    }else{
      gift.find({Name}, function(err, found){
        if(found[0] === undefined){
          gift.create({Name,point}, function(err, result){
            res.json({
              "messages": [
                {"text": "Gift added"}
              ]
            })
          })
        }else{
          res.json({
            "messages": [
              {"text": "Gift already existed"}
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
module.exports = router;