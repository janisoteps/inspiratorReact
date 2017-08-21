//Inspirator.js
import React, { Component } from 'react';
import Generator from './Generator';
import Recipe from './Recipe';
// import axios from 'axios';
import Login from './Login';
import Header from './Header';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import style from './style';
// const endPoint = 'http://localhost:5000';

class Inspirator extends Component {
 constructor(props) {
   super(props);
   this.state = { data: [], recipeId: '', recipe: {}, profile: {}, user: {} };
  //  this.loadCommentsFromServer = this.loadCommentsFromServer.bind(this);
  //  this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
   this.handleRecipeGen = this.handleRecipeGen.bind(this);
   this.getRecipe = this.getRecipe.bind(this);
   this.getMetaData = this.getMetaData.bind(this);
 }

//Once the random id is received from generator post that ID to server to call external API to get the recipe
handleRecipeGen(id) {
  this.setState({ spinner: true });
  //  console.log(id);
  //post the generated id to server
   fetch('/api/recipes', {
     method: 'POST',
     headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json'
     },
     body: JSON.stringify(id)
   })
   .then(res => res.json())
   .then(res => {
    //  console.log(res);
     //server replies with the mongo id that the recipe is saved with
     this.getMetaData(res);
   })
   .catch(err => {
     console.error(err);
     window.location = '/';
   });
 }

 //Once the recipe is generated and saved in mongo, use the mongo id to retrieve the recipe and set it to state
 getRecipe(recipeGet){
   if(this.unmounted) return
  //  console.log(recipeGet);
   fetch(recipeGet)
   .then(res => res.json())
   .then(res => {
    //  console.log(" res.data", res);
    //  this.setState({ data: res.data });
    // console.log(res.data[0]);
    this.setState({ recipe: res[0]});
    this.setState({ spinner: false });
    // this.getMetaData(recipe._id, recipe.directions);
   })
 }

 //Post to another API endpoint to carry out website meta data scrub and get the description
 getMetaData(recId){
   if(this.unmounted) return
   var metaBody = {recId: recId};

   fetch('/api/recipemeta', {
     method: 'POST',
     headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json'
     },
     body: JSON.stringify(metaBody)
   })
   .then(res => res.json())
   .then(res => {
    //  console.log(res);
     //server replies with the mongo id that the recipe is saved with
    //  console.log(res.data);
     //generate express API path with mongo id parameter and call getRecipe function with that path
     let recipeGet = '/api/recipes/'+res;
     this.getRecipe(recipeGet);
   });
 }

 //when app mounts get the user profile, check if mongo has a copy of it and if not copy id and name to mongo
 componentWillMount() {
  // console.log(this.props.auth);
  const isAuthenticated = this.props.auth.isAuthenticated;
  var isAuth = isAuthenticated();
  console.log('Authenticated:',isAuth);
  if(!isAuth){
    return
  }
  const getProfile = this.props.auth.getProfile;
  getProfile((err, profile) => {
      //  console.log(profile);
      //  console.log(this.state.profile);
      var getProfileUrl = '/api/users?fbId='+profile.sub;

       //try to find a user with the fb ID of the logged in user
      //  axios.get(endPoint+'/api/users', { params: { fbId: profile.sub } })

       fetch(getProfileUrl)
       .then(res => res.json())
       .then(res => {
        //  console.log(" res.data", res.data.length);
         //if the response from server doesn't contain any user data, post the user details
         if(res.length === 0){
           let userPost = {};
           userPost.name = profile.name;
           userPost.fbId = profile.sub;
           userPost.recOwner = [];
           userPost.recFriend = [];
           //axios.post(endPoint+'/api/users', userPost)

           fetch('/api/users', {
             method: 'POST',
             headers: {
               'Accept': 'application/json',
               'Content-Type': 'application/json'
             },
             body: JSON.stringify(userPost)
           })
           .then(res => {
              this.setState({ user: res });
              // console.log(" res.data", res.data);
           })
           .catch(err => {
             console.error(err);
           });
         }
         this.setState({ user: res });
       })
     });
 }

 componentDidMount() {

 }

 componentDidUpdate(){

 }

 componentWillUnmount() {
   this.unmounted = true;
 }

 render() {

   //  console.log(this.state.recipe);
   var isLoading = this.state.spinner;
  //  console.log('spinner is on: ', isLoading)
   return (
     <MuiThemeProvider>
       <div>
         { isLoading && (
           <div style={style.spinner}>
             <center>
               <h2>Loading...</h2>
             </center>
           </div>
         )}
         <Header />
         <Login history={this.props.history} auth={this.props.auth}/>
         <div className="recipeGenerator">
           <Recipe style={style.inspRecipe} recipe={ this.state.recipe }/>
           {/* <Generator user={this.state.user} history={this.props.history} recipe={ this.state.recipe } onRecGen={ this.handleRecipeGen } /> */}
         </div>
         <div style={style.generator}>
           <Generator user={this.state.user} history={this.props.history} recipe={ this.state.recipe } onRecGen={ this.handleRecipeGen } />
         </div>
         <div style={style.blankFooter}></div>
       </div>
     </MuiThemeProvider>
   )
 }
}
export default Inspirator;
