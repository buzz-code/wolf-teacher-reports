import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';

// Import custom components
import PrivateRoute from './PrivateRoute';
import RestrictRoute from './RestrictRoute';
import MainLayout from '../components/common/layout/MainLayout';
import NotFound from '../components/error/NotFound';

import LoginForm from '../containers/auth/LoginContainer';
import SignUpForm from '../containers/auth/SignUpContainer';
import Dashboard from '../containers/dashboard/DashboardContainer';
import Students from '../containers/students/StudentsContainer';
import Teachers from '../containers/teachers/TeachersContainer';
import Groups from '../containers/groups/GroupsContainer';
import StudentGroups from '../containers/student-groups/StudentGroupsContainer';
import Lessons from '../containers/lessons/LessonsContainer';
import LessonTimes from '../containers/lesson-times/LessonTimesContainer';
import AttTypes from '../containers/att-types/AttTypesContainer';
import AttReports from '../containers/att-reports/AttReportsContainer';
import ReportEdit from '../containers/report-edit/ReportEditContainer';
import ExcelImport from '../containers/excel-import/ExcelImportContainer';

const Router = () => (
  <Fragment>
    <Switch>
      <RestrictRoute exact path="/" component={LoginForm} />
      <RestrictRoute exact path="/signup" component={SignUpForm} />

      <PrivateRoute exact path="/dashboard" layout={MainLayout} component={Dashboard} />
      <PrivateRoute exact path="/students" layout={MainLayout} component={Students} />
      <PrivateRoute exact path="/teachers" layout={MainLayout} component={Teachers} />
      <PrivateRoute exact path="/groups" layout={MainLayout} component={Groups} />
      <PrivateRoute exact path="/student-groups" layout={MainLayout} component={StudentGroups} />
      <PrivateRoute exact path="/lessons" layout={MainLayout} component={Lessons} />
      <PrivateRoute exact path="/lesson-times" layout={MainLayout} component={LessonTimes} />
      <PrivateRoute exact path="/att-types" layout={MainLayout} component={AttTypes} />
      <PrivateRoute exact path="/att-reports" layout={MainLayout} component={AttReports} />

      <PrivateRoute exact path="/report-edit" layout={MainLayout} component={ReportEdit} />
      <PrivateRoute exact path="/excel-import" layout={MainLayout} component={ExcelImport} />

      <Route component={NotFound} />
    </Switch>
  </Fragment>
);

export default Router;
