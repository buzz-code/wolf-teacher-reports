import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { teal } from '@material-ui/core/colors';
import { heIL } from '@material-ui/core/locale';
import { create } from 'jss';
import rtl from 'jss-rtl';
import { StylesProvider, jssPreset } from '@material-ui/core/styles';

import store, { history } from './store/configureStore';
import { verifyToken } from './services/tokenService';
import App from './containers/app/AppContainer';

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

const mountNode = document.getElementById('root');

const theme = createMuiTheme(
  {
    typography: {
      useNextVariants: true,
    },
    palette: {
      primary: teal,
    },
    direction: 'rtl',
  },
  heIL
);

// Used to log in if token is valid
store.dispatch(verifyToken());

ReactDOM.render(
  <Suspense fallback={<div>Error! Please refresh the page</div>}>
    <MuiThemeProvider theme={theme}>
      <StylesProvider jss={jss}>
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <App />
          </ConnectedRouter>
        </Provider>
      </StylesProvider>
    </MuiThemeProvider>
  </Suspense>,
  mountNode
);
