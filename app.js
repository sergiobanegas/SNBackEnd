var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');
var methodOverride = require("method-override");
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(methodOverride());
app.use(cors());
app.set('port', 3000);

require('./models/user');
require('./models/publication');

var authRoutes = require("./routes/auth");
var router = require("./router");

app.use("/auth", authRoutes);
app.use("/api", router);

mongoose.connect('mongodb://localhost/social-network', (err, res) => {
  if (err) throw err;
  console.log('Connected to Database');
  app.listen(app.get('port'), () => {
    console.log("Node server running on http://localhost:"+app.get('port'));
  });
});
