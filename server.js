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
//set our port to either a predetermined port number or 5000
var port = process.env.PORT || 5000;

var request = require('request');
var graph = require('fbgraph');
//vars for sockets
var http = require('http').Server(app);
var io = require('socket.io')(http);

var cheerio = require('cheerio');


mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/comment', {
  useMongoClient: true
});

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



// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}


//*********** SOCKETS API ******************

//Whenever someone connects this gets executed
io.on('connection', function(client){
  console.log('A user connected');

  //When subscribed to timer ingest the interval and emit the date
  client.on('subscribeToTimer', (interval) => {
    console.log('client is subscribing to timer with interval ', interval);
    setInterval(() => {
      client.emit('timer', new Date());
    }, interval);
  });

  //When subscribed to chat ingest the recipe id and emit the message updates, also join the client to room of the recipe
  client.on('subscribeToChat', (recId) => {
    client.join('room-'+recId);
    console.log('client is subscribing to room of recipe: ', recId);
    Comment.find({ recId: recId }).exec(function(err, comments) {
      client.emit('chat', comments);
    });
  });

  //When someone sends message, save it to database and send to others
  client.on('message', function(data){
    let recId = data.recId;
    let message = data.message;
    let author = data.author;
    let authorId = data.authorId;
    let date = data.date;
    var commentExists = false;
    //Check if comment entry has been started in database
    Comment.find({ recId: recId }).exec(function(err, comments) {
      // console.log(comments[0]);
      if(comments[0]){
        commentExists = true;
      }

      //Update the comment entry with new message
      if(commentExists){
        Comment.update({ recId: recId }, { $push: { comments: {comment: message, author: author, authorId: authorId, date: date} }},function(err) {
          Comment.find({ recId: recId }).exec(function(err, comments) {
            client.emit('chat', comments);
            // io.sockets.emit('chat', comments);
            io.sockets.in('room-'+recId).emit('chat', comments);
          });
        });
      } else {
        var newComment = new Comment();
        newComment.recId = recId;
        newComment.comments = [{comment: message, author: author, authorId: authorId, date: date}];
        newComment.save(function(err) {
          if (err)
          console.log(err);
          Comment.find({ recId: recId }).exec(function(err, comments) {
            client.emit('chat', comments);
            io.sockets.in('room-'+recId).emit('chat', comments);
          });
        });
      }
    });

  });

  //Whenever someone disconnects this piece of code executed
  client.on('disconnect', function () {
    console.log('A user disconnected');
  });

});

// io.listen(port);
console.log(`socket running on port ${port}`);



//*********** REST OF THE API ******************

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

//End point to get the meta description - server find the recipe, then requests source URL,
//then using jQuery lib Cheerio finds meta description and adds it to the recipe record
router.route('/recipemeta')
  .post( function(req, response){
    let recId = req.body.recId;
    // console.log(recId);

    Recipe.find({ _id: recId }).exec(function(err, recipe){
      // console.log(recipe[0]);
      var recDir = recipe[0].directions;
      // console.log(recDir);

      request(recDir, function(er, resp, html) {
        var $ = cheerio.load(html);
        var desc;
        desc = $('#metaDescription').prop('content');
        // console.log('desc: ',desc);
        if (!desc) {
          desc = $("meta[property='og:description']").prop('content');
        }
        Recipe.update({ _id: recId }, { $set: { description:  desc }},function(err) {
          if (err)
          response.send(err);
          response.send(recipe[0]._id);
        });
      });

    });
  });

