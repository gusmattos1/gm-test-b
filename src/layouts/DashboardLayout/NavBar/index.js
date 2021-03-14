import {
  Avatar,
  Box,
  Divider,
  Drawer,
  Hidden,
  List,
  makeStyles,
  Typography,
} from "@material-ui/core";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PersonIcon from "@material-ui/icons/Person";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import Logout from "src/views/Logout/Logout";
import NavItem from "./NavItem";

const items = [
  {
    href: "/dashboard",
    icon: DashboardIcon,
    title: "Dashboard",
  },
  {
    href: "/newdashboard",
    icon: StarBorderIcon,
    title: "New Dashboard",
  },
  {
    href: "/profile",
    icon: PersonIcon,
    title: "Profile",
  },
];

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256,
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: "calc(100% - 64px)",
  },
  avatar: {
    cursor: "pointer",
    width: 64,
    height: 64,
  },
  logout: {
    position: "fixed",
    bottom: 0,
  },
}));

const NavBar = ({ onMobileClose, openMobile, user, setUserLogged }) => {
  const classes = useStyles();
  const location = useLocation();

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const content = (
    <Box height="100%" display="flex" flexDirection="column">
      <Box alignItems="center" display="flex" flexDirection="column" p={2}>
        <Avatar
          className={classes.avatar}
          component={RouterLink}
          src={user?.imageUrl}
          to="/profile"
        />
        <Typography className={classes.name} color="textPrimary" variant="h5">
          {user?.name || ""}
        </Typography>
        <Typography color="textSecondary" variant="body2">
          {user?.email || ""}
        </Typography>
      </Box>
      <Divider />
      <Box p={2}>
        <List>
          {items.map((item) => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
            />
          ))}
        </List>
      </Box>
      <Box p={2} className={classes.logout}>
        <Typography color="textSecondary" variant="body2" align="center">
          Logout
          <Logout setUserLogged={setUserLogged} />
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool,
};

NavBar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false,
};

export default NavBar;
