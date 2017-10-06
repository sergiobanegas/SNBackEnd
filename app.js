var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');
var methodOverride = require("method-override");
var middleware = require('./middleware');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(methodOverride());
app.use(cors());
app.set('port', 3000);
require('./models/user')(app, mongoose);

var authRoutes = require("./routes/auth");
var userRoutes = require("./routes/user");
var router = express.Router();
router.use(middleware.ensureAuthenticated);
router.use('/users', userRoutes);
app.use("/auth", authRoutes);
app.use("/api", router);

mongoose.connect('mongodb://localhost/users', (err, res) => {
  if (err) throw err;
  console.log('Connected to Database');
  app.listen(app.get('port'), () => {
    console.log("Node server running on http://localhost:"+app.get('port'));
  });
});
