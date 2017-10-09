var express = require('express');
var router = express.Router();
var PublicationCtrl = require('../controllers/publication');

router.route('/')
  .get(PublicationCtrl.findAll)
  .post(PublicationCtrl.add);

router.route('/:id')
  .get(PublicationCtrl.findById)
  .put(PublicationCtrl.update)
  .delete(PublicationCtrl.delete);

module.exports = router;
