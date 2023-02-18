import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import FriendSearchBar from "../FriendSearchBar/FriendSearchBar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { Link } from "react-router-dom";
import classes from "./Header.module.css";
import { logoutRequest } from "../../store/auth-slice";
import { AnyAction } from "@reduxjs/toolkit";

const Header = () => {
  const isAuth = useSelector<RootState, boolean>((state) => state.auth.isAuth);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const dispatch = useDispatch();
  
  const logoutHandler = () => {
    dispatch(logoutRequest() as unknown as AnyAction);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{ flexGrow: 1 }}
      position="fixed"
      width="100vw"
      zIndex={100}
      top={0}
    >
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontSize: "1.8rem" }}
          >
            React Messenger
          </Typography>
          {isAuth && <FriendSearchBar />}
          <div>
            <IconButton
              sx={{
                marginLeft: "4rem",
              }}
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle fontSize="large" />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {isAuth && (
                <MenuItem onClick={handleClose}>
                  <Link
                    to="login"
                    className={classes.header_link}
                    style={{ marginBottom: 0 }}
                    onClick={logoutHandler}
                  >
                    Logout
                  </Link>
                </MenuItem>
              )}
              {!isAuth && (
                <MenuItem onClick={handleClose}>
                  <Link to="login" className={classes.header_link}>
                    Login
                  </Link>
                </MenuItem>
              )}
              {!isAuth && (
                <MenuItem onClick={handleClose}>
                  <Link to="register" className={classes.header_link}>
                    Register
                  </Link>
                </MenuItem>
              )}
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
