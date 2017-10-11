var express = require('express');
var router = express.Router();
var FriendCtrl = require('../controllers/friend');

router.route('/')
  .get(FriendCtrl.findUserFriends)
  .post(FriendCtrl.acceptFriend)
  .delete(FriendCtrl.deleteFriend);

router.route('/requests')
  .get(FriendCtrl.findUserFriendRequests)
  .post(FriendCtrl.requestFriend)
  .delete(FriendCtrl.deleteFriendRequest);

module.exports = router;
