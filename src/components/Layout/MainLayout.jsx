import React, { useState } from "react";

import { Outlet, useNavigate } from "react-router-dom";

import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Container,
  Link,
} from "@mui/material";

import {
  Menu as MenuIcon,
  Dashboard,
  AddCircle,
  ListAlt,
  AdminPanelSettings,
  Logout,
  Person,
  Business,
  Assessment,
  TrendingUp,
} from "@mui/icons-material";

import { useAuth } from "../../context/AuthContext";

import { logout } from "../../services/authService";

import { APP_NAME, FOOTER_TEXT, SUPPORT_EMAIL } from "../../utils/constants";

const drawerWidth = 260;

const MainLayout = () => {
  const { user } = useAuth();

  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);

  const isManager = user?.email?.includes("manager") || false;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();

    navigate("/login");
  };

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },

    { text: "New Visit", icon: <AddCircle />, path: "/new-visit" },

    { text: "Visit Reports", icon: <ListAlt />, path: "/visits" },

    ...(isManager
      ? [{ text: "Manager View", icon: <AdminPanelSettings />, path: "/admin" }]
      : []),
  ];

  const drawer = (
    <div>
      <Toolbar
        sx={{
          justifyContent: "center",

          bgcolor: "primary.main",

          color: "white",

          flexDirection: "column",

          py: 2,
        }}
      >
        <Business sx={{ fontSize: 40, mb: 1 }} />

        <Typography
          variant="h6"
          noWrap
          sx={{ fontWeight: "bold", textAlign: "center" }}
        >
          {APP_NAME}
        </Typography>

        <Typography variant="caption" sx={{ opacity: 0.9, mt: 0.5 }}>
          AI-Powered Sales Intelligence
        </Typography>
      </Toolbar>

      <Divider />

      <List sx={{ pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => navigate(item.path)}
              sx={{
                mx: 1,

                borderRadius: 1,

                "&:hover": {
                  bgcolor: "primary.light",

                  color: "white",

                  "& .MuiListItemIcon-root": {
                    color: "white",
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: "primary.main", minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: "medium",

                  fontSize: "0.95rem",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Sidebar Footer */}

      <Box
        sx={{
          mt: "auto",

          p: 2,

          bgcolor: "grey.50",

          borderTop: 1,

          borderColor: "divider",
        }}
      >
        <Typography variant="caption" color="text.secondary" display="block">
          {FOOTER_TEXT}
        </Typography>

        <Link
          href={`mailto:${SUPPORT_EMAIL}`}
          variant="caption"
          color="primary"
          sx={{
            textDecoration: "none",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          For Support: {SUPPORT_EMAIL}
        </Link>
      </Box>
    </div>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },

          ml: { sm: `${drawerWidth}px` },

          bgcolor: "background.paper",

          color: "text.primary",

          boxShadow: 1,

          borderBottom: 1,

          borderColor: "divider",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" }, color: "primary.main" }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <TrendingUp sx={{ color: "primary.main", mr: 1 }} />

            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                fontWeight: "bold",

                background: "linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)",

                WebkitBackgroundClip: "text",

                WebkitTextFillColor: "transparent",
              }}
            >
              {window.location.pathname === "/dashboard"
                ? "Dashboard"
                : window.location.pathname === "/new-visit"
                  ? "New Visit"
                  : window.location.pathname === "/visits"
                    ? "Visit Reports"
                    : window.location.pathname === "/admin"
                      ? "Manager Dashboard"
                      : APP_NAME}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              {user?.email}
            </Typography>

            <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
              <Avatar sx={{ bgcolor: "primary.main" }}>
                <Person />
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem disabled sx={{ opacity: 1 }}>
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {user?.email?.split("@")[0]}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    {isManager ? "Manager" : "Sales Representative"}
                  </Typography>
                </Box>
              </MenuItem>

              <Divider />

              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: "flex", flexGrow: 1 }}>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: "block", sm: "none" },

              "& .MuiDrawer-paper": {
                boxSizing: "border-box",

                width: drawerWidth,

                borderRight: 1,

                borderColor: "divider",
              },
            }}
          >
            {drawer}
          </Drawer>

          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },

              "& .MuiDrawer-paper": {
                boxSizing: "border-box",

                width: drawerWidth,

                borderRight: 1,

                borderColor: "divider",

                display: "flex",

                flexDirection: "column",
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,

            p: 3,

            width: { sm: `calc(100% - ${drawerWidth}px)` },

            mt: 8,

            display: "flex",

            flexDirection: "column",

            minHeight: "calc(100vh - 64px)",
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Outlet />
          </Box>

          {/* Main Footer */}

          <Container
            maxWidth={false}
            sx={{
              mt: 4,

              py: 2,

              borderTop: 1,

              borderColor: "divider",

              textAlign: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {FOOTER_TEXT}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 1 }}
            >
              © {new Date().getFullYear()} RV Solutions. All rights reserved.
            </Typography>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;