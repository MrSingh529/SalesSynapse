import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/Common/PrivateRoute';
import MainLayout from './components/Layout/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NewVisit from './pages/NewVisit';
import VisitReports from './pages/VisitReports';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

// iOS Design System Theme
const iOSTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#007AFF', // iOS Blue
      light: '#5AC8FA', // iOS Light Blue
      dark: '#0056CC', // iOS Dark Blue
    },
    secondary: {
      main: '#5856D6', // iOS Purple
      light: '#AF52DE', // iOS Pink
      dark: '#3634A3', // iOS Dark Purple
    },
    error: {
      main: '#FF3B30', // iOS Red
    },
    warning: {
      main: '#FF9500', // iOS Orange
    },
    info: {
      main: '#5AC8FA', // iOS Light Blue
    },
    success: {
      main: '#34C759', // iOS Green
    },
    background: {
      default: '#F2F2F7', // iOS System Gray 6
      paper: '#FFFFFF', // iOS System Background
    },
    text: {
      primary: '#1C1C1E', // iOS Label
      secondary: '#8E8E93', // iOS Secondary Label
      disabled: '#C7C7CC', // iOS Tertiary Label
    },
    divider: 'rgba(0, 0, 0, 0.05)',
    action: {
      active: '#007AFF',
      hover: 'rgba(0, 122, 255, 0.04)',
      selected: 'rgba(0, 122, 255, 0.08)',
      disabled: '#C7C7CC',
      disabledBackground: 'rgba(0, 0, 0, 0.02)',
    },
  },
  shape: {
    borderRadius: 14, // iOS Standard Border Radius
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif',
    h1: {
      fontSize: '34px',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '28px',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '22px',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h4: {
      fontSize: '20px',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h5: {
      fontSize: '18px',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h6: {
      fontSize: '17px',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    subtitle1: {
      fontSize: '17px',
      fontWeight: 400,
      lineHeight: 1.4,
    },
    subtitle2: {
      fontSize: '15px',
      fontWeight: 400,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '17px',
      fontWeight: 400,
      lineHeight: 1.4,
    },
    body2: {
      fontSize: '15px',
      fontWeight: 400,
      lineHeight: 1.4,
    },
    button: {
      fontSize: '17px',
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '-0.01em',
    },
    caption: {
      fontSize: '13px',
      fontWeight: 400,
      lineHeight: 1.4,
    },
    overline: {
      fontSize: '11px',
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
    },
  },
  shadows: [
    'none',
    '0px 2px 10px rgba(0, 0, 0, 0.03), 0px 1px 2px rgba(0, 0, 0, 0.03)', // iOS Card Shadow
    '0px 4px 15px rgba(0, 0, 0, 0.05), 0px 2px 4px rgba(0, 0, 0, 0.03)',
    '0px 8px 25px rgba(0, 0, 0, 0.08), 0px 3px 10px rgba(0, 0, 0, 0.03)',
    '0px 12px 35px rgba(0, 0, 0, 0.1), 0px 4px 15px rgba(0, 0, 0, 0.05)',
    ...Array(20).fill('none'),
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          backgroundColor: '#F2F2F7',
          color: '#1C1C1E',
          overscrollBehaviorY: 'none',
        },
        '*': {
          WebkitOverflowScrolling: 'touch',
        },
        '::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '::-webkit-scrollbar-thumb': {
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '4px',
          backgroundClip: 'padding-box',
        },
        '::-webkit-scrollbar-thumb:hover': {
          background: 'rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 10,
          padding: '12px 20px',
          fontSize: '17px',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.3) 1%, transparent 1%)',
            transform: 'translate(-50%, -50%) scale(0)',
            transition: 'transform 0.3s ease-out',
          },
          '&:active::after': {
            transform: 'translate(-50%, -50%) scale(10)',
          },
        },
        contained: {
          background: 'linear-gradient(180deg, #007AFF 0%, #0056CC 100%)',
          boxShadow: '0 4px 8px rgba(0, 122, 255, 0.2), 0 1px 3px rgba(0, 122, 255, 0.15)',
          '&:hover': {
            boxShadow: '0 6px 12px rgba(0, 122, 255, 0.25), 0 2px 4px rgba(0, 122, 255, 0.2)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'scale(0.97)',
            boxShadow: '0 2px 4px rgba(0, 122, 255, 0.2), 0 1px 2px rgba(0, 122, 255, 0.15)',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
            backgroundColor: 'rgba(0, 122, 255, 0.04)',
          },
        },
        text: {
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          border: '1px solid rgba(0, 0, 0, 0.05)',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.03)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08), 0 3px 10px rgba(0, 0, 0, 0.03)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          backgroundImage: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
            '&.Mui-focused': {
              backgroundColor: '#FFFFFF',
              boxShadow: '0 0 0 4px rgba(0, 122, 255, 0.1)',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid rgba(0, 0, 0, 0.05)',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          border: '1px solid currentColor',
          borderColor: 'inherit',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(0, 122, 255, 0.08)',
            '&:hover': {
              backgroundColor: 'rgba(0, 122, 255, 0.12)',
            },
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 3,
          height: 6,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={iOSTheme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route element={<PrivateRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/new-visit" element={<NewVisit />} />
                <Route path="/visits" element={<VisitReports />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;