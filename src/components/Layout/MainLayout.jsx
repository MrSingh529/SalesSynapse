import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
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
  Badge,
  Fade,
  Slide,
  Zoom,
  useScrollTrigger,
  useMediaQuery,
  useTheme,
  BottomNavigation,
  BottomNavigationAction,
  Paper
} from '@mui/material';
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
  Home,
  Notifications,
  Search,
  Settings,
  ChevronLeft,
  ChevronRight,
  MoreVert,
  Today,
  BarChart,
  Insights,
  AutoAwesome,
  AccountCircle
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { logout } from '../../services/authService';
import { APP_NAME, FOOTER_TEXT, SUPPORT_EMAIL } from '../../utils/constants';
import { iOSUtils, iOSStyles } from '../../utils/iosAnimations';

const drawerWidth = 280;
const mobileDrawerWidth = '85vw';

const MainLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [bottomNavValue, setBottomNavValue] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(3);
  const drawerRef = useRef(null);

  const isManager = user?.email?.includes('manager') || false;

  // iOS-style scroll detection for dynamic app bar
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 10,
  });

  useEffect(() => {
    setScrolled(trigger);
    
    // Update bottom navigation based on route
    const path = location.pathname;
    if (path === '/dashboard') setBottomNavValue(0);
    else if (path === '/new-visit') setBottomNavValue(1);
    else if (path === '/visits') setBottomNavValue(2);
    else if (path === '/admin') setBottomNavValue(3);
    
    // Apply iOS utilities
    iOSUtils.setupViewportHeight();
    
    return () => {
      // Cleanup if needed
    };
  }, [location.pathname, trigger]);

  const handleDrawerToggle = () => {
    iOSUtils.hapticFeedback('light');
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    iOSUtils.hapticFeedback('light');
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    iOSUtils.hapticFeedback('medium');
    await logout();
    navigate('/login');
  };

  const handleNavigation = (path) => {
    iOSUtils.hapticFeedback('light');
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleBottomNavChange = (event, newValue) => {
    iOSUtils.hapticFeedback('light');
    setBottomNavValue(newValue);
    
    const paths = ['/dashboard', '/new-visit', '/visits', '/admin'];
    if (paths[newValue]) {
      navigate(paths[newValue]);
    }
  };

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard', badge: 0 },
    { text: 'New Visit', icon: <AddCircle />, path: '/new-visit', badge: 0 },
    { text: 'Visit Reports', icon: <ListAlt />, path: '/visits', badge: 5 },
    ...(isManager ? [{ text: 'Manager View', icon: <AdminPanelSettings />, path: '/admin', badge: 0 }] : []),
    { text: 'Analytics', icon: <BarChart />, path: '/analytics', badge: 0 },
    { text: 'AI Insights', icon: <AutoAwesome />, path: '/ai-insights', badge: 2 },
  ];

  const bottomNavItems = [
    { label: 'Home', icon: <Home />, value: 0, path: '/dashboard' },
    { label: 'New Visit', icon: <AddCircle />, value: 1, path: '/new-visit' },
    { label: 'Reports', icon: <ListAlt />, value: 2, path: '/visits' },
    ...(isManager ? [{ label: 'Manager', icon: <AdminPanelSettings />, value: 3, path: '/admin' }] : []),
  ];

  const drawer = (
    <Box
      ref={drawerRef}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F2F2F7 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Drawer Header with iOS-style blur */}
      <Box
        sx={{
          p: 3,
          pb: 2,
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${iOSStyles.colors.systemGray5}`,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 2,
          }}
        >
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: iOSStyles.colors.systemBlue,
              boxShadow: `0 4px 12px ${iOSStyles.colors.systemBlue}40`,
            }}
          >
            <Business sx={{ fontSize: 28 }} />
          </Avatar>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                background: `linear-gradient(135deg, ${iOSStyles.colors.systemBlue} 0%, ${iOSStyles.colors.systemPurple} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 0.5,
              }}
            >
              {APP_NAME}
            </Typography>
            <Typography variant="caption" sx={{ color: iOSStyles.colors.secondaryLabel }}>
              AI-Powered Sales Intelligence
            </Typography>
          </Box>
        </Box>

        {/* User Info */}
        <Box
          sx={{
            p: 2,
            borderRadius: iOSStyles.borderRadius.large,
            backgroundColor: iOSStyles.colors.systemGray6,
            border: `1px solid ${iOSStyles.colors.systemGray5}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: iOSStyles.colors.systemGreen,
              }}
            >
              <Person />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle2" fontWeight={600}>
                {user?.email?.split('@')[0] || 'User'}
              </Typography>
              <Typography variant="caption" sx={{ color: iOSStyles.colors.secondaryLabel }}>
                {isManager ? 'Manager' : 'Sales Representative'}
              </Typography>
            </Box>
            <Badge
              badgeContent={notificationsCount}
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: 10,
                  height: 18,
                  minWidth: 18,
                },
              }}
            >
              <Notifications sx={{ color: iOSStyles.colors.systemGray }} />
            </Badge>
          </Box>
        </Box>
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, overflowY: 'auto', py: 2 }}>
        <List sx={{ px: 1.5 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    mx: 0.5,
                    borderRadius: iOSStyles.borderRadius.medium,
                    backgroundColor: isActive ? `${iOSStyles.colors.systemBlue}14` : 'transparent',
                    border: `1px solid ${isActive ? iOSStyles.colors.systemBlue + '40' : 'transparent'}`,
                    '&:hover': {
                      backgroundColor: `${iOSStyles.colors.systemBlue}0A`,
                      transform: 'translateX(4px)',
                    },
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 36,
                      color: isActive ? iOSStyles.colors.systemBlue : iOSStyles.colors.systemGray,
                    }}
                  >
                    {item.badge > 0 ? (
                      <Badge
                        badgeContent={item.badge}
                        color="error"
                        sx={{
                          '& .MuiBadge-badge': {
                            fontSize: 9,
                            height: 16,
                            minWidth: 16,
                          },
                        }}
                      >
                        {item.icon}
                      </Badge>
                    ) : (
                      item.icon
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 600 : 500,
                      fontSize: '15px',
                      color: isActive ? iOSStyles.colors.systemBlue : iOSStyles.colors.label,
                    }}
                  />
                  {isActive && (
                    <ChevronRight
                      sx={{
                        fontSize: 20,
                        color: iOSStyles.colors.systemBlue,
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        {/* Divider with iOS style */}
        <Divider sx={{ mx: 2, my: 3, borderColor: iOSStyles.colors.systemGray5 }} />

        {/* Quick Actions */}
        <Box sx={{ px: 2.5, mb: 3 }}>
          <Typography variant="subtitle2" sx={{ color: iOSStyles.colors.secondaryLabel, mb: 2 }}>
            Quick Actions
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Box
              onClick={() => handleNavigation('/new-visit')}
              sx={{
                flex: 1,
                minWidth: '120px',
                p: 2,
                borderRadius: iOSStyles.borderRadius.medium,
                backgroundColor: iOSStyles.colors.systemGray6,
                border: `1px solid ${iOSStyles.colors.systemGray5}`,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: iOSStyles.colors.systemGray5,
                  transform: 'translateY(-2px)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
              }}
            >
              <AddCircle sx={{ color: iOSStyles.colors.systemBlue, mb: 1 }} />
              <Typography variant="caption" sx={{ display: 'block', color: iOSStyles.colors.label }}>
                New Visit
              </Typography>
            </Box>
            <Box
              onClick={() => handleNavigation('/visits')}
              sx={{
                flex: 1,
                minWidth: '120px',
                p: 2,
                borderRadius: iOSStyles.borderRadius.medium,
                backgroundColor: iOSStyles.colors.systemGray6,
                border: `1px solid ${iOSStyles.colors.systemGray5}`,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: iOSStyles.colors.systemGray5,
                  transform: 'translateY(-2px)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
              }}
            >
              <Today sx={{ color: iOSStyles.colors.systemGreen, mb: 1 }} />
              <Typography variant="caption" sx={{ display: 'block', color: iOSStyles.colors.label }}>
                Today's Visits
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Drawer Footer */}
      <Box
        sx={{
          p: 2,
          pt: 1.5,
          backgroundColor: iOSStyles.colors.systemGray6,
          borderTop: `1px solid ${iOSStyles.colors.systemGray5}`,
        }}
      >
        <Typography variant="caption" sx={{ color: iOSStyles.colors.secondaryLabel, display: 'block', mb: 1 }}>
          {FOOTER_TEXT}
        </Typography>
        <Link
          href={`mailto:${SUPPORT_EMAIL}`}
          variant="caption"
          sx={{
            color: iOSStyles.colors.systemBlue,
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          For Support: {SUPPORT_EMAIL}
        </Link>
      </Box>
    </Box>
  );

  const pageTitles = {
    '/dashboard': 'Dashboard',
    '/new-visit': 'New Visit',
    '/visits': 'Visit Reports',
    '/admin': 'Manager Dashboard',
    '/analytics': 'Analytics',
    '/ai-insights': 'AI Insights',
  };

  const currentTitle = pageTitles[location.pathname] || APP_NAME;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: iOSStyles.colors.systemGray6,
      }}
    >
      <CssBaseline />

      {/* iOS-style Dynamic App Bar with blur effect */}
      <Slide appear={false} direction="down" in={!scrolled}>
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            width: { md: `calc(100% - ${drawerWidth}px)` },
            ml: { md: `${drawerWidth}px` },
            backgroundColor: scrolled
              ? 'rgba(255, 255, 255, 0.8)'
              : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: `1px solid ${iOSStyles.colors.systemGray5}`,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: scrolled ? 'translateY(-100%)' : 'translateY(0)',
          }}
        >
          <Toolbar sx={{ minHeight: { xs: 56, md: 64 } }}>
            {/* Mobile Menu Button */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                mr: 2,
                display: { md: 'none' },
                color: iOSStyles.colors.label,
                backgroundColor: iOSStyles.colors.systemGray5,
                '&:hover': {
                  backgroundColor: iOSStyles.colors.systemGray4,
                },
                '&:active': {
                  transform: 'scale(0.95)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <MenuIcon />
            </IconButton>

            {/* Page Title with iOS-style animation */}
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <Fade in={true}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: iOSStyles.borderRadius.medium,
                      backgroundColor: iOSStyles.colors.systemBlue,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 2px 8px ${iOSStyles.colors.systemBlue}40`,
                    }}
                  >
                    <TrendingUp sx={{ fontSize: 18, color: 'white' }} />
                  </Box>
                  <Typography
                    variant="h6"
                    noWrap
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: '17px', md: '20px' },
                      color: iOSStyles.colors.label,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {currentTitle}
                  </Typography>
                </Box>
              </Fade>
            </Box>

            {/* Search and Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Search Button (iOS-style) */}
              <IconButton
                sx={{
                  color: iOSStyles.colors.label,
                  backgroundColor: iOSStyles.colors.systemGray5,
                  '&:hover': {
                    backgroundColor: iOSStyles.colors.systemGray4,
                  },
                  '&:active': {
                    transform: 'scale(0.95)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <Search />
              </IconButton>

              {/* Notifications with Badge */}
              <IconButton
                sx={{
                  color: iOSStyles.colors.label,
                  backgroundColor: iOSStyles.colors.systemGray5,
                  '&:hover': {
                    backgroundColor: iOSStyles.colors.systemGray4,
                  },
                  '&:active': {
                    transform: 'scale(0.95)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <Badge
                  badgeContent={notificationsCount}
                  color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      fontSize: 10,
                      height: 18,
                      minWidth: 18,
                    },
                  }}
                >
                  <Notifications />
                </Badge>
              </IconButton>

              {/* User Avatar Menu */}
              <IconButton
                onClick={handleMenuOpen}
                sx={{
                  p: 0,
                  ml: 1,
                  '&:active': {
                    transform: 'scale(0.95)',
                  },
                  transition: 'transform 0.2s ease',
                }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: iOSStyles.colors.systemBlue,
                    boxShadow: `0 2px 8px ${iOSStyles.colors.systemBlue}40`,
                  }}
                >
                  <AccountCircle />
                </Avatar>
              </IconButton>

              {/* More Options Menu */}
              <IconButton
                sx={{
                  color: iOSStyles.colors.label,
                  display: { xs: 'flex', md: 'none' },
                  '&:active': {
                    transform: 'scale(0.95)',
                  },
                  transition: 'transform 0.2s ease',
                }}
              >
                <MoreVert />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
      </Slide>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            borderRadius: iOSStyles.borderRadius.large,
            boxShadow: iOSStyles.shadows.large,
            minWidth: 220,
            overflow: 'hidden',
            border: `1px solid ${iOSStyles.colors.systemGray5}`,
          },
        }}
      >
        <MenuItem disabled sx={{ opacity: 1, py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: iOSStyles.colors.systemBlue,
              }}
            >
              <Person />
            </Avatar>
            <Box>
              <Typography variant="subtitle2" fontWeight="bold">
                {user?.email?.split('@')[0]}
              </Typography>
              <Typography variant="caption" sx={{ color: iOSStyles.colors.secondaryLabel }}>
                {isManager ? 'Manager' : 'Sales Representative'}
              </Typography>
            </Box>
          </Box>
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem onClick={() => handleNavigation('/profile')}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => handleNavigation('/settings')}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem onClick={handleLogout} sx={{ color: iOSStyles.colors.systemRed }}>
          <ListItemIcon>
            <Logout fontSize="small" sx={{ color: iOSStyles.colors.systemRed }} />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Main Layout */}
      <Box sx={{ display: 'flex', flexGrow: 1, pt: { xs: 7, md: 8 } }}>
        {/* Desktop Sidebar */}
        <Box
          component="nav"
          sx={{
            width: { md: drawerWidth },
            flexShrink: { md: 0 },
            display: { xs: 'none', md: 'block' },
          }}
        >
          <Drawer
            variant="permanent"
            open
            sx={{
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
                borderRight: `1px solid ${iOSStyles.colors.systemGray5}`,
                overflow: 'hidden',
              },
            }}
          >
            {drawer}
          </Drawer>
        </Box>

        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: mobileDrawerWidth,
              maxWidth: 320,
              boxSizing: 'border-box',
              borderRight: `1px solid ${iOSStyles.colors.systemGray5}`,
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Main Content Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { md: `calc(100% - ${drawerWidth}px)` },
            minHeight: 'calc(100vh - 56px)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Page Content with iOS-style animation */}
          <Box
            sx={{
              flexGrow: 1,
              p: { xs: 2, md: 3 },
              animation: 'fadeIn 0.3s ease-out',
              '@keyframes fadeIn': {
                from: { opacity: 0, transform: 'translateY(20px)' },
                to: { opacity: 1, transform: 'translateY(0)' },
              },
            }}
          >
            <Outlet />
          </Box>

          {/* Footer */}
          <Container maxWidth={false}>
            <Box
              sx={{
                py: 3,
                px: { xs: 2, md: 0 },
                borderTop: `1px solid ${iOSStyles.colors.systemGray5}`,
                textAlign: 'center',
                backgroundColor: iOSStyles.colors.systemBackground,
              }}
            >
              <Typography variant="body2" sx={{ color: iOSStyles.colors.secondaryLabel, mb: 1 }}>
                {FOOTER_TEXT}
              </Typography>
              <Typography variant="caption" sx={{ color: iOSStyles.colors.tertiaryLabel }}>
                © {new Date().getFullYear()} RV Solutions. All rights reserved.
              </Typography>
            </Box>
          </Container>
        </Box>
      </Box>

      {/* iOS-style Bottom Navigation for Mobile */}
      {isMobile && (
        <Slide appear={false} direction="up" in={!scrolled}>
          <Paper
            elevation={0}
            sx={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1100,
              borderTop: `1px solid ${iOSStyles.colors.systemGray5}`,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            <BottomNavigation
              value={bottomNavValue}
              onChange={handleBottomNavChange}
              sx={{
                height: 60,
                paddingBottom: 'env(safe-area-inset-bottom)',
                '& .MuiBottomNavigationAction-root': {
                  minWidth: 60,
                  color: iOSStyles.colors.secondaryLabel,
                  '&.Mui-selected': {
                    color: iOSStyles.colors.systemBlue,
                  },
                },
              }}
            >
              {bottomNavItems.map((item) => (
                <BottomNavigationAction
                  key={item.label}
                  label={item.label}
                  icon={item.icon}
                  sx={{
                    '& .MuiBottomNavigationAction-label': {
                      fontSize: '11px',
                      fontWeight: 500,
                      transition: 'all 0.2s ease',
                    },
                    '&.Mui-selected .MuiBottomNavigationAction-label': {
                      fontSize: '12px',
                      fontWeight: 600,
                    },
                  }}
                />
              ))}
            </BottomNavigation>
          </Paper>
        </Slide>
      )}

      {/* iOS-style Backdrop for Mobile Drawer */}
      {mobileOpen && isMobile && (
        <Box
          onClick={handleDrawerToggle}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            zIndex: 1199,
            animation: 'fadeIn 0.3s ease-out',
            '@keyframes fadeIn': {
              from: { opacity: 0 },
              to: { opacity: 1 },
            },
          }}
        />
      )}
    </Box>
  );
};

export default MainLayout;