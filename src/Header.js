import React, { Component } from 'react';
import './Login.css';


class Header extends Component {
  goTo(route) {
    this.props.history.replace(`/${route}`)
  }


  render() {
    return (
      <div className="insp-home">
        <a data-buzz="Inspirator" className="buzz" href="/">
          Inspirator
        </a>
      </div>
    );
  }
}

export default Header;
