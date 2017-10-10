var express = require('express');
var router = express.Router();
var UserCtrl = require('../controllers/user');
var FriendCtrl = require('../controllers/friend');

router.route('/')
  .get(UserCtrl.findAll);

router.route('/:id')
  .get(UserCtrl.findById)
  .put(UserCtrl.update);

router.route('/friends')
  .get(FriendCtrl.findUserFriends)
  .post(FriendCtrl.acceptFriend)
  .delete(FriendCtrl.deleteFriend);

router.route('/friends/request')
  .post(FriendCtrl.requestFriend)
  .delete(FriendCtrl.deleteFriendRequest);

module.exports = router;
