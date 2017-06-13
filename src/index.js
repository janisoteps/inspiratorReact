// import React from 'react';
import ReactDOM from 'react-dom';
// import Inspirator from './Inspirator';
// import 'bootstrap/dist/css/bootstrap.css';
import { makeMainRoutes } from './routes';
import 'typeface-roboto'

const routes = makeMainRoutes();

// ReactDOM.render(
//   <Inspirator
//     url='http://localhost:3001/api/comments'
//     pollInterval={2000} />,
//   document.getElementById('root')
// );


ReactDOM.render(
  routes,
  document.getElementById('root')
);
