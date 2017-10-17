var express = require('express');
var crypto = require('crypto');
var config = require('../../config');
var api = express.Router();
var authCtrl = require('../controllers/auth');
var router = express.Router();
var multer = require('multer')
var path = require('path');
var storage = multer.diskStorage({
  destination: "." + config.AVATARS_PATH,
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err)
      cb(null, raw.toString('hex') + path.extname(file.originalname))
    })
  }
})

var upload = multer({ storage: storage })

router.post('/signup', upload.single('avatar'), authCtrl.emailSignup);
router.post('/login', authCtrl.emailLogin);

module.exports = router;
