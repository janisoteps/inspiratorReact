//model/recipes.js
'use strict';
//import dependency
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//create new instance of the mongoose.schema. the schema takes an
//object that shows the shape of your database entries.

var recipeSchema = new Schema({
  image: String,
  ingredients: Array,
  ingCheck: Array,
  directions: String,
  title: String,
  socialRank: Number,
  owner: String,
  friends: Array,
  description: String
});
//export our module to use in server.js
module.exports = mongoose.model('Recipes', recipeSchema);
