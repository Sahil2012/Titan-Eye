import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";

export default function AppBar() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogin = () => {
    navigate("/");
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      handleDrawerToggle();
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const drawer = (
    <div>
      <List>
        {currentUser ? (
          <>
            <ListItem button onClick={() => handleNavigation("/dashboard")}>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button onClick={() => handleNavigation("/addClient")}>
              <ListItemText primary="Add Client" />
            </ListItem>
            <ListItem button onClick={() => handleNavigation("/addProducts")}>
              <ListItemText primary="Manage Products" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        ) : (
          <ListItem button onClick={handleLogin}>
            <ListItemText primary="Login" />
          </ListItem>
        )}
      </List>
    </div>
  );

  return (
    <div>
      <MuiAppBar position="static">
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Titan Eye
          </Typography>
          {!isMobile && (
            <div>
              {currentUser ? (
                <>
                  <Button
                    sx={{
                      backgroundColor: isActive("/dashboard") ? "white" : "transparent",
                      color: isActive("/dashboard") ? "#146EB4" : "white",
                    }}
                    onClick={() => handleNavigation("/dashboard")}
                  >
                    Dashboard
                  </Button>
                  <Button
                    sx={{
                      backgroundColor: isActive("/addClient") ? "white" : "transparent",
                      color: isActive("/addClient") ? "#146EB4" : "white",
                    }}
                    onClick={() => handleNavigation("/addClient")}
                  >
                    Add Client
                  </Button>
                  <Button
                    sx={{
                      backgroundColor: isActive("/addProducts") ? "white" : "transparent",
                      color: isActive("/addProducts") ? "#146EB4" : "white",
                    }}
                    onClick={() => handleNavigation("/addProducts")}
                  >
                    Manage Products
                  </Button>
                  <Button color="inherit" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <Button color="inherit" onClick={handleLogin}>
                  Login
                </Button>
              )}
            </div>
          )}
        </Toolbar>
      </MuiAppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            width: '240px',
          },
        }}
      >
        {drawer}
      </Drawer>
    </div>
  );
}
