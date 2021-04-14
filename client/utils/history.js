import { createBrowserHistory as createHistory } from 'history';

// a singleton history object
const history = createHistory({
  basename: process.env.NODE_ENV !== 'development' ? '/att-manager/' : undefined,
});
export default history;
