import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/Common/PrivateRoute';
import MainLayout from './components/Layout/MainLayout';
import PWAInstallPrompt from './components/Common/PWAInstallPrompt';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NewVisit from './pages/NewVisit';
import VisitReports from './pages/VisitReports';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

// iOS Color Palette (subdued)
const iOSColors = {
  systemBlue: '#007AFF',
  systemGreen: '#34C759',
  systemIndigo: '#5856D6',
  systemOrange: '#FF9500',
  systemPink: '#FF2D55',
  systemPurple: '#AF52DE',
  systemRed: '#FF3B30',
  systemTeal: '#5AC8FA',
  systemYellow: '#FFCC00',
  
  // Gray Scale
  systemGray: '#8E8E93',
  systemGray2: '#AEAEB2',
  systemGray3: '#C7C7CC',
  systemGray4: '#D1D1D6',
  systemGray5: '#E5E5EA',
  systemGray6: '#F2F2F7',
  
  // Background Colors
  systemBackground: '#FFFFFF',
  secondarySystemBackground: '#F2F2F7',
  
  // Label Colors
  label: '#000000',
  secondaryLabel: '#3C3C4399',
  tertiaryLabel: '#3C3C434D',
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: iOSColors.systemBlue,
      light: '#5AC8FA',
      dark: '#0056CC',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: iOSColors.systemPurple,
      light: '#D0BCFF',
      dark: '#7F39FB',
      contrastText: '#FFFFFF',
    },
    error: {
      main: iOSColors.systemRed,
    },
    warning: {
      main: iOSColors.systemOrange,
    },
    info: {
      main: iOSColors.systemTeal,
    },
    success: {
      main: iOSStyles.colors.systemGreen,
    },
    background: {
      default: iOSColors.systemGray6,
      paper: iOSColors.systemBackground,
    },
    text: {
      primary: iOSColors.label,
      secondary: iOSColors.secondaryLabel,
      disabled: iOSColors.tertiaryLabel,
    },
    divider: iOSColors.systemGray5,
    action: {
      active: iOSColors.systemBlue,
      hover: iOSColors.systemBlue + '14',
      selected: iOSColors.systemBlue + '29',
    },
  },
  shape: {
    borderRadius: 12, // Reduced from 14
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: '1.75rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.125rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      fontSize: '0.875rem',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8, // Reduced from 14
          padding: '8px 16px',
          fontSize: '0.875rem',
          transition: 'all 0.2s ease',
        },
        contained: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          },
        },
        sizeSmall: {
          borderRadius: 6,
          padding: '6px 12px',
        },
        sizeLarge: {
          borderRadius: 10,
          padding: '12px 24px',
          fontSize: '1rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Reduced from 16
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          border: '1px solid #e2e8f0',
          transition: 'box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8, // Reduced from 12
            backgroundColor: '#ffffff',
            '&:hover': {
              backgroundColor: '#f8fafc',
            },
            '&.Mui-focused': {
              backgroundColor: '#ffffff',
              boxShadow: `0 0 0 3px ${iOSColors.systemBlue}20`,
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 0 0 rgba(0, 0, 0, 0.1)',
          backgroundColor: '#ffffff',
          borderBottom: `1px solid ${iOSColors.systemGray5}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: `1px solid ${iOSColors.systemGray5}`,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6, // Reduced from 8
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Reduced from 14
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16, // Reduced from 20
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Reduced from 12
        },
      },
    },
  },
});

// Animation wrapper component
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <Routes location={location}>
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
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          {/* PWA Install Prompt */}
          <PWAInstallPrompt />
          <AnimatedRoutes />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;