//adding the /recipe route to our /api router - this will recieve an id for API call and save the response to database
router.route('/recipes')
  //retrieve the recipe from the database
  // .get(function(req, res) {
  // })
  // Get the recipe from API and post it to database reply back with recipe database ID
  .post(function(req, res) {
    var recipe = new Recipe();
    let id = req.body.recipeId;
    let userId = req.body.userId;
    // console.log(id);

    var recipeUrl = "http://food2fork.com/api/get?key=19b9f7e3df065a89d6f1f874374989a3&rId="+id;

    request(recipeUrl, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // console.log(body);
        body = JSON.parse(body);
        // console.log(body);
        recipe.image = body.recipe.image_url;
        recipe.ingredients = body.recipe.ingredients;
        if(!recipe.ingredients){
          res.send(error);
          return
        }
        let ingLength = recipe.ingredients.length;
        recipe.ingCheck = new Array(ingLength).fill(0);
        recipe.directions = body.recipe.source_url;
        // console.log(recipe.directions);
        recipe.title = body.recipe.title;
        recipe.socialRank = body.recipe.social_rank;
        recipe.owner = userId;
        recipe.description = "";
        // console.log(recipe.description);
        // recipe.description = "Another test";


        recipe.save(function(err, model){
          if(err){
            res.send(err);
            return
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
  })
  .put(function(req, res){ //find a recipe, then construct a query object and based on that update the check value
    let recId = req.params.id;
    let ingIndex = req.body.ingIndex;
    let ingState = req.body.ingState;
    // console.log('ingIndex: ', ingIndex,' ing State: ', ingState);
    let indexString = 'ingCheck.'+ingIndex;
    // console.log('indexString: ', indexString);
    let updateValue = {};
    if(ingState === 0){
      updateValue[indexString] = 1;
    } else {
      updateValue[indexString] = 0;
    }
    // console.log('update value: ', updateValue);

    let favName = req.body.favName;
    let favFriendId = 'facebook|'+req.body.favFriendId;
    // console.log(favFriendId);
    let recName = req.body.recName;

    if (!favName){
      // console.log('passed the test');
      Recipe.update({ _id: recId }, { $set: updateValue },function(err) {
        if (err)
        res.send(err);
        res.send();
      });
    } else if(favName) {
      Recipe.update({ _id: recId }, { $push: { friends: {favFriendId: favFriendId, favName: favName} } },function(err) {
        if (err)
        res.send(err);
        // res.send();
        User.update({ fbId: favFriendId }, { $push: { recFriend: {recId: recId, recName: recName} }},function(err) {
          if (err)
          res.send(err);
          res.send();
        });
      });
    }
  });

  //retrieve the friends using app
  router.route('/friends/:id')
    //retrieve the recipe from the database
    .get(function(req, res) {
      // let userId = req.params.userId;
      const userId = req.params.id;
      // console.log('userId: ',userId);
      var options = { method: 'POST',
        url: 'https://janisoteps.eu.auth0.com/oauth/token',
        headers: { 'content-type': 'application/json' },
        body: '{"client_id":"za29Xdrk3ODATb31nECPoBL0C5XSAGYW","client_secret":"vIkwwOSsUVlJWkCZ2oKOh13mn316VCbkG57KIpXYAGl71vwVO5GTCvGdt0c7Ggpk","audience":"https://janisoteps.eu.auth0.com/api/v2/","grant_type":"client_credentials"}' };

      request(options, function (error, response, body) {
        if (error) throw new Error(error);

        // // console.log(body);
        // res.json(body);
        let tokenData = JSON.parse(body);
        const authToken = tokenData.access_token;
        // console.log('token: ',authToken);
        var authorization = 'Bearer '+authToken;
        var url = 'https://janisoteps.eu.auth0.com/api/v2/users/'+userId;

        var fbOptions = { method: 'GET',
          url: url,
          headers: { authorization: authorization } };

        request(fbOptions, function (error, response, body) {
          if (error) throw new Error(error);

          // console.log(body);
          // res.json(body);
          var data = JSON.parse(body);
          // console.log(data);
          let id = data.identities[0].user_id;
          let access_token = data.identities[0].access_token;
          let pictureLarge = data.picture_large;

          graphCall(id, access_token, pictureLarge);

        });
      });

      function graphCall(id, access_token, pictureLarge){
        // console.log('graphCall check: ',id);
        let graphOptions = {
            timeout:  3000
          , pool:     { maxSockets:  Infinity }
          , headers:  { connection:  "keep-alive" }
        };

        let fbId = id;

        graph.setAccessToken(access_token);

        graph
          .setOptions(graphOptions)
          .get(fbId+'?fields=friends', function(err, response) {
            // console.log(response);
            if(!response){
              res.json(err);
              return
            }
            var serverResponse ={friends: response.friends.data, picture: pictureLarge};
            res.json(serverResponse);
          });
      }
    });

//post or get user data used for linking recipes
router.route('/users')
  //retrieve user info

  .get(function(req, res) {
    // console.log(req.query.fbId);
    //looks at our User Schema
    User.find({ fbId: req.query.fbId }).exec(function(err, user) {
     if (err)
       res.send(err);
     //responds with a json object
    //  console.log(user);
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
    // console.log(req.body.id);
    let id = req.body.id;
    let recId = req.body.recId;
    let recName = req.body.recName;
    let favFriendId = req.body.favFriendId;
    let favName = req.body.favName;
    if (recName){
      User.update({ _id: id }, { $push: { recOwner: {recId: recId, recName: recName} }},function(err) {
        if (err)
        res.send(err);
        res.send();
      });
      // console.log('User updated - user ID:',id,' recipe ID:',recId,' recipe name:',recName);
    } else if (favFriendId) {
      var conditions = {
          _id: id,
          'favFriends.favFriendId': { $ne: favFriendId }
      };

      var update = {
          $addToSet: { favFriends: {favFriendId: favFriendId, favName: favName} }
      }

      User.findOneAndUpdate(conditions, update, function(err, doc) {
        if (err)
          res.send(err);
          res.send();
      });

      // User.update({ _id: id }, { $push: { favFriends: {favFriendId: favFriendId, favName: favName} }},function(err) {
      //   if (err)
      //   res.send(err);
      //   res.send();
      // });
    }
  });

//Use our router configuration when we call /api
app.use('/api', router);
//starts the server and listens for requests
http.listen(port, function() {
 console.log(`api running on port ${port}`);
});
