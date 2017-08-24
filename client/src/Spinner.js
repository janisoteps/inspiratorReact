import React, { Component } from 'react';
import './spinner.css';
import style from './style';

class Spinner extends Component {


  render() {
    return (
      <div style={style.spinner}>
        <center>
          <div className='loader'></div>
        </center>
      </div>
    )
  }
}

export default Spinner;
