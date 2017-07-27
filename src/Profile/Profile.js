import React, { Component } from 'react';
import './Profile.css';
import Login from '../Login';
import Header from '../Header';
import style from '../style';
import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';
import Subheader from 'material-ui/Subheader';
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import axios from 'axios';



class Profile extends Component {
  constructor(props) {
    super(props);
    this.goTo = this.goTo.bind(this);
    this.getFriends = this.getFriends.bind(this);
    this.addFavorite = this.addFavorite.bind(this);
  }

  componentWillMount() {
    //get the user profile from Auth0 and set it to state
    this.setState({ profile: {} });
    const { userProfile, getProfile } = this.props.auth;
    if (!userProfile) {
      // console.log('getting profile');
      getProfile((err, profile) => {
        this.setState({ profile });
        this.getMongoProfile(this.state.profile.sub);
      });
    } else {
      // console.log('have profile');
      // console.log(userProfile);
      this.setState({ profile: userProfile });
      this.getMongoProfile(userProfile.sub);
    }
  }

  //Get Mongo data about user to retrieve recipe links
  getMongoProfile(fbId) {
    axios.get('http://localhost:3001/api/users', { params: { fbId: fbId } })
    .then(res => {
      this.setState({ user: res.data[0] });
      console.log(res.data[0]);
      this.getFriends();
    });
  }

  //Change the history route for router
  goTo(route) {
    console.log(route);
    this.props.history.replace(`/recipe/${route}`);
  }

  //Get friends and picture from server
  getFriends() {
    // console.log('getFriends runs');
    // console.log(this.state);
    var userId = this.state.profile.sub;
    let friendEndPoint = 'http://localhost:3001/api/friends/'+userId;
    //get friend list from server
    axios.get(friendEndPoint)
    .then(res => {
      // console.log(res);
      let friendData = res.data.friends;
      // console.log('Friends: ',friendData);
      this.setState({ friends: friendData });
      // console.log('Picture: ', res.data.picture);
      this.setState({ picture: res.data.picture});
    })
  }

  //Add a FB friend that's also using app as a favorite
  addFavorite(favObj){
    let favFriendId = favObj.favFriendId;
    let favName = favObj.favName;
    // console.log('user: ',this.state.user);
    let userId = this.state.user._id;

    axios.put('http://localhost:3001/api/users', {
      id: userId,
      favFriendId: favFriendId,
      favName: favName
    }).then(res => {
      console.log(res);
      // this.setState({ data: res.data });
      this.getMongoProfile(this.state.user.fbId);
    });
  }

  render() {
    const { profile } = this.state;
    // console.log(profile);

    if(profile.name){
      // let fbId = profile.sub.substr(profile.sub.length - 16);
      var picurl = this.state.picture;
    }

    //Nodes to display a list of recipes that user has chosen to do
    var recipeNodes = '';
    // console.log(this.state.user);
    if (this.state.user) {
      recipeNodes = this.state.user.recOwner.map(recipe => {
        return (
          <ListItem
            primaryText={ recipe.recName }
            key={ recipe['recId'] }
            leftIcon={<FontIcon className="material-icons">local_dining</FontIcon>}
            onClick={this.goTo.bind(this, recipe.recId)}>
            {/* { recipe.recName } */}
          </ListItem>
        )
      });
    } else {
      recipeNodes = 'Loading';
    }

    //Nodes to display a list of recipes that user has chosen to do
    var recInviteNodes = '';
    // console.log(this.state.user);
    if (this.state.user) {
      recInviteNodes = this.state.user.recFriend.map(recipe => {
        return (
          <ListItem
            primaryText={ recipe.recName }
            key={ recipe['recId'] }
            leftIcon={<FontIcon className="material-icons">local_dining</FontIcon>}
            onClick={this.goTo.bind(this, recipe.recId)}>
            {/* { recipe.recName } */}
          </ListItem>
        )
      });
    } else {
      recInviteNodes = 'Loading';
    }

    //Nodes to show a list of friends that also use this app
    var friendNodes = '';
    var favIcon = '';
    // console.log(this.state.user);
    if (this.state.friends) {
      friendNodes = this.state.friends.map(friend => {
        var favData = {};
        favData.favFriendId = friend.id;
        favData.favName = friend.name;
        //check if user's friend that's also using this app is added as a favorite
        if(this.state.user.favFriends.find(function(item){return item.favFriendId === friend.id})){
          // console.log('is a fav');
          favIcon = 'favorite';
        } else {
          favIcon = 'favorite_border';
        }
        return (
          <ListItem
            primaryText={ friend.name }
            key={ friend.id }
            leftIcon={<FontIcon className="material-icons">face</FontIcon>}
            // onClick={this.goTo.bind(this, recipe.recId)}
            >
              <FlatButton
                href=""
                secondary={true}
                icon={<FontIcon className="material-icons">{favIcon}</FontIcon>}
                style={style.favFriend}
                onClick={this.addFavorite.bind(this, favData)}
              />
            {/* { friend.name } */}
          </ListItem>
        )
      });
    } else {
      friendNodes = 'Loading';
    }


    return (
      <MuiThemeProvider>
        <div>
          <Header />
          <Login history={this.props.history} auth={this.props.auth}/>
          <div style={ style.profile } >
            <h1>{profile.name}</h1>
            {/* <Paper> */}
              <img style={style.profPic} src={picurl} alt=" " />

            {/* </Paper> */}
          </div>
          <Paper style={style.profileRecOwn}>
            <List>
              <Subheader>Your Friends Also Using This App</Subheader>
              { friendNodes }
            </List>
          </Paper>
          <Paper style={style.profileRecOwn}>
          <List>
            <Subheader>Your Recipes</Subheader>
            { recipeNodes }
          </List>
          </Paper>
          <Paper style={style.profileRecOwn}>
          <List>
            <Subheader>Recipe Invites</Subheader>
            { recInviteNodes }
          </List>
          </Paper>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Profile;
