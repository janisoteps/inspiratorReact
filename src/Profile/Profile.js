import React, { Component } from 'react';
import './Profile.css';
import Login from '../Login';
import Header from '../Header';
import style from '../style';
import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';
import Subheader from 'material-ui/Subheader';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import axios from 'axios';



class Profile extends Component {
  constructor(props) {
    super(props);
    this.goTo = this.goTo.bind(this);
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
      console.log(res);
    });
  }

  goTo(route) {
    console.log(route);
    this.props.history.replace(`/recipe/${route}`);
  }

  render() {
    const { profile } = this.state;
    // console.log(profile);

    if(profile.name){
      let fbId = profile.sub.substr(profile.sub.length - 16);
      var picurl = 'https://graph.facebook.com/' + fbId + '/picture?width=9999';
    }

    var recipeNodes = '';
    console.log(this.state.user);
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
            <Subheader>Your Recipes</Subheader>
            { recipeNodes }
          </List>
          </Paper>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Profile;
