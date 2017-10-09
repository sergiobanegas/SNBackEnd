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
  .post(FriendCtrl.addFriend)
  .delete(FriendCtrl.deleteFriend);

module.exports = router;
