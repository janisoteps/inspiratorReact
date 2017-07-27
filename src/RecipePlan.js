import React, { Component } from 'react';
import Login from './Login';
import Header from './Header';
import style from './style';
import {List} from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import axios from 'axios';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import './RecipePlan.css';


class RecipePlan extends Component {
  constructor(props) {
    super(props);
    this.state = { recipe: {}, data: []};
    this.loadCommentsFromServer = this.loadCommentsFromServer.bind(this);
    this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
    this.getRecipe = this.getRecipe.bind(this);
    this.ingCheck = this.ingCheck.bind(this);
    this.getFavs = this.getFavs.bind(this);
    this.addFavs = this.addFavs.bind(this);
    this.ownerCheck = this.ownerCheck.bind(this);
    this.favCheck = this.favCheck.bind(this);
  }

  //Request recipe from database based on it's id
  getRecipe(id) {
    let recipeGet = 'http://localhost:3001/api/recipes/'+id;
    // console.log(recipeGet);
    //get the recipe from mongo based on path that contains id parameter
    axios.get(recipeGet)
    .then(res => {
    //  console.log(res.data[0]);
     this.setState({ recipe: res.data[0]});
    })
  }

  componentWillMount() {
    this.getRecipe(this.props.match.params.id);
    this.setState({ profile: {} });
    const { userProfile, getProfile } = this.props.auth;
    if (!userProfile) {
      getProfile((err, profile) => {
        this.setState({ profile });
        let fbId = profile.sub;
        console.log('comp will mount profile fbId: ', fbId);
        this.getFavs(fbId);
      });
    } else {
      this.setState({ profile: userProfile });
      let fbId = userProfile.sub;
      // console.log('comp will mount profile fbId: ', fbId);
      this.getFavs(fbId);
    }
    this.loadCommentsFromServer();
  }

  componentDidUpdate(){
    // console.log('updated');
  }

  componentDidMount(){
        // // this.ownerCheck();
        // if(this.state.user){
        //   this.ownerCheck();
        // }
        // while(!this.state.user){
        //
        // }
  }

