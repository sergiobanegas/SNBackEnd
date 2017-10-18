var express = require('express');
var router = express.Router();
var config = require('../../config');
var AccountCtrl = require('../controllers/account');
var multer = require('multer');
var path = require('path');
var storage = multer.diskStorage({
  destination: "." + config.AVATARS_PATH,
  filename: function (req, file, cb) {
      cb(null, req.user.id + path.extname(file.originalname));
  }
})

var upload = multer({ storage: storage });

router.route('/')
  .put(AccountCtrl.update);

router.route('/password')
  .put(AccountCtrl.updatePassword);

router.route('/avatar')
  .put(upload.single('avatar'), AccountCtrl.updateAvatar);

module.exports = router;
