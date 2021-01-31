import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { reducer as formReducer } from 'redux-form';

// Import custom components
import authReducer from './authReducer';
import crudReducer from './crudReducer';
import {
  REPORTS,
  REPORT_TYPES,
  STUDENTS,
  TEACHERS,
  TEXTS,
  STUDENT_REPORTS,
  TEACHER_REPORTS,
  ORGANIATION_REPORTS,
} from '../constants/entity';

const appReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    form: formReducer, // ← redux-form
    auth: authReducer,
    [REPORTS]: crudReducer(REPORTS),
    [REPORT_TYPES]: crudReducer(REPORT_TYPES),
    [STUDENTS]: crudReducer(STUDENTS),
    [TEACHERS]: crudReducer(TEACHERS),
    [TEXTS]: crudReducer(TEXTS),
    [STUDENT_REPORTS]: crudReducer(STUDENT_REPORTS),
    [TEACHER_REPORTS]: crudReducer(TEACHER_REPORTS),
    [ORGANIATION_REPORTS]: crudReducer(ORGANIATION_REPORTS),
  });

const rootReducer = (state, action) => {
  if (action === 'LOG_OUT_SUCCESS') {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
