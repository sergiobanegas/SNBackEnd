var mongoose = require('mongoose');
var Publication = mongoose.model('Publication');
var HTTPResponseError = require('./wrappers/errors/HTTPResponseError.js');
var HTTP400ResponseError = require('./wrappers/errors/HTTP400ResponseError.js');

exports.findAll = function(req, res) {
  Publication.find((err, publications) => {
    return err ? res.send(new HTTPResponseError(err.message, 500)) : res.status(200).jsonp(publications);
  }).select("-__v").populate("author", "-password -__v");
};

exports.findById = function(req, res) {
  Publication.findById(req.params.id, (err, publication) => {
    if (!publication) {
        return res.status(404).send(new HTTPResponseError(`The publication with the id ${req.params.id} doesn't exists`, 400));
    }
    return err ? res.send(new HTTPResponseError(err.message, 500)) : res.status(200).jsonp(publication);
  });
};

exports.add = function(req, res) {
  if (!req.body.title || !req.body.content || !req.body.privacity) {
    return res.status(400).send(new HTTP400ResponseError());
  }
  var publication = new Publication({
    title: req.body.title,
    content: req.body.content,
    author: req.user.id,
    privacity: req.body.privacity,
    image: req.body.image
  });
  publication.save((err, response) => {
    return err ? res.send(new HTTPResponseError(err.message, 500)) : res.status(200).jsonp(response);
  });
};

exports.update = function(req, res) {
  if (!req.body.title || !req.body.content || !req.body.privacity) {
    return res.status(400).send(new HTTP400ResponseError());
  }
  Publication.findById(req.params.id, (err, publication) => {
    if (err) return res.send(new HTTPResponseError(err.message, 500));
    if (!publication) {
      return res.status(404).send(new HTTPResponseError("The publication doesn't exists", 404));
    }
    publication.title = req.body.title;
    publication.content = req.body.content;
    publication.privacity = req.body.privacity;
    publication.save(error => {
      return error ? res.status(500).send(new HTTPResponseError(error.message, 500)) : res.status(200).jsonp(publication);
    });
  });
};

exports.delete = function(req, res) {
  Publication.findById(req.params.id, (err, publication) => {
    if (err) return res.status(500).send(new HTTPResponseError(err.message, 500));
    if (req.user.isAdmin || req.user.id !== publication.author) {
      return res.status(401).send(new HTTPResponseError("You don't have authorization to remove the post", 401));
    }
    if (!publication) {
      return res.status(404).send(new HTTPResponseError("The publication doesn't exists", 404));
    }
    publication.remove(error => {
      return error ? res.send(new HTTPResponseError(error.message, 500)) : res.status(204);
    });
  });
};
