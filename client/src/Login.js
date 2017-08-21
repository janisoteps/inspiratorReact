import React, { Component } from 'react';
// import './Login.css';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import style from './style';


class Login extends Component {
  goTo(route) {
    this.props.history.replace(`/${route}`)
  }

  login() {
    this.props.auth.login();
  }

  logout() {
    this.props.auth.logout();
  }

  // componentDidMount(){
  //
  // }

  render() {
    const { isAuthenticated } = this.props.auth;

    return (
      <MuiThemeProvider>
        <div style={ style.headerBar }>
          <div style={ style.header }>
            {
              !isAuthenticated() && (
                  <FlatButton
                    onClick={this.login.bind(this)}
                    label="Log In"
                    primary={true}
                    icon={<FontIcon className="material-icons">lock_open</FontIcon>}
                  />
                )
            }
            {
              isAuthenticated() && (
                  <div>
                    <FlatButton
                      onClick={this.logout.bind(this)}
                      label="Log Out"
                      secondary={true}
                      icon={<FontIcon className="material-icons">exit_to_app</FontIcon>}
                    />
                    <FlatButton
                      onClick={this.goTo.bind(this, 'profile')}
                      label="Profile"
                      primary={true}
                      icon={<FontIcon className="material-icons">account_circle</FontIcon>}
                    />
                  </div>
                )
            }
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Login;
