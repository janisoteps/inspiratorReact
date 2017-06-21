//server.js
'use strict';
//first we import our dependencies…
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Comment = require('./model/comments');
var Recipe = require('./model/recipes');
var User = require('./model/users');
//and create our instances
var app = express();
var router = express.Router();
//set our port to either a predetermined port number if you have set
//it up, or 3001
var port = process.env.API_PORT || 3001;

var request = require('request');


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/comment');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('LETS COOK UP SOME RECIPES!!');
});
//now we should configure the API to use bodyParser and look for
//JSON data in the request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//To prevent errors from Cross Origin Resource Sharing, we will set
//our headers to allow CORS with middleware like so:
app.use(function(req, res, next) {
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Credentials', 'true');
 res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
 res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
//and remove cacheing so we get the most recent comments
 res.setHeader('Cache-Control', 'no-cache');
 next();
});
//now we can set the route path & initialize the API
router.get('/', function(req, res) {
 res.json({ message: 'API Initialized!'});
});

//adding the /comments route to our /api router
router.route('/comments')
 //retrieve all comments from the database
 .get(function(req, res) {
  //  console.log(req.query.recId);
   //looks at our Comment Schema
   Comment.find({ recId: req.query.recId }).exec(function(err, comments) {
    if (err)
      res.send(err);
    //responds with a json object of our database comments.
    res.json(comments);
  });
 })
 //post new comment to the database
 .post(function(req, res) {

   var comment = new Comment();
   //body parser lets us use the req.body
   comment.author = req.body.author;
   comment.text = req.body.text;
   comment.recId = req.body.recId;
   comment.save(function(err) {
     if (err)
     res.send(err);
     res.send();
   });
 });

//adding the /recipe route to our /api router
router.route('/recipes')
  //retrieve the recipe from the database
  // .get(function(req, res) {
  //   let recipeId = req.params.id;
  //   console.log(recipeId);
  //   //looks at our Comment Schema
  //   Recipe.find({_id:recipeId}).exec(function(err, recipe){
  //    if (err)
  //      res.send(err);
  //    //responds with a json object of our database comments.
  //    res.json(recipe);
  //   });
  // })
  // Get the recipe from API and post it to database
  .post(function(req, res) {
    var recipe = new Recipe();
    let id = req.body.recipeId;
    // console.log(id);

    var recipeUrl = "http://food2fork.com/api/get?key=19b9f7e3df065a89d6f1f874374989a3&rId="+id;

    request(recipeUrl, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // console.log(body);
        body = JSON.parse(body);
        recipe.image = body.recipe.image_url;
        recipe.ingredients = body.recipe.ingredients;
        recipe.directions = body.recipe.source_url;
        recipe.title = body.recipe.title;
        recipe.save(function(err, model){
          if(err){
            res.send(err);
          }
          res.send(recipe._id);
        });
      }
    });
  });

//retrieve a single recipe
router.route('/recipes/:id')
  //retrieve the recipe from the database
  .get(function(req, res) {
    let recipeId = req.params.id;
    // console.log(recipeId);
    //looks at our Comment Schema
    Recipe.find({_id:recipeId}).exec(function(err, recipe){
     if (err)
       res.send(err);
     //responds with a json object of our database comments.
     res.json(recipe);
    });
  });

//post or get user data used for linking recipes
router.route('/users')
  //retrieve user info
  .get(function(req, res) {
    console.log(req.query.fbId);
    //looks at our User Schema
    User.find({ fbId: req.query.fbId }).exec(function(err, user) {
     if (err)
       res.send(err);
     //responds with a json object
     res.json(user);
   });
  })
  .post(function(req, res) {
    var user = new User();
    //body parser lets us use the req.body
    user.name = req.body.name;
    user.fbId = req.body.fbId;
    user.recOwner = [];
    user.recFriend = [];
    user.save(function(err) {
      if (err)
      res.send(err);
      res.json(user);
    });
  })
  .put(function(req, res){
    let id = req.body.id;
    let recId = req.body.recId;
    let recName = req.body.recName;
    User.update({ _id: id }, { $push: { recOwner: {recId: recId, recName: recName} }},function(err) {
      if (err)
      res.send(err);
      res.send();
    });
    console.log('User updated - user ID:',id,' recipe ID:',recId,' recipe name:',recName);
  });

//Use our router configuration when we call /api
app.use('/api', router);
//starts the server and listens for requests
app.listen(port, function() {
 console.log(`api running on port ${port}`);
});
