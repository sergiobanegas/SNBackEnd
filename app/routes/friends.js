var express = require('express');
var router = express.Router();
var FriendCtrl = require('../controllers/friend');

router.route('/')
  .get(FriendCtrl.findUserFriends)
  .post(FriendCtrl.acceptFriend);

router.route("/requests")
  .post(FriendCtrl.requestFriend);

router.route('/requests-sent')
  .get(FriendCtrl.findUserFriendRequestsSent)
  .delete(FriendCtrl.deleteFriendRequestSent);

router.route('/requests-received')
  .get(FriendCtrl.findUserFriendRequestsReceived)
  .delete(FriendCtrl.deleteFriendRequestReceived);

router.route('/:id')
  .delete(FriendCtrl.deleteFriend);

module.exports = router;
