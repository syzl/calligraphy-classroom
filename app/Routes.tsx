import * as React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import CounterPage from './containers/CounterPage';
import FramePage from './containers/frame/Page';
import * as routes from './constants/routes.json';

export default () => (
  <App>
    <Switch>
      <Route path={routes.COUNTER} component={CounterPage} />
      <Route path={routes.FRAME} component={(FramePage)} />
      <Route path={routes.HOME} component={HomePage} />
    </Switch>
  </App>
);
