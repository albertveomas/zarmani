const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
const db = "mongodb://hninwaioo:hninwaioo123@ds131296.mlab.com:31296/zarmani";
const admin = require('./routes/admin/index.js');
const member = require('./routes/member/index.js');
const staff = require('./routes/staff/index.js');
const fuel = require('./schema/Fuel');



app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err))


app.get('/', (req,res) => {
  let Name = req.body.name;
  let price = req.body.price;

  fuel.create({Name,price}, (err, result) => {
    res.json(result);
  })


})

app.use('/admin', admin);
app.use('/member', member);
app.use('/staff', staff);


app.listen(port, () => {console.log(`server started`)});