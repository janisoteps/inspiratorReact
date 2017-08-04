//Inspirator.js
import React, { Component } from 'react';
// import CommentList from './CommentList';
// import CommentForm from './CommentForm';
import Generator from './Generator';
import Recipe from './Recipe';
import axios from 'axios';
import Login from './Login';
import Header from './Header';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import style from './style';

class Inspirator extends Component {
 constructor(props) {
   super(props);
   this.state = { data: [], recipeId: '', recipe: {}, profile: {}, user: {} };
  //  this.loadCommentsFromServer = this.loadCommentsFromServer.bind(this);
  //  this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
   this.handleRecipeGen = this.handleRecipeGen.bind(this);
   this.getRecipe = this.getRecipe.bind(this);
 }

//Once the random id is received from generator post that ID to server to call external API to get the recipe
 handleRecipeGen(id) {
  //  console.log(id);
  //post the generated id to server
   axios.post('http://localhost:3001/api/recipes', id)
   .then(res => {
     //server replies with the mongo id that the recipe is saved with
    //  console.log(res.data);
     //generate express API path with mongo id parameter and call getRecipe function with that path
     let recipeGet = 'http://localhost:3001/api/recipes/'+res.data;
     this.getRecipe(recipeGet);
   })
   .catch(err => {
     console.error(err);
   });
 }

 //Once the recipe is generated and saved in mongo, use the mongo id to retrieve the recipe and set it to state
 getRecipe(recipeGet){
   if(this.unmounted) return
  //  console.log(recipeGet);
   axios.get(recipeGet)
   .then(res => {
    //  console.log(" res.data", res.data)
    //  this.setState({ data: res.data });
    // console.log(res.data[0]);
    this.setState({ recipe: res.data[0]});
   })
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
      //  this.setState({ profile: profile });
      //  console.log(profile);
      //  console.log(this.state.profile);
       //try to find a user with the fb ID of the logged in user
       axios.get('http://localhost:3001/api/users', { params: { fbId: profile.sub } })
       .then(res => {
        //  console.log(" res.data", res.data.length);
         //if the response from server doesn't contain any user data, post the user details
         if(res.data.length === 0){
           let userPost = {};
           userPost.name = profile.name;
           userPost.fbId = profile.sub;
           userPost.recOwner = [];
           userPost.recFriend = [];
           axios.post('http://localhost:3001/api/users', userPost)
           .then(res => {
              this.setState({ user: res.data });
              // console.log(" res.data", res.data);
           })
           .catch(err => {
             console.error(err);
           });
         }
         this.setState({ user: res.data });
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
   return (
     <MuiThemeProvider>
       <div>
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
