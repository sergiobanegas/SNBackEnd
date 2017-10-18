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
      $in: [req.user.id]
    }
  }, (err, conversations) => {
    return err ? res.send(new HTTPErrorResponse(err.message, 500)) : res.status(200).jsonp(conversations);
  }).select("_id updatedAt members").populate("members", "_id name avatar");
};

exports.findById = function(req, res) {
  Conversation.findById(req.params.id, (err, conversation) => {
    if (!conversation) {
      return res.status(404).send(new HTTPErrorResponse(`The conversation with the id '${req.params.id}' doesn't exist`, 404));
    }
    let exists = false;
    for (let member of conversation.members) {
      if (member._id == req.user.id) {
        exists = true;
      }
    }
    if (!exists) {
      return res.status(401).send(new HTTPErrorResponse("You are not member of the conversation"));
    }
    return err ? res.send(new HTTPErrorResponse(err.message, 500)) : res.status(200).jsonp(conversation);
  }).select("-__v").populate({
    path: 'messages',
    model: 'Message',
    select: "-__v",
    populate: {
      path: 'author',
      model: 'User',
      select: "name avatar _id"
    }
  }).populate("members", "_id name avatar");
};

exports.add = function(req, res) {
  if (!req.body.content || !req.body.members || req.body.members.length < 1 || req.body.members.indexOf(req.user.id) > -1) {
    return res.status(400).send(new HTTP400ErrorResponse());
  }
  for (let user of req.body.members) {
    User.findById(user, (err, response) => {
      if (!response) {
        return res.status(404).send(new HTTPErrorResponse(`The user with the id '${user}' doesn't exist`, 404));
      }
    });
  }
  let members = req.body.members;
  members.push(req.user.id);
  Conversation.find({
    $and: [
      {
        members: {
          $all: members
        }
      },
      {
        members: {
          $size: 2
        }
      }
    ]
  }, (err, conversations) => {
    if (conversations.length > 0) {
      return res.status(401).send(new HTTPErrorResponse(`You already have a conversation with that user`));
    }
    var conversation = new Conversation({
      members: members
    });
    conversation.save((err, response) => {
      if (err) {
        return res.send(new HTTPErrorResponse(err.message, 500));
      }
      Conversation.findById(conversation._id, (error, conversationCreated) => {
        if (err) {
          return res.send(new HTTPErrorResponse(err.message, 500));
        }
        var message = new Message({
          author: req.user.id,
          content: req.body.content,
          conversation: conversationCreated._id
        });
        message.save((err, response) => {
          if (err) return res.send(new HTTPErrorResponse(err.message, 500));
          conversationCreated.messages.push(message);
          conversationCreated.update({
            $push: {
              messages: response._id
            }
          }).then(response => {
            return response.ok != 1 ?
              res.status(500).send(new HTTPErrorResponse("Error deleting the user", 500)) :
              res.status(201).jsonp(conversationCreated);
          });
        });
      }).select("-__v");
    });
  });
};

exports.delete = function(req, res) {
  Conversation.findById(req.params.id, (err, conversation) => {
    if (err) return res.status(500).send(new HTTPErrorResponse(err.message, 500));
    if (!conversation) {
      return res.status(404).send(new HTTPErrorResponse("The conversation doesn't exists", 404));
    }
    if (conversation.members.indexOf(req.user.id) == -1) {
      return res.status(401).send(new HTTPErrorResponse("You don't have authorization to remove the conversation", 401));
    }
    conversation.remove(error => {
      return error ? res.send(new HTTPErrorResponse(error.message, 500)) : res.status(200).send(new HTTPSuccessResponse("Conversation deleted", 200));
    });
  });
};

exports.addMessage = function(req, res) {
  if (!req.body.content) {
    return res.status(400).send(new HTTP400ErrorResponse());
  }
  Conversation.findById(req.params.id, (err, conversation) => {
    if (conversation.members.indexOf(req.user.id) == -1) {
      return res.status(401).send(new HTTPErrorResponse("You are not a member of the conversation", 401));
    }
    if (err) return res.status(500).send(new HTTPErrorResponse(err.message, 500));
    if (!conversation) {
      return res.status(404).send(new HTTPErrorResponse("The conversation doesn't exists", 404));
    }
    var message = new Message({
      author: req.user.id,
      content: req.body.content,
      conversation: req.params.id
    });
    message.save((err, messageCreated) => {
      if (err) return res.send(new HTTPErrorResponse(err.message, 500));
      conversation.messages.push(messageCreated._id);
      conversation.save((err, response) => {
        if (err) return res.send(new HTTPErrorResponse(err.message, 500));
        Message.findById(messageCreated._id, (err, responseMessage) => {
          return err ?
            res.send(new HTTPErrorResponse(err.message, 500)) :
            res.status(201).jsonp(responseMessage);
        }).select("-__v").populate("author", "_id name avatar");
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
      if (conversation.members.indexOf(req.user.id) == -1) {
        return res.status(401).send(new HTTPErrorResponse("You are not a member of the conversation", 401));
      }
      if (conversation.members.indexOf(req.body.user_id) > -1) {
        return res.status(400).send(new HTTPErrorResponse("The user is already member of the conversation", 400));
      }
      conversation.members.push(req.body.user_id);
      conversation.save((err, response) => {
        return err ? res.send(new HTTPErrorResponse(err.message, 500)) : res.status(201).jsonp(response.members);
      });
    });
  });
};

exports.deleteMessage = function(req, res) {
  Message.findById(req.params.messageId, (error, message) => {
    if (error) return res.status(500).send(new HTTPErrorResponse(error.message, 500));
    if (message.author != req.user.id) {
      return res.status(401).send(new HTTPErrorResponse("You are not the owner of the message", 401));
    }
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
          res.status(200).send(new HTTPSuccessResponse("Conversation deleted", 200));
      });
    });
  });
};

exports.updateMessage = function(req, res) {
  if (!req.body.content) {
    return res.status(400).send(new HTTP400ErrorResponse());
  }
  Message.findById(req.params.messageId, (error, message) => {
    if (error) return res.status(500).send(new HTTPErrorResponse(error.message, 500));
    if (message.author != req.user.id) {
      return res.status(401).send(new HTTPErrorResponse("You are not the owner of the message", 401));
    }
    Message.update({
      _id: req.params.messageId
    }, {
      content: req.body.content
    }).then(response => {
      if (response.ok != 1) return res.status(500).send(new HTTPErrorResponse(error.message, 500));
      Message.findById(req.params.messageId, (err, response) => {
        return err ?
          res.status(500).send(new HTTPErrorResponse(error.message, 500)) :
          res.status(200).jsonp(response);
      }).select("-__v");
    });
  });
};

exports.deleteMessage = function(req, res) {
  Message.findById(req.params.messageId, (error, message) => {
    if (error) return res.status(500).send(new HTTPErrorResponse(error.message, 500));
    if (!message) return res.status(404).send(new HTTPErrorResponse(`There's no message with the id ${req.params.messageId}`, 404));
    if (message.author != req.user.id) {
      return res.status(401).send(new HTTPErrorResponse("You are not the owner of the message", 401));
    }
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
          res.status(200).send(new HTTPSuccessResponse("Message deleted", 200));
      });
    });
  });
};
