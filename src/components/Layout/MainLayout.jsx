import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
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
  useTheme,
  useMediaQuery,
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
  ChevronRight,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { logout } from '../../services/authService';
import { APP_NAME, FOOTER_TEXT, SUPPORT_EMAIL } from '../../utils/constants';

const drawerWidth = 260;

const MainLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const isManager = user?.email?.includes('manager') || false;

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
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'New Visit', icon: <AddCircle />, path: '/new-visit' },
    { text: 'Visit Reports', icon: <ListAlt />, path: '/visits' },
    ...(isManager ? [{ text: 'Manager View', icon: <AdminPanelSettings />, path: '/admin' }] : [])
  ];

  const drawer = (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
    }}>
      <Toolbar sx={{ 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
        color: 'white',
        flexDirection: 'column',
        py: 3,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          opacity: 0.3,
        }} />
        <Business sx={{ 
          fontSize: 48, 
          mb: 2,
          filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))',
        }} />
        <Typography variant="h5" sx={{ 
          fontWeight: 'bold', 
          textAlign: 'center',
          letterSpacing: '-0.02em',
        }}>
          {APP_NAME}
        </Typography>
        <Typography variant="caption" sx={{ 
          opacity: 0.9, 
          mt: 1,
          background: 'rgba(255,255,255,0.2)',
          px: 1.5,
          py: 0.5,
          borderRadius: 6,
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.05em',
        }}>
          AI-Powered Sales Intelligence
        </Typography>
      </Toolbar>
      
      <Divider sx={{ borderColor: 'rgba(0, 0, 0, 0.05)' }} />
      
      <List sx={{ 
        pt: 2, 
        px: 2,
        flex: 1,
        '& .MuiListItemButton-root': {
          borderRadius: 10,
          mb: 1,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: 'rgba(0, 122, 255, 0.08)',
            transform: 'translateX(4px)',
            '& .MuiListItemIcon-root': {
              color: '#007AFF',
              transform: 'scale(1.1)',
            },
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(0, 122, 255, 0.12)',
            '&:hover': {
              backgroundColor: 'rgba(0, 122, 255, 0.16)',
            },
          },
        },
      }}>
        {menuItems.map((item) => {
          const isSelected = window.location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton 
                selected={isSelected}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  px: 2,
                  py: 1.5,
                }}
              >
                <ListItemIcon sx={{ 
                  color: isSelected ? '#007AFF' : 'rgba(0, 0, 0, 0.6)',
                  minWidth: 40,
                  transition: 'all 0.2s ease',
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontWeight: isSelected ? 600 : 500,
                    fontSize: '15px',
                    color: isSelected ? '#007AFF' : 'rgba(0, 0, 0, 0.8)',
                  }}
                />
                {isSelected && (
                  <ChevronRight sx={{ 
                    color: '#007AFF', 
                    fontSize: 20,
                    opacity: 0.8,
                  }} />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      
      {/* Sidebar Footer */}
      <Box sx={{ 
        mt: 'auto', 
        p: 2.5, 
        background: 'linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.04) 100%)',
        borderTop: '1px solid rgba(0, 0, 0, 0.05)',
        borderRadius: '14px 14px 0 0',
      }}>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
          {FOOTER_TEXT}
        </Typography>
        <Link 
          href={`mailto:${SUPPORT_EMAIL}`} 
          variant="caption" 
          sx={{ 
            color: '#007AFF',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            fontWeight: 500,
            '&:hover': { 
              textDecoration: 'underline',
              color: '#0056CC',
            },
          }}
        >
          ✉️ For Support: {SUPPORT_EMAIL}
        </Link>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      background: '#F2F2F7',
    }}>
      <CssBaseline />
      
      {/* iOS Style App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          color: '#1C1C1E',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ minHeight: '64px', px: { xs: 2, sm: 3 } }}>
          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { sm: 'none' },
              color: '#007AFF',
              '&:active': {
                transform: 'scale(0.95)',
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          
          {/* Title Area */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            flexGrow: 1,
            gap: 1.5,
          }}>
            <Box sx={{
              width: 32,
              height: 32,
              background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0, 122, 255, 0.3)',
            }}>
              <TrendingUp sx={{ 
                color: 'white', 
                fontSize: 20,
              }} />
            </Box>
            <Typography variant="h6" noWrap sx={{ 
              fontWeight: 700,
              fontSize: '18px',
              letterSpacing: '-0.01em',
              background: 'linear-gradient(45deg, #007AFF 30%, #5856D6 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              {window.location.pathname === '/dashboard' ? 'Dashboard' : 
               window.location.pathname === '/new-visit' ? 'New Visit' :
               window.location.pathname === '/visits' ? 'Visit Reports' :
               window.location.pathname === '/admin' ? 'Manager Dashboard' : APP_NAME}
            </Typography>
          </Box>

          {/* User Menu */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
          }}>
            <Typography variant="body2" color="text.secondary" sx={{ 
              display: { xs: 'none', sm: 'block' },
              fontSize: '14px',
            }}>
              {user?.email}
            </Typography>
            <IconButton 
              onClick={handleMenuOpen}
              sx={{ 
                p: 0,
                '&:active': {
                  transform: 'scale(0.95)',
                },
              }}
            >
              <Avatar sx={{ 
                width: 40,
                height: 40,
                background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
                boxShadow: '0 2px 8px rgba(0, 122, 255, 0.3)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 4px 12px rgba(0, 122, 255, 0.4)',
                },
              }}>
                <Person sx={{ fontSize: 22 }} />
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  borderRadius: 14,
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1), 0 3px 10px rgba(0, 0, 0, 0.05)',
                  minWidth: 200,
                  '& .MuiMenuItem-root': {
                    py: 1.5,
                    px: 2,
                    fontSize: '15px',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                    '& .MuiListItemIcon-root': {
                      minWidth: 36,
                      color: '#007AFF',
                    },
                  },
                },
              }}
            >
              <MenuItem disabled sx={{ opacity: 1, cursor: 'default' }}>
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold" color="#1C1C1E">
                    {user?.email?.split('@')[0]}
                  </Typography>
                  <Typography variant="caption" color="#8E8E93">
                    {isManager ? 'Manager' : 'Sales Representative'}
                  </Typography>
                </Box>
              </MenuItem>
              <Divider sx={{ my: 1, borderColor: 'rgba(0, 0, 0, 0.05)' }} />
              <MenuItem onClick={handleLogout} sx={{ color: '#FF3B30' }}>
                <ListItemIcon>
                  <Logout fontSize="small" sx={{ color: '#FF3B30' }} />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* iOS Style Navigation */}
      <Box sx={{ 
        display: 'flex', 
        flexGrow: 1,
        position: 'relative',
      }}>
        {/* Mobile Drawer */}
        <Box component="nav">
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: drawerWidth,
                borderRight: '1px solid rgba(0, 0, 0, 0.05)',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              },
            }}
          >
            {drawer}
          </Drawer>
          
          {/* Desktop Drawer */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: drawerWidth,
                borderRight: '1px solid rgba(0, 0, 0, 0.05)',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                display: 'flex',
                flexDirection: 'column',
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        {/* Main Content Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3 },
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            mt: '64px',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 'calc(100vh - 64px)',
            background: '#F2F2F7',
          }}
        >
          <Box sx={{ 
            flexGrow: 1,
            animation: 'iosFadeIn 0.4s ease-out',
          }}>
            <Outlet />
          </Box>
          
          {/* iOS Style Footer */}
          <Container maxWidth={false} sx={{ 
            mt: 4, 
            py: 2.5, 
            borderTop: '1px solid rgba(0, 0, 0, 0.05)',
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderRadius: 14,
            mx: { xs: 0, sm: 'auto' },
            maxWidth: { sm: '100%', md: 'calc(100% - 260px)' },
          }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {FOOTER_TEXT}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ 
              display: 'block', 
              mt: 1,
              opacity: 0.7,
            }}>
              © {new Date().getFullYear()} RV Solutions. All rights reserved.
            </Typography>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;