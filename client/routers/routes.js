import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';

// Import custom components
import PrivateRoute from './PrivateRoute';
import RestrictRoute from './RestrictRoute';
import MainLayout from '../components/common/layout/MainLayout';
import NotFound from '../components/error/NotFound';
import routeConfig from '../constants/route-config';

import LoginForm from '../containers/auth/LoginContainer';
import SignUpForm from '../containers/auth/SignUpContainer';

const Router = () => (
  <Fragment>
    <Switch>
      <RestrictRoute exact path="/" component={LoginForm} />
      <RestrictRoute exact path="/signup" component={SignUpForm} />

      {routeConfig
        .flatMap((item) => item)
        .map((item) => (
          <PrivateRoute
            exact
            key={item.path}
            path={item.path}
            layout={MainLayout}
            component={item.component}
            componentProps={item.props}
          />
        ))}

      <Route component={NotFound} />
    </Switch>
  </Fragment>
);

export default Router;
