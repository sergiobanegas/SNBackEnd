var mongoose = require('mongoose');
var User = mongoose.model('User');
var Conversation = mongoose.model('Conversation');
var Message = mongoose.model('Message');

var HTTPErrorResponse = require('./wrappers/http/HTTPErrorResponse');
var HTTP400ErrorResponse = require('./wrappers/http/HTTP400ErrorResponse');
var HTTPSuccessResponse = require('./wrappers/http/HTTPSuccessResponse');

exports.findUserConversations = function(req, res) {
  Conversation.find({
    members: {
      $in: req.user.id
    }
  }, (err, conversations) => {
    return err ? res.send(new HTTPErrorResponse(err.message, 500)) : res.status(200).jsonp(conversations);
  }).select("-__v").populate("messages");
};

exports.findById = function(req, res) {
  Conversation.findById(req.params.id, (err, conversation) => {
    if (!conversation) {
      return res.status(404).send(new HTTPErrorResponse(`The conversation with the id '${req.params.id}' doesn't exist`, 404));
    }
    return err ? res.send(new HTTPErrorResponse(err.message, 500)) : res.status(200).jsonp(conversation);
  }).select("-__v").populate("messages");
};

exports.add = function(req, res) {
  if (!req.body.content || !req.body.members || req.body.members.length < 2) {
    return res.status(400).send(new HTTP400ErrorResponse());
  }
  for (let user of req.body.members) {
    User.findById(user, (err, response) => {
      if (!response) {
        return res.status(404).send(new HTTPErrorResponse(`The user with the id '${user}' doesn't exist`, 404));
      }
    });
  }
  var message = new Message({
    author: req.user.id,
    content: req.body.content
  });
  message.save((err, response) => {
    if (err) return res.send(new HTTPErrorResponse(err.message, 500));
    var conversation = new Conversation({
      members: req.body.members
    });
    conversation.messages.push(message);
    conversation.save((err, response) => {
      return err ? res.send(new HTTPErrorResponse(err.message, 500)) : res.status(201).jsonp(response);
    });
  });
};

exports.delete = function(req, res) {
  Conversation.findById(req.params.id, (err, conversation) => {
    if (err) return res.status(500).send(new HTTPErrorResponse(err.message, 500));
    if (!conversation) {
      return res.status(404).send(new HTTPErrorResponse("The conversation doesn't exists", 404));
    }
    if (req.user.isAdmin || conversation.members.indexOf(req.user.id) < -1) {
      return res.status(401).send(new HTTPErrorResponse("You don't have authorization to remove the conversation", 401));
    }
    conversation.remove(error => {
      return error ? res.send(new HTTPErrorResponse(error.message, 500)) : res.status(204).send(new HTTPSuccessResponse("Conversation deleted", 201));
    });
  });
};

exports.addMessage = function(req, res) {
  if (!req.body.content) {
    return res.status(400).send(new HTTP400ErrorResponse());
  }
  Conversation.findById(req.params.id, (err, conversation) => {
    if (conversation.members.indexOf(req.user.id) == -1) {
      return res.status(500).send(new HTTPErrorResponse("You are not a member of this conversation", 401));
    }
    if (err) return res.status(500).send(new HTTPErrorResponse(err.message, 500));
    if (!conversation) {
      return res.status(404).send(new HTTPErrorResponse("The conversation doesn't exists", 404));
    }
    var message = new Message({
      author: req.user.id,
      content: req.body.content
    });
    message.save((err, response) => {
      if (err) return res.send(new HTTPErrorResponse(err.message, 500));
      conversation.messages.push(response._id);
      conversation.save((err, response) => {
        return err ? res.send(new HTTPErrorResponse(err.message, 500)) : res.status(201).jsonp(response);
      });
    });
  });
};

exports.addMember = function(req, res) {
  if (!req.body.user_id) {
    return res.status(400).send(new HTTP400ErrorResponse());
  }
  User.findById(req.body.user_id, (err, user) => {
    if (err) return res.status(500).send(new HTTPErrorResponse(err.message, 500));
    if (!user) return res.status(400).send(new HTTPErrorResponse(`The user with the id ${req.body.user_id} doesn't exist`, 400));
    Conversation.findById(req.params.id, (err, conversation) => {
      if (err) return res.status(500).send(new HTTPErrorResponse(err.message, 500));
      if (!conversation) {
        return res.status(404).send(new HTTPErrorResponse("The conversation doesn't exists", 404));
      }
      if (conversation.members.indexOf(req.body.user_id) > -1) {
        return res.status(400).send(new HTTPErrorResponse("The user is already member of the conversation", 400));
      }
      conversation.members.push(req.body.user_id);
      conversation.save((err, response) => {
        return err ? res.send(new HTTPErrorResponse(err.message, 500)) : res.status(201).jsonp(response);
      });
    });
  });
};

exports.deleteMessage = function(req, res) {
  Conversation.update({
    _id: req.params.id
  }, {
    $pull: {
      messages: req.params.messageId
    }
  }).then(response => {
    if (response.ok != 1) return res.status(500).send(new HTTPErrorResponse(error.message, 500));
    Message.remove({
      _id: req.params.messageId
    }, err => {
      return err ?
        res.status(500).send(new HTTPErrorResponse(error.message, 500)) :
        res.status(204).send(new HTTPSuccessResponse("Conversation deleted", 201));
    });
  });
};

exports.updateMessage = function(req, res) {
  if (!req.body.content) {
    return res.status(400).send(new HTTP400ErrorResponse());
  }
  Message.update({
    _id: req.params.messageId
  }, {
    content: req.body.content
  }).then(response => {
    return (response.ok != 1) ?
      res.status(500).send(new HTTPErrorResponse(error.message, 500)) :
      res.status(204).send(new HTTPSuccessResponse("Conversation deleted", 201));
  });
};

exports.deleteMessage = function(req, res) {
  Conversation.update({
    _id: req.params.id
  }, {
    $pull: {
      messages: req.params.messageId
    }
  }).then(response => {
    if (response.ok != 1) return res.status(500).send(new HTTPErrorResponse(error.message, 500));
    Message.remove({
      _id: req.params.messageId
    }, err => {
      return err ?
        res.status(500).send(new HTTPErrorResponse(error.message, 500)) :
        res.status(204).send(new HTTPSuccessResponse("Conversation deleted", 201));
    });
  });
};
