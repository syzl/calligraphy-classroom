import * as React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { hot } from 'react-hot-loader';
import { History } from 'history';
import Routes from '../Routes';

type Props = {
  store: any;
  history: History<any>;
};
const Root = function({ store, history }: Props) {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Routes />
      </ConnectedRouter>
    </Provider>
  );
};

export default hot(module)(Root);
