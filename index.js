const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const user = require('./user');
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
const db = "mongodb://hninwaioo:hninwaioo123@ds131296.mlab.com:31296/zarmani";
const admin = require('./admin/index.js');
const member = require('./member/index.js');
const staff = require('./staff/index.js');



app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err))


app.post('/', (req,res) =>{
	let name =req.body.name;
	console.log(name);
	user.create({name}, (err, result) =>{
		if(result) {
					res.json({
 "messages": [
   {"text": "Welcome to the Chatfuel Rockets!"},
   {"text": "What are you up to?"}
 ]
})
		}
	})

})


app.use('/admin', admin);
app.use('/member', member);
app.use('/staff', staff);


app.listen(port, () => {console.log(`server started`)});