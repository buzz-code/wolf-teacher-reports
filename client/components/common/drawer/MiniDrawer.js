import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {
  Drawer,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import {
  ChevronRight,
  Dashboard,
  ListAlt,
  People,
  SupervisedUserCircle,
  List as ListIcon,
  Chat,
  Assignment,
} from '@material-ui/icons';
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
          <ChevronRight />
        </IconButton>
      </div>
      <Divider />
      <List>
        <div>
          {getNavLinkItem('/dashboard', Dashboard, 'לוח בקרה')}
          {getNavLinkItem('/reports', ListAlt, 'צפיות')}
          {getNavLinkItem('/students', People, 'תלמידות')}
          {getNavLinkItem('/teachers', SupervisedUserCircle, 'מורות')}
          {getNavLinkItem('/report-types', ListIcon, 'סוגי צפיה')}
          {getNavLinkItem('/texts', Chat, 'הודעות')}
        </div>
      </List>
      <Divider />
      <List>
        <div>
          {getNavLinkItem('/student-reports', Assignment, 'דו"ח לתלמידה')}
          {getNavLinkItem('/teacher-reports', Assignment, 'דו"ח למורה')}
          {getNavLinkItem('/organization-reports', Assignment, 'דו"ח לארגון צפיה')}
        </div>
      </List>
    </Drawer>
  );
};

export default MiniDrawer;
