var express = require('express');
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
var methodOverride = require("method-override");
var app = express();
var config = require("./config");
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(methodOverride());
app.use(cors());
app.set('port', 3000);

require('./app/models/user');
require('./app/models/post');
require('./app/models/comment');

var authRoutes = require("./app/routes/auth");
var router = require("./app/router");

app.use("/auth", authRoutes);
app.use("/api", router);

app.use(express.static('public'));

mongoose.connect(config.DB, (err, res) => {
  if (err) throw err;
  console.log('Connected to Database');
  app.listen(app.get('port'), () => {
    console.log(`Node server running on http://localhost:${app.get('port')}`);
  });
});
