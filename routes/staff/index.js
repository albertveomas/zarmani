var express = require('express')
var router = express.Router()


// define the home page route
router.post('/create-member', function (req, res) {
  let id = req.body.ID;
  let name = req.body.name;
  let messengerId = req.body.messenger_user_id;
  console.log(`id is ${id}, name is ${name}, messenger is ${messengerId}`)
})
// define the about route
router.get('/about', function (req, res) {
 
})

module.exports = router;