import DashboardIcon from '@material-ui/icons/Dashboard';
import ListAltIcon from '@material-ui/icons/ListAlt';
import PeopleIcon from '@material-ui/icons/People';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import ListIcon from '@material-ui/icons/List';
import GroupIcon from '@material-ui/icons/Group';
import ChatIcon from '@material-ui/icons/Chat';
import AssignmentIcon from '@material-ui/icons/Assignment';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import FormatListNumberedRtlIcon from '@material-ui/icons/FormatListNumberedRtl';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import EventNoteIcon from '@material-ui/icons/EventNote';
import MenuIcon from '@material-ui/icons/Menu';
import FileCopyIcon from '@material-ui/icons/FileCopy';

import * as entities from './entity';
import * as titles from './entity-title';

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

export default [
  [
    {
      path: '/dashboard',
      component: Dashboard,
      icon: DashboardIcon,
      title: titles.DASHBOARD,
      props: { entity: entities.DASHBOARD, title: titles.DASHBOARD },
    },
    {
      path: '/students',
      component: Students,
      icon: PeopleIcon,
      title: titles.STUDENTS,
      props: { entity: entities.STUDENTS, title: titles.STUDENTS },
    },
    {
      path: '/teachers',
      component: Teachers,
      icon: SupervisedUserCircleIcon,
      title: titles.TEACHERS,
      props: { entity: entities.TEACHERS, title: titles.TEACHERS },
    },
    {
      path: '/groups',
      component: Groups,
      icon: GroupIcon,
      title: titles.GROUPS,
      props: { entity: entities.GROUPS, title: titles.GROUPS },
    },
    {
      path: '/student-groups',
      component: StudentGroups,
      icon: GroupAddIcon,
      title: titles.STUDENT_GROUPS,
      props: { entity: entities.STUDENT_GROUPS, title: titles.STUDENT_GROUPS },
    },
    {
      path: '/lessons',
      component: Lessons,
      icon: EventNoteIcon,
      title: titles.LESSONS,
      props: { entity: entities.LESSONS, title: titles.LESSONS },
    },
    {
      path: '/lesson-times',
      component: LessonTimes,
      icon: FormatListNumberedRtlIcon,
      title: titles.LESSON_TIMES,
      props: { entity: entities.LESSON_TIMES, title: titles.LESSON_TIMES },
    },
    {
      path: '/att-types',
      component: AttTypes,
      icon: MenuIcon,
      title: titles.ATT_TYPES,
      props: { entity: entities.ATT_TYPES, title: titles.ATT_TYPES },
    },
    {
      path: '/att-reports',
      component: AttReports,
      icon: AssignmentTurnedInIcon,
      title: titles.ATT_REPORTS,
      props: { entity: entities.ATT_REPORTS, title: titles.ATT_REPORTS },
    },
  ],
  [
    { path: '/excel-import', component: ExcelImport, icon: FileCopyIcon, title: 'העלאת קבצים' },
    {
      path: '/report-edit',
      component: ReportEdit,
      icon: AssignmentIcon,
      title: titles.REPORT_EDIT,
      props: { entity: entities.REPORT_EDIT, title: titles.REPORT_EDIT },
    },
  ],
  // [
  //   {
  //     path: '/student-reports',
  //     component: StudentReports,
  //     icon: AssignmentIcon,
  //     title: titles.STUDENT_REPORTS,
  //     props: { entity: entities.STUDENT_REPORTS, title: titles.STUDENT_REPORTS },
  //   },
  //   {
  //     path: '/teacher-reports',
  //     component: TeacherReports,
  //     icon: AssignmentIcon,
  //     title: titles.TEACHER_REPORTS,
  //     props: { entity: entities.TEACHER_REPORTS, title: titles.TEACHER_REPORTS },
  //   },
  //   {
  //     path: '/organization-reports',
  //     component: OrganizationReports,
  //     icon: AssignmentIcon,
  //     title: titles.ORGANIATION_REPORTS,
  //     props: { entity: entities.ORGANIATION_REPORTS, title: titles.ORGANIATION_REPORTS },
  //   },
  //   {
  //     path: '/daily-reports',
  //     component: DailyReports,
  //     icon: AssignmentIcon,
  //     title: titles.DAILY_REPORTS,
  //     props: { entity: entities.DAILY_REPORTS, title: titles.DAILY_REPORTS },
  //   },
  //   {
  //     path: '/monthly-reports',
  //     component: MonthlyReports,
  //     icon: AssignmentIcon,
  //     title: titles.MONTHLY_REPORTS,
  //     props: { entity: entities.MONTHLY_REPORTS, title: titles.MONTHLY_REPORTS },
  //   },
  // ],
];
