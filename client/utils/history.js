import { createBrowserHistory as createHistory } from 'history';
import PACKAGE from '../../package.json';

// a singleton history object
const history = createHistory({
  basename: process.env.NODE_ENV !== 'development' ? `/${PACKAGE.name}/` : undefined,
});
export default history;
