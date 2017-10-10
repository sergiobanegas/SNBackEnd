var express = require('express');
var middleware = require('./middleware');
var router = express.Router();

var authRoutes = require("./routes/auth");
var userRoutes = require("./routes/users");
var postRoutes = require("./routes/posts");
var postCommentRoutes = require("./routes/post_comments");
var commentRepliesRoutes = require("./routes/post_comment_replies");
var commentReplyRepliesRoutes = require("./routes/post_comment_reply_replies");

router.use(middleware.ensureAuthenticated);
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/post-comments', postCommentRoutes);
router.use('/post-comment-replies', commentRepliesRoutes);
router.use('/post-comment-reply-replies', commentReplyRepliesRoutes);

module.exports = router;
