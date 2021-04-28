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
import { NavLink, useLocation } from 'react-router-dom';
import routeConfig from '../../../constants/route-config';

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
      {routeConfig.map((item) => (
        <>
          <Divider />
          <List>
            <div>{item.map((item) => getNavLinkItem(item.path, item.icon, item.title))}</div>
          </List>
        </>
      ))}
    </Drawer>
  );
};

export default MiniDrawer;
