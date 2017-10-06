var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
 name: { type: String },
 email: { type: String },
 genre: { type: String, enum: ['male', 'female'] },
 password: { type: String }
});

module.exports = mongoose.model('User', userSchema);
