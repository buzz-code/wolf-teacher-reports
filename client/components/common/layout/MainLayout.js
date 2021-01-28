import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

// Import custom components
import Header from '../header/Header';
import MiniDrawer from '../drawer/MiniDrawer';
import Footer from '../footer/Footer';

const drawerWidth = 240;

const styles = (theme) => ({
  root: {
    width: '100%',
    height: 'auto',
    minHeight: '100%',
    zIndex: 1,
    overflow: 'hidden',
  },
  appFrame: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
    minHeight: '100vh',
  },
  content: {
    width: `calc(100% - ${theme.spacing(7)}px - 48px)`,
    flexGrow: 1,
    padding: 24,
    height: 'calc(100% - 56px)',
    marginTop: 56,
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${theme.spacing(9)}px - 48px)`,
      height: 'calc(100% - 64px)',
      marginTop: 64,
    },
    transition: theme.transitions.create(['width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  contentShift: {
    width: `calc(100% - ${drawerWidth}px - 48px)`,
    transition: theme.transitions.create(['width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
});

const MainLayout = (props) => {
  const { classes, children } = props;
  const [open, setOpen] = useState(true);

  const handleToggle = () => setOpen(!open);

  return (
    <div className={classes.root}>
      <div className={classes.appFrame}>
        <Header navDrawerOpen={open} handleToggleDrawer={handleToggle} />
        <MiniDrawer navDrawerOpen={open} handleToggleDrawer={handleToggle} />
        <main className={clsx(classes.content, open && classes.contentShift)}>{children}</main>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

MainLayout.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.element,
};

export default withStyles(styles)(MainLayout);
