import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar, Box, CssBaseline, Drawer, IconButton, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography,
  Avatar, Menu, MenuItem, Divider, Container, Paper, BottomNavigation,
  BottomNavigationAction, useTheme, useMediaQuery
} from "@mui/material";
import {
  Dashboard, AddCircle, ListAlt, AdminPanelSettings, Logout,
  Person, Business
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { logout } from "../../services/authService";
import { APP_NAME } from "../../utils/constants";
import { iosColors } from "../../styles/iosTheme"; // Import your iOS colors

const desktopDrawerWidth = 260;

const MainLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = useState(null);
  const isManager = user?.email?.includes("manager") || false;

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
    { text: "New Visit", icon: <AddCircle />, path: "/new-visit" },
    { text: "Reports", icon: <ListAlt />, path: "/visits" },
    ...(isManager ? [{ text: "Admin", icon: <AdminPanelSettings />, path: "/admin" }] : []),
  ];

  // Desktop Sidebar
  const desktopDrawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: iosColors.background }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ 
          bgcolor: iosColors.systemBlue, color: 'white', p: 1, 
          borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' 
        }}>
          <Business />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>{APP_NAME}</Typography>
      </Box>

      <List sx={{ px: 2, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname.includes(item.path);
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  bgcolor: isActive ? 'rgba(0, 122, 255, 0.1)' : 'transparent',
                  color: isActive ? iosColors.systemBlue : iosColors.label,
                  '&:hover': { bgcolor: 'rgba(0, 122, 255, 0.05)' }
                }}
              >
                <ListItemIcon sx={{ 
                  color: isActive ? iosColors.systemBlue : iosColors.systemGray, 
                  minWidth: 40 
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ fontWeight: isActive ? 600 : 400 }} 
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ p: 2, pb: 4 }}>
        <Paper elevation={0} sx={{ 
          p: 2, borderRadius: 3, bgcolor: 'white', display: 'flex', 
          alignItems: 'center', gap: 2, border: `1px solid ${iosColors.separator}`
        }}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: iosColors.systemGray4 }}>
            <Person sx={{ color: 'white' }} />
          </Avatar>
          <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
              {user?.email?.split('@')[0]}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              {isManager ? 'Manager' : 'Sales Rep'}
            </Typography>
          </Box>
          <IconButton size="small" onClick={handleLogout} sx={{ color: iosColors.systemRed }}>
            <Logout fontSize="small" />
          </IconButton>
        </Paper>
      </Box>
    </Box>
  );

  // Get dynamic title for Header based on route
  const getPageTitle = () => {
    if (location.pathname.includes('/dashboard')) return "Dashboard";
    if (location.pathname.includes('/new-visit') || location.pathname.includes('/edit-visit')) return "Visit Form";
    if (location.pathname.includes('/visits')) return "Reports";
    if (location.pathname.includes('/admin')) return "Admin";
    return APP_NAME;
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: iosColors.background }}>
      <CssBaseline />

      {/* Desktop Drawer */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: desktopDrawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: desktopDrawerWidth,
              boxSizing: "border-box",
              borderRight: `1px solid ${iosColors.separator}`,
            },
          }}
        >
          {desktopDrawer}
        </Drawer>
      )}

      {/* Main Content Area */}
      <Box sx={{ 
        flexGrow: 1, 
        display: "flex", 
        flexDirection: "column",
        width: isMobile ? '100%' : `calc(100% - ${desktopDrawerWidth}px)`,
        pb: isMobile ? '80px' : 0 // Padding for bottom nav
      }}>
        
        {/* iOS Styled Header */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: 'rgba(242, 242, 247, 0.8)', // iOS Background Blur
            backdropFilter: 'blur(20px) saturate(180%)',
            borderBottom: `0.5px solid ${iosColors.separator}`,
            color: iosColors.label,
          }}
        >
          <Toolbar sx={{ justifyContent: isMobile ? 'center' : 'space-between' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '17px' }}>
              {getPageTitle()}
            </Typography>

            {/* Desktop header right side */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" sx={{ color: iosColors.secondaryLabel }}>
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </Typography>
              </Box>
            )}
            
            {/* Mobile Profile Icon (top right) */}
            {isMobile && (
               <IconButton 
                onClick={handleMenuOpen} 
                sx={{ position: 'absolute', right: 16 }}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: iosColors.systemBlue }}>
                  {user?.email?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            )}
          </Toolbar>
        </AppBar>

        {/* Mobile Profile Menu */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem disabled>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{user?.email}</Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ color: iosColors.systemRed }}>
            <ListItemIcon><Logout fontSize="small" sx={{ color: 'inherit' }} /></ListItemIcon>
            Logout
          </MenuItem>
        </Menu>

        {/* Page Content */}
        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
          <Outlet />
        </Box>
      </Box>

      {/* iOS Bottom Navigation (Mobile Only) */}
      {isMobile && (
        <Paper 
          elevation={0} 
          sx={{ 
            position: 'fixed', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            zIndex: 1000,
            bgcolor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(20px) saturate(180%)',
            borderTop: `0.5px solid ${iosColors.separator}`,
            pb: 'env(safe-area-inset-bottom)' // Respects iPhone home indicator
          }}
        >
          <BottomNavigation
            value={location.pathname}
            onChange={(_, newValue) => navigate(newValue)}
            sx={{ bgcolor: 'transparent', height: 65 }}
          >
            {menuItems.map((item) => (
              <BottomNavigationAction
                key={item.path}
                label={item.text}
                value={item.path}
                icon={item.icon}
                sx={{
                  color: location.pathname.includes(item.path) ? iosColors.systemBlue : iosColors.systemGray,
                  '& .MuiBottomNavigationAction-label': {
                    fontSize: '10px',
                    fontWeight: location.pathname.includes(item.path) ? 600 : 400,
                    mt: 0.5
                  }
                }}
              />
            ))}
          </BottomNavigation>
        </Paper>
      )}
    </Box>
  );
};

export default MainLayout;
