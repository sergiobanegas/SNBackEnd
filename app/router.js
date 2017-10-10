var express = require('express');
var middleware = require('./middleware');
var router = express.Router();

var authRoutes = require("./routes/auth");
var userRoutes = require("./routes/users");
var publicationRoutes = require("./routes/publications");

router.use(middleware.ensureAuthenticated);
router.use('/users', userRoutes);
router.use('/publications', publicationRoutes);

module.exports = router;