  loadCommentsFromServer() {
    if (this.props.history.location.pathname === '/profile'){
      return
    }
    axios.get(this.props.url, { params: { recId: this.state.recipe._id } })
    .then(res => {
      // console.log('check');
      this.setState({ data: res.data });
    });
    // setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  }

  //post comments to server
  handleCommentSubmit(comment) {
    //add POST request
    axios.post(this.props.url, comment)
    .then(res => {
      // console.log(res);
      // this.setState({ data: res.data });
    })
    .catch(err => {
      console.error(err);
    });
  }

  //Update recipe ingredient checklist
  ingCheck(index){
    console.log('clicked', index);
    // console.log(this.state.recipe._id);
    let url = 'http://localhost:3001/api/recipes/'+this.state.recipe._id;
    let ingIndex = index;
    let ingState = this.state.recipe.ingCheck[ingIndex];
    console.log(ingState);
    console.log(url);
    axios.put(url, {
      ingIndex: ingIndex,
      ingState: ingState
    }).then(res => {
      // console.log(res);
      // this.setState({ data: res.data });
      this.getRecipe(this.props.match.params.id);
    });
  }

  //Retrieve users favorited friends
  getFavs(fbookId, counter){
    // let fbId = this.state.profile.sub;
    let fbId = fbookId;
    axios.get('http://localhost:3001/api/users', { params: { fbId: fbId } })
    .then(res => {
      this.setState({ user: res.data[0] });
      // console.log(res.data[0]);
      // this.getRecipe(this.props.match.params.id);
      this.ownerCheck();
    });
    // console.log(this.state.user.favFriends);
  }

  //Add a favorite friend to recipe
  addFavs(favObj){
    let favFriendId = favObj.favFriendId;
    let favName = favObj.favName;
    let recipeId = this.state.recipe._id;
    let url = 'http://localhost:3001/api/recipes/'+recipeId;
    let recName = this.state.recipe.title;
    axios.put(url, {
      favFriendId: favFriendId,
      favName: favName,
      recName: recName
    }).then(res => {
      // console.log(res);
      // this.setState({ data: res.data });
      this.getRecipe(this.props.match.params.id);
    });
  }

  //Get the fav friend id from fav friend array map function, loop through recipe friends array and check if that id is already there.
  //Give false result if it's there as in false we do not show this friend as an option to be added to recipe
  favCheck(favId){
    console.log(favId);
    for (var i = 0; i < this.state.recipe.friends.length; i++) {
        console.log(this.state.recipe.friends[i].favFriendId);
        let fid = this.state.recipe.friends[i].favFriendId;
        fid = fid.substr(fid.length - 15);
        if (favId === fid){
          return false
        }
    }
    return true
  }

  //Compare the user id in state to owner id of the recipe state
  ownerCheck() {
    console.log('user id: ', this.state.user._id);
    console.log('recipe owner id ', this.state.recipe.owner);
    console.log('are they the same: ', this.state.user._id === this.state.recipe.owner);
    if (this.state.user._id === this.state.recipe.owner) {
      this.setState({ownerCheck: true});
      return
    } else {
      this.setState({ownerCheck: false});
      return
    }
  }

  render() {
    let isOwner = this.state.ownerCheck;
    console.log(isOwner);
    let recipeTitle = this.state.recipe.title;
    let recipeImage = this.state.recipe.image;
    let directions = this.state.recipe.directions;
    if (!recipeTitle){
      return(
        <h1>Loading</h1>
      )
    }
    //Build a list of ingredients of the recipe, add onclick function to be able to tick them off
    let ingredients = this.state.recipe.ingredients.map(ingredient => {
      let index = this.state.recipe.ingredients.indexOf(ingredient);
      let tickCheck = this.state.recipe.ingCheck[index];
      let tickIcon ='';
      if(tickCheck === 1){
        tickIcon ='done';
      }
      return (
        <div key={ index }>
          <div id="ingRow" style={style.ingRow}>
              <div id="cartIcon" style={style.cartIcon}><FontIcon className="material-icons">local_grocery_store</FontIcon></div>
              <div style={style.ingLine}>
                {ingredient}
              </div>
              <div style={style.gotIngredient}>
                <div style={style.tickIcon}><FontIcon className="material-icons">{tickIcon}</FontIcon></div>
                <RaisedButton onClick={this.ingCheck.bind(this, index)} label="Got it" />
              </div>
              {/* <div style={style.tickIcon}><FontIcon className="material-icons">{tickIcon}</FontIcon></div> */}
          </div>
        </div>
      )});

    //Build list of favorites friends
    // console.log(this.state.user);
    if (this.state.user && isOwner) {
      var favlist = this.state.user.favFriends.map(friend => {
        let favObj = { favFriendId: friend.favFriendId, favName: friend.favName};

        if (this.favCheck(friend.favFriendId)){
          return (
            <div key={ friend.favFriendId }>
              <div id="ingRow" style={style.ingRow}>
                  <div id="cartIcon"><FontIcon className="material-icons">tag_faces</FontIcon></div>
                  <div style={style.ingLine}>
                    {friend.favName}
                  </div>
                  <div style={style.gotIngredient}>
                    <RaisedButton
                        onClick={this.addFavs.bind(this, favObj)}
                      label="Add" />
                  </div>
                  {/* <div style={style.tickIcon}><FontIcon className="material-icons"></FontIcon></div> */}
              </div>
            </div>
          )
        } else {
          return (<div key={ friend.favFriendId }></div>)
        }});
    } else if (!isOwner) {
      favlist = "You are not the owner of this recipe";
    } else {
      favlist = 'Loading';
    }
    //If recipe has friends added to it, build a list of them
    if(this.state.recipe.friends){
      var friendlist = this.state.recipe.friends.map(buddy => {
        // if (buddy.favName === )
        return (
          <div key={ buddy.favFriendId }>
            <div id="ingRow" style={style.ingRow}>
                <div id="cartIcon"><FontIcon className="material-icons">tag_faces</FontIcon></div>
                <div style={style.ingLine}>
                  {buddy.favName}
                </div>
            </div>
          </div>
      )});
    } else {
      friendlist = function(){
        return (
          <h3>No Friends Added Yet</h3>
        )
      };
    }



    //Main render
    return (
      <MuiThemeProvider>
        <div>
          <Header />
          <Login history={this.props.history} auth={this.props.auth}/>
          <div>
            <div>
              <div style={ style.recipeTitle }>
                <h1> { recipeTitle } </h1>
                <img style={style.recipeImage} src={ recipeImage } alt="Recipe"></img>
              </div>
              <div style={style.directions}>
                <a href={directions} target="blank" style={style.directions}><h2>Click here to read instructions</h2></a>
              </div>
              <List style={style.recipeIngredients}>
                <h2><FontIcon className="material-icons md-dark">content_paste</FontIcon> Friends Also On This Recipe</h2>
                { friendlist }
              </List>
              <List style={style.recipeIngredients}>
                <h2><FontIcon className="material-icons md-dark">content_paste</FontIcon> Friends To Add To Recipe</h2>
                { favlist }
              </List>
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
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default RecipePlan;
