import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
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
import { NavLink, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
}));

const MiniDrawer = ({ navDrawerOpen, handleToggleDrawer }) => {
  const classes = useStyles();
  const location = useLocation();

  const getNavLinkItem = (url, Icon, text) => (
    <NavLink style={{ textDecoration: 'none', color: 'initial' }} to={url}>
      <ListItem button selected={location.pathname === url}>
        <ListItemIcon>
          <Icon />
        </ListItemIcon>
        <ListItemText primary={text} />
      </ListItem>
    </NavLink>
  );

  return (
    <Drawer
      variant="permanent"
      classes={{
        paper: clsx(classes.drawerPaper, !navDrawerOpen && classes.drawerPaperClose),
      }}
      open={navDrawerOpen}
    >
      <div className={classes.toolbarIcon}>
        <IconButton onClick={handleToggleDrawer}>
          <ChevronRightIcon />
        </IconButton>
      </div>
      <Divider />
      <List>
        <div>
          {getNavLinkItem('/dashboard', DashboardIcon, 'לוח בקרה')}
          {getNavLinkItem('/students', PeopleIcon, 'תלמידות')}
          {getNavLinkItem('/teachers', SupervisedUserCircleIcon, 'מורות')}
          {getNavLinkItem('/groups', GroupIcon, 'קבוצות')}
          {getNavLinkItem('/student-groups', GroupAddIcon, 'שיוך תלמידות לקבוצות')}
          {getNavLinkItem('/lessons', EventNoteIcon, 'שיעורים')}
          {getNavLinkItem('/lesson-times', FormatListNumberedRtlIcon, 'זמני שיעור')}
          {getNavLinkItem('/att-types', MenuIcon, 'סוגי דיווח')}
          {getNavLinkItem('/att-reports', AssignmentTurnedInIcon, 'דיווחים')}
        </div>
      </List>
      <Divider />
      <List>
        <div>{getNavLinkItem('/excel-import', FileCopyIcon, 'העלאת קבצים')}</div>
        <div>{getNavLinkItem('/report-edit', AssignmentIcon, 'עריכת דוחות')}</div>
      </List>
      {/* <List>
        <div>
          {getNavLinkItem('/student-reports', AssignmentIcon, 'דו"ח לתלמידה')}
          {getNavLinkItem('/teacher-reports', AssignmentIcon, 'דו"ח למורה')}
          {getNavLinkItem('/organization-reports', AssignmentIcon, 'דו"ח לארגון צפיה')}
        </div>
      </List> */}
    </Drawer>
  );
};

export default MiniDrawer;
