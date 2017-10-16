var express = require('express');
var middleware = require('./middleware');
var router = express.Router();

var authRoutes = require("./routes/auth");
var userRoutes = require("./routes/users");
var friendRoutes = require("./routes/friends");
var postRoutes = require("./routes/posts");
var commentRoutes = require("./routes/comments");
var conversationRoutes = require("./routes/conversations");

router.use(middleware.ensureAuthenticated);
router.use('/users', userRoutes);
router.use('/friends', friendRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);
router.use('/conversations', conversationRoutes);

module.exports = router;
