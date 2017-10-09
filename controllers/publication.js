var mongoose = require('mongoose');
var Publication = mongoose.model('Publication');

exports.findAll = function(req, res) {
  Publication.find(function(err, publications) {
    if (err) res.send(500, err.message);
    console.log('GET /publications');
    res.status(200).jsonp(publications);
  }).select("-__v").populate("author", "-password -__v");
};

exports.findById = function(req, res) {
  Publication.findById(req.params.id, function(err, publication) {
    if (err) return res.send(500, err.message);
    console.log('GET /publications/' + req.params.id);
    res.status(200).jsonp(publication);
  });
};

exports.add = function(req, res) {
  var publication = new Publication({
    title: req.body.title,
    content: req.body.content,
    author: req.body.author_id,
    privacity: req.body.privacity,
    image: req.body.image
  });
  publication.save(function(err, response) {
    if (err) return res.send(500, err.message);
    res.status(200).jsonp(response);
  });
};

exports.update = function(req, res) {
  Publication.findById(req.params.id, function(err, publication) {
    publication.title = req.body.title;
    publication.content = req.body.content;
    publication.author = req.body.authorId;
    publication.privacity = req.body.privacity;
    publication.save(function(err) {
      if (err) return res.send(500, err.message);
      res.status(200).jsonp(publication);
    });
  });
};

exports.delete = function(req, res) {
  Publication.findById(req.params.id, function(err, publication) {
    publication.remove(function(err) {
      if (err) return res.send(500, err.message);
      res.json({
        message: 'Successfully deleted'
      });
    });
  });
};
