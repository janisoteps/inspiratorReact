//model/users.js
'use strict';
//import dependency
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//create new instance of the mongoose.schema. the schema takes an
//object that shows the shape of your database entries.

var userSchema = new Schema({
  name: String,
  fbId: String,
  recOwner: Array,
  recFriend: Array,
  favFriends: Array
});
//export our module to use in server.js
module.exports = mongoose.model('Users', userSchema);
