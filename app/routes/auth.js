var express = require('express');
var config = require('../../config');
var api = express.Router();
var authCtrl = require('../controllers/auth');
var router = express.Router();

router.post('/sign-up', authCtrl.emailSignUp);
router.post('/sign-in', authCtrl.emailSignIn);

module.exports = router;
