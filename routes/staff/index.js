var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Staff = require('../../schema/StaffCreate');
var StaffMessenger = require('../../schema/Staff');
var Assign = require('../../schema/Assign');
var customer = require('../../schema/Customer');
var Member = require('../../schema/Member');
var sale = require('../../schema/sale');
var Gift = require('../../schema/Gift');
var debt = require('../../schema/debt');
var giftReceived = require('../../schema/gitReceived');

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
									],
									"redirect_to_blocks": ["Staff"]
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
					{"text": `Member ID ${memberId} have (${member[0].point}) points`}
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

	StaffMessenger.find({messengerId}, function(err, customers){
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
									{"text": `The points of memberID ${memberId} have now ${sales[0].point} points`}
								]
							})
						}
					})
				}else{
					sale.updateOne({memberId}, {$set: {point:members[0].point+point,date}}, (err, sales) =>{
						res.json({
							"messages": [
								{"text": `The points of memberID ${memberId} have now ${members[0].point+point} points`}
							]
						})
					})
				}
			})
		}
	})

})


router.post('/edit-debt', function(req,res) {
	let memberId = req.body.ID;
	let amount = req.body.amount;
	let messengerId = req.body["messenger user id"];
	let pumpId = req.body.id;
	let date = new Date();

	StaffMessenger.find({messengerId}, function(err, staff){
		if(staff[0] === undefined){
			res.json({
				"messages": [
				{"text": "You are not allowed"}
				]
			})
		}else{
				debt.find({memberId}, function(err, debts){
		if(debts[0] === undefined){
			debt.create({memberId,amount,date,pumpId,staffId:staff[0].staffId}, function(err, result){
				if(result){
					res.json({
						"messages": [
						{"text": `The Debt of Member ID ${memberId} is ${amount}`}
						]
					})
				}
			})
		}else{
			debt.updateOne({memberId}, {$set: {amount,date,pumpId,staffId:staff[0].staffId}}, function(err, cor){
				if(cor){
					res.json({
						"messages": [
						{"text": `Successful update, Debt amount is ${amount}`}
						]
					})
				}
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
				{"text": `Member ID:${debts[0].memberId}\nAmount:${debts[0].amount}\nPump No:${debts[0].pumpId}\nStaff ID:${debts[0].staffId}\nDate:${debts[0].date.toDateString()}`}
				]
			})
		}
	})
})

router.post('/give-gift', function(req, res) {
	let memberId = req.body.id;
	let Name = req.body.gift;
	let code = req.body.code;
	let date = new Date();
	let messengerId = req.body["messenger user id"];

	StaffMessenger.find({messengerId}, function(err, staffs){
		console.log(`staff ${staffs}`)
		if(staffs[0] === undefined){
			res.json({
				"messages": [
					{"text": `You are not allowed to do`}
				]
			})
		}else{
			Member.find({memberId}, function(err, members){
				if(members[0] === undefined){
					res.json({
						"messages": [
							{"text": "MemberID is not found"}
						]
					})
				}else{
					if(code == members[0].code){
						Gift.find({Name}, function(err, gifts){
							if(gifts[0] === undefined){
								res.json({
									"messages": [
										{"text": "Gift name is wrong"}
									]						
								})
							}else{
								sale.find({memberId}, function(err, results){
									if(results[0] === undefined){
										res.json({
											"messages": [
												{"text": "You don't have any point. Please purchase some petrol and you will get point"}
											]
										})
									}else{
										if (results[0].point >= gifts[0].point) {
											sale.updateOne({ memberId }, { $set: { point: results[0].point - gifts[0].point } }, function (err, update) {
												giftReceived.create({ memberId, gift: Name, date }, function (err, received) {
													if (received) {
														res.json({
															"messages": [
																{ "text": `The point is now ${results[0].point - gifts[0].point}` }
															]
														})
													}
												})
											})
										} else {
											res.json({
												"messages": [
													{ "text": `Point ${gifts[0].point - results[0].point} is left to have ${gifts[0].Name}` }
												]
											})
										}
									}
								})
							}
						})
					}else{
						console.log('wrong')
					}
				}
			})
		}
	})

})


module.exports = router;