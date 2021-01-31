import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import loadable from '@loadable/component';

// Import custom components
import PrivateRoute from './PrivateRoute';
import RestrictRoute from './RestrictRoute';
import MainLayout from '../components/common/layout/MainLayout';
import NotFound from '../components/error/NotFound';

const AsyncLoginForm = loadable(() => import('../containers/auth/LoginContainer'));
const AsyncSignUpForm = loadable(() => import('../containers/auth/SignUpContainer'));
const AsyncDashboard = loadable(() => import('../containers/dashboard/DashboardContainer'));
const AsyncReports = loadable(() => import('../containers/reports/ReportsContainer'));
const AsyncReportTypes = loadable(() => import('../containers/reportTypes/ReportTypesContainer'));
const AsyncStudents = loadable(() => import('../containers/students/StudentsContainer'));
const AsyncTeachers = loadable(() => import('../containers/teachers/TeachersContainer'));

const Router = () => (
  <Fragment>
    <Switch>
      <RestrictRoute exact path="/" component={AsyncLoginForm} />
      <RestrictRoute exact path="/signup" component={AsyncSignUpForm} />

      <PrivateRoute exact path="/dashboard" layout={MainLayout} component={AsyncDashboard} />
      <PrivateRoute exact path="/reports" layout={MainLayout} component={AsyncReports} />
      <PrivateRoute exact path="/report-types" layout={MainLayout} component={AsyncReportTypes} />
      <PrivateRoute exact path="/students" layout={MainLayout} component={AsyncStudents} />
      <PrivateRoute exact path="/teachers" layout={MainLayout} component={AsyncTeachers} />

      <Route component={NotFound} />
    </Switch>
  </Fragment>
);

export default Router;
