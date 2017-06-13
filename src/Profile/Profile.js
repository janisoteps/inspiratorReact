import React, { Component } from 'react';
import './Profile.css';
import Login from '../Login';
import Header from '../Header';
import style from '../style';
import Paper from 'material-ui/Paper';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';



class Profile extends Component {
  componentWillMount() {
    this.setState({ profile: {} });
    const { userProfile, getProfile } = this.props.auth;
    if (!userProfile) {
      getProfile((err, profile) => {
        this.setState({ profile });
      });
    } else {
      this.setState({ profile: userProfile });
    }
  }
  render() {
    const { profile } = this.state;
    console.log(profile);

    if(profile.name){
      let fbId = profile.sub.substr(profile.sub.length - 16);
      var picurl = 'https://graph.facebook.com/' + fbId + '/picture?width=9999';
    }

    return (
      <MuiThemeProvider>
        <div>
          <Header />
          <Login auth={this.props.auth}/>
          <div style={ style.profile } >
            <h1>{profile.name}</h1>
            <Paper>
              <img style={style.profPic} src={picurl} alt=" " />
              {/* <pre>{JSON.stringify(profile, null, 2)}</pre> */}
              <p>Some Recipes</p>
            </Paper>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Profile;
