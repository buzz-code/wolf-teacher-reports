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
const AsyncStudents = loadable(() => import('../containers/students/StudentsContainer'));
const AsyncTeachers = loadable(() => import('../containers/teachers/TeachersContainer'));
const AsyncGroups = loadable(() => import('../containers/groups/GroupsContainer'));
const AsyncStudentGroups = loadable(() =>
  import('../containers/student-groups/StudentGroupsContainer')
);
const AsyncLessons = loadable(() => import('../containers/lessons/LessonsContainer'));
const AsyncLessonTimes = loadable(() => import('../containers/lesson-times/LessonTimesContainer'));
const AsyncAttTypes = loadable(() => import('../containers/att-types/AttTypesContainer'));
const AsyncAttReports = loadable(() => import('../containers/att-reports/AttReportsContainer'));
const AsyncReportEdit = loadable(() => import('../containers/report-edit/ReportEditContainer'));
// const AsyncStudentReports = loadable(() =>
//   import('../containers/studentReports/StudentReportsContainer')
// );
// const AsyncTeacherReports = loadable(() =>
//   import('../containers/teacherReports/TeacherReportsContainer')
// );
// const AsyncOrganizationReports = loadable(() =>
//   import('../containers/organizationReports/OrganizationReportsContainer')
// );

const Router = () => (
  <Fragment>
    <Switch>
      <RestrictRoute exact path="/" component={AsyncLoginForm} />
      <RestrictRoute exact path="/signup" component={AsyncSignUpForm} />

      <PrivateRoute exact path="/dashboard" layout={MainLayout} component={AsyncDashboard} />
      <PrivateRoute exact path="/students" layout={MainLayout} component={AsyncStudents} />
      <PrivateRoute exact path="/teachers" layout={MainLayout} component={AsyncTeachers} />
      <PrivateRoute exact path="/groups" layout={MainLayout} component={AsyncGroups} />
      <PrivateRoute
        exact
        path="/student-groups"
        layout={MainLayout}
        component={AsyncStudentGroups}
      />
      <PrivateRoute exact path="/lessons" layout={MainLayout} component={AsyncLessons} />
      <PrivateRoute exact path="/lesson-times" layout={MainLayout} component={AsyncLessonTimes} />
      <PrivateRoute exact path="/att-types" layout={MainLayout} component={AsyncAttTypes} />
      <PrivateRoute exact path="/att-reports" layout={MainLayout} component={AsyncAttReports} />

      <PrivateRoute exact path="/report-edit" layout={MainLayout} component={AsyncReportEdit} />

      {/* <PrivateRoute
        exact
        path="/student-reports"
        layout={MainLayout}
        component={AsyncStudentReports}
      />
      <PrivateRoute
        exact
        path="/teacher-reports"
        layout={MainLayout}
        component={AsyncTeacherReports}
      />
      <PrivateRoute
        exact
        path="/organization-reports"
        layout={MainLayout}
        component={AsyncOrganizationReports}
      /> */}

      <Route component={NotFound} />
    </Switch>
  </Fragment>
);

export default Router;
