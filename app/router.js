var express = require('express');
var middleware = require('./middleware');
var router = express.Router();

var authRoutes = require("./routes/auth");
var userRoutes = require("./routes/users");
var postRoutes = require("./routes/posts");

router.use(middleware.ensureAuthenticated);
router.use('/users', userRoutes);
router.use('/posts', postRoutes);

module.exports = router;
