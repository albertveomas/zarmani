const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const user = require('./user');
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
const db = "mongodb://hninwaioo:hninwaioo123@ds131296.mlab.com:31296/zarmani";
const admin = require('./routes/admin/index.js');
const member = require('./routes/member/index.js');
const staff = require('./routes/staff/index.js');
const admindb = require('./schema/Admin');



app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err))

app.get('/', function(req, res) {
	let adminId = req.body.adminId;
	let code = req.body.code;

	Admin.create({adminId,code}, (err, result) => {
		if(result){
			res.json(result);
		}
	})

})



app.use('/admin', admin);
app.use('/member', member);
app.use('/staff', staff);


app.listen(port, () => {console.log(`server started`)});