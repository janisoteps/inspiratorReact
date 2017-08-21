import React, { Component } from 'react';
import './Login.css';
// import { subscribeToTimer } from './socketapi';


class Header extends Component {

  // componentDidMount() {
  //
  //   subscribeToTimer((err, timestamp) => {
  //     if(this.unmounted) return
  //     this.setState({ timestamp})
  //   });
  // }
  //
  // componentWillUnmount() {
  //   this.unmounted = true
  // }
  //
  // state = {
  //   timestamp: 'no timestamp yet'
  // };

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
