import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { reducer as formReducer } from 'redux-form';

// Import custom components
import authReducer from './authReducer';
import crudReducer from './crudReducer';
import {
  STUDENTS,
  TEACHERS,
  GROUPS,
  STUDENT_GROUPS,
  LESSONS,
  LESSON_TIMES,
  ATT_TYPES,
  ATT_REPORTS,
  REPORT_EDIT,
  // STUDENT_REPORTS,
  // TEACHER_REPORTS,
  // ORGANIATION_REPORTS,
  DASHBOARD,
} from '../constants/entity';

const appReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    form: formReducer, // ← redux-form
    auth: authReducer,
    [STUDENTS]: crudReducer(STUDENTS),
    [TEACHERS]: crudReducer(TEACHERS),
    [GROUPS]: crudReducer(GROUPS),
    [STUDENT_GROUPS]: crudReducer(STUDENT_GROUPS),
    [LESSONS]: crudReducer(LESSONS),
    [LESSON_TIMES]: crudReducer(LESSON_TIMES),
    [ATT_TYPES]: crudReducer(ATT_TYPES),
    [ATT_REPORTS]: crudReducer(ATT_REPORTS),
    [REPORT_EDIT]: crudReducer(REPORT_EDIT),
    // [STUDENT_REPORTS]: crudReducer(STUDENT_REPORTS),
    // [TEACHER_REPORTS]: crudReducer(TEACHER_REPORTS),
    // [ORGANIATION_REPORTS]: crudReducer(ORGANIATION_REPORTS),
    [DASHBOARD]: crudReducer(DASHBOARD),
  });

const rootReducer = (state, action) => {
  if (action === 'LOG_OUT_SUCCESS') {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
