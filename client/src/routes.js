import React from 'react';
import { Route, BrowserRouter, Redirect } from 'react-router-dom';
import Inspirator from './Inspirator';
import Home from './Home/Home';
import Callback from './Callback/Callback';
import Auth from './Auth/Auth';
import history from './history';
import Profile from './Profile/Profile';
import RecipePlan from './RecipePlan';
// const endPoint = 'http://localhost:5000';
import RecipeSearch from './RecipeSearch';

const auth = new Auth();

const handleAuthentication = (nextState, replace) => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth.handleAuthentication();
  }
}

export const makeMainRoutes = () => {
  return (
    <BrowserRouter history={history} component={Inspirator}>
      <div>
        <Route exact path="/" render={(props) => <Inspirator
           auth={auth}
           {...props} />}
         />

        <Route path="/ingredients" render={(props) => (
            !auth.isAuthenticated() ? (
              <Redirect to="/"/>
            ) : (
              <RecipeSearch history={history} auth={auth} {...props} />
            )
          )} />

        <Route path="/home" render={(props) => <Home auth={auth} {...props} />} />

        <Route path="/callback" render={(props) => {
          handleAuthentication(props);
          return <Callback {...props} />
        }}/>

        <Route path="/profile" render={(props) => (
            !auth.isAuthenticated() ? (
              <Redirect to="/"/>
            ) : (
              <Profile history={history} auth={auth} {...props} />
            )
          )} />

        <Route path="/recipe/:id" render={(props) => (
            !auth.isAuthenticated() ? (
              <Redirect to="/"/>
            ) : (
              <RecipePlan
                auth={auth}
                {...props}
                 />
            )
          )} />

      </div>
    </BrowserRouter>
  );
}
