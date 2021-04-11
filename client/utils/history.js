import { createBrowserHistory as createHistory } from 'history';

// a singleton history object
const history = createHistory({
  basename: process.env.NODE_ENV !== 'development' ? '/listen-report/' : undefined,
});
export default history;
