var express = require('express');
var router = express.Router();
var UserCtrl = require('../controllers/user');

router.route('/')
  .get(UserCtrl.findAll);

router.route('/:id')
  .get(UserCtrl.findById)
  .put(UserCtrl.update);

module.exports = router;
