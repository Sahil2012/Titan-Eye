import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import SearchBar from "./SearchBar";
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";

export default function AppBar() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get current location
  const auth = getAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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

  // Function to check if a path matches the current location
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div>
      <MuiAppBar position="static">
        <Toolbar>
         
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Titan Eye
          </Typography>
          <div>
            {currentUser ? (
              <div>
               <Button
                  sx={{
                    backgroundColor: isActive("/dashboard") ? "white" : "transparent",
                    color: isActive("/dashboard") ? "#146EB4" : "white",
                  }}
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </Button>
                <Button
                  sx={{
                    backgroundColor: isActive("/addClient") ? "white" : "transparent",
                    color: isActive("/addClient") ? "#146EB4" : "white",
                  }}
                  onClick={() => navigate("/addClient")}
                >
                  Add Client
                </Button>
                <Button
                  sx={{
                    backgroundColor: isActive("/addProducts") ? "white" : "transparent",
                    color: isActive("/addProducts") ? "#146EB4" : "white",
                  }}
                  onClick={() => navigate("/addProducts")}
                >
                  Manage Products
                </Button>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <Button color="inherit" onClick={handleLogin}>
                Login
              </Button>
            )}
          </div>
        </Toolbar>
      </MuiAppBar>
      
    </div>
  );
}
