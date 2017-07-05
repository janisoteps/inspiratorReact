import React, { Component } from 'react';
import Login from './Login';
import Header from './Header';
// import style from './style';
// import {List, ListItem} from 'material-ui/List';
// import FontIcon from 'material-ui/FontIcon';
// import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import axios from 'axios';
// import CommentList from './CommentList';
// import CommentForm from './CommentForm';

// var request = require("request");
// var graph = require('fbgraph');

class AddFriends extends Component {
  constructor(props) {
    super(props);
    this.state = { recipe: {}, data: []};
    // this.loadCommentsFromServer = this.loadCommentsFromServer.bind(this);
    // this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
    // this.getRecipe = this.getRecipe.bind(this);
    this.getToken = this.getFriends.bind(this);
  }

  // getRecipe(id) {
  //   // let id = this.props.match.params.id;
  //   let recipeGet = 'http://localhost:3001/api/recipes/'+id;
  //   // console.log(recipeGet);
  //   //get the recipe from mongo based on path that contains id parameter
  //   axios.get(recipeGet)
  //   .then(res => {
  //    //  console.log(" res.data", res.data)
  //    //  this.setState({ data: res.data });
  //   //  console.log(res.data[0]);
  //    this.setState({ recipe: res.data[0]});
  //   //  console.log(this.state.recipe);
  //   })
  // }

  // componentWillMount() {
  //   this.getRecipe(this.props.match.params.id);
  //   // console.log(recipe);
  // }

  componentWillMount() {
    // this.getRecipe(this.props.match.params.id);
    this.setState({ profile: {} });
    console.log(this.props.auth);
    const { userProfile, getProfile } = this.props.auth;
    // const userProfile = this.props.auth;
    // const getProfile = this.props.Auth.getProfile;
    console.log(userProfile);
    if (!userProfile) {
      getProfile((err, profile) => {
        this.setState({ profile });
      });
    } else {
      this.setState({ profile: userProfile });
    }
    // this.loadCommentsFromServer();
    console.log(this.state);
    // var token = this.getToken();
    // console.log('token is ',token);
    this.getFriends();
  }

  getFriends() {

    console.log('getToken runs');
    console.log(this.state);
    var userId = 'facebook|104888626806470';
    let friendEndPoint = 'http://localhost:3001/api/friends/'+userId;
    //get friend list from server
    axios.get(friendEndPoint)
    .then(res => {
      let friendData = res;
      console.log('Friends: ',friendData);
    })
  }


  componentDidUpdate(){
    console.log('updated');
  }



  render() {
    // let recipeTitle = this.state.recipe.title;
    // let recipeImage = this.state.recipe.image;
    // if (!recipeTitle){
    //   return(
    //     <h1>Loading</h1>
    //   )
    // }
    // let ingredients = this.state.recipe.ingredients.map(ingredient => {
    //   return (
    //     // <div key={ ingredient }>
    //     //   <p>{ingredient}</p>
    //     // </div>
    //     <ListItem
    //       primaryText={ ingredient }
    //       key={ ingredient }
    //       leftIcon={<FontIcon className="material-icons">local_grocery_store</FontIcon>}>
    //       <RaisedButton label="Got it" style={style.gotIngredient} />
    //     </ListItem>
    //   )});
    // console.log(this.state.profile);
    return (
      <MuiThemeProvider>
        <div>
          <Header />
          <Login history={this.props.history} auth={this.props.auth}/>
          {/* <div>
            <div>
              <div style={ style.recipeTitle }>
                <h1> { recipeTitle } </h1>
                <img src={ recipeImage } alt="Recipe"></img>
              </div>
              <List style={style.recipeIngredients}>
                <h2><FontIcon className="material-icons md-dark">content_paste</FontIcon> Ingredients</h2>
                { ingredients }
              </List>
            </div>
          </div>
          <div style={ style.commentBox }>
            <h2>Comments:</h2>
            <CommentList data={ this.state.data }/>
            <CommentForm recId={this.props.match.params.id} profile={this.state.profile} onCommentSubmit={ this.handleCommentSubmit }/>
          </div> */}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default AddFriends;
