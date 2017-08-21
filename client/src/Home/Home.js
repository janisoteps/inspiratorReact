import React, { Component } from 'react';
import style from '../style.js';
import Login from '../Login.js';
import '../Login.css';

class Home extends Component {
  login() {
    this.props.auth.login();
  }
  render() {
    const { isAuthenticated } = this.props.auth;
    return (
      <div>
        <div style={ style.home } className="container">
          {
            isAuthenticated() && (
                <h4>
                  Hi there!
                </h4>
              )
          }
          {
            !isAuthenticated() && (
              <div>
                <br/>
                <br/>
                <br/>
                <h4>
                  You are not logged in! Please{' '}
                  <a
                    style={{ cursor: 'pointer' }}
                    onClick={this.login.bind(this)}
                  >
                    Log In
                  </a>
                  {' '}to continue.
                </h4>
              </div>
              )
          }
        </div>
        <Login history={this.props.history} auth={this.props.auth}/>
        <div className="insp-home">
          <a style={style.backToInsp} data-buzz="New Recipes" className="buzz" href="/">

              New Recipes

          </a>
        </div>
      </div>
    );
  }
}

export default Home;
