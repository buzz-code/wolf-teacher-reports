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
  ListSubheader,
} from '@material-ui/core';
import {
  ChevronRight,
  Dashboard,
  ShoppingCart,
  People,
  BarChart,
  Layers,
  Assignment,
} from '@material-ui/icons';

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
          <ListItem button>
            <ListItemIcon>
              <Dashboard />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <ShoppingCart />
            </ListItemIcon>
            <ListItemText primary="Orders" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <People />
            </ListItemIcon>
            <ListItemText primary="Customers" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <BarChart />
            </ListItemIcon>
            <ListItemText primary="Reports" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <Layers />
            </ListItemIcon>
            <ListItemText primary="Integrations" />
          </ListItem>
        </div>
      </List>
      <Divider />
      <List>
        <div>
          <ListSubheader inset>Saved reports</ListSubheader>
          <ListItem button>
            <ListItemIcon>
              <Assignment />
            </ListItemIcon>
            <ListItemText primary="Current month" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <Assignment />
            </ListItemIcon>
            <ListItemText primary="Last quarter" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <Assignment />
            </ListItemIcon>
            <ListItemText primary="Year-end sale" />
          </ListItem>
        </div>
      </List>
    </Drawer>
  );
};

export default MiniDrawer;
