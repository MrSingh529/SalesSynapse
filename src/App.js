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

// iOS Color Palette
const iOSColors = {
  // System Colors
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
  tertiarySystemBackground: '#FFFFFF',
  
  // Label Colors
  label: '#000000',
  secondaryLabel: '#3C3C4399',
  tertiaryLabel: '#3C3C434D',
  quaternaryLabel: '#3C3C432E',
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: iOSColors.systemBlue,
      light: '#5AC8FA',
      dark: '#0040DD',
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
      light: '#FFB4AB',
      dark: '#BA1A1A',
    },
    warning: {
      main: iOSColors.systemOrange,
      light: '#FFD580',
      dark: '#C75200',
    },
    info: {
      main: iOSColors.systemTeal,
      light: '#80DDFF',
      dark: '#0096C7',
    },
    success: {
      main: iOSColors.systemGreen,
      light: '#80E27E',
      dark: '#087F23',
    },
    background: {
      default: iOSColors.systemGray6,
      paper: iOSColors.systemBackground,
    },
    text: {
      primary: iOSColors.label,
      secondary: iOSColors.secondaryLabel,
      disabled: iOSColors.quaternaryLabel,
    },
    divider: iOSColors.systemGray5,
    action: {
      active: iOSColors.systemBlue,
      hover: iOSColors.systemBlue + '14', // 8% opacity
      selected: iOSColors.systemBlue + '29', // 16% opacity
      disabled: iOSColors.systemGray4,
      disabledBackground: iOSColors.systemGray5,
    },
  },
  shape: {
    borderRadius: 14, // iOS standard rounded corners
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
      fontSize: '34px',
      lineHeight: '41px',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '28px',
      lineHeight: '34px',
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '22px',
      lineHeight: '28px',
    },
    h4: {
      fontWeight: 600,
      fontSize: '20px',
      lineHeight: '25px',
    },
    h5: {
      fontWeight: 600,
      fontSize: '17px',
      lineHeight: '22px',
    },
    h6: {
      fontWeight: 600,
      fontSize: '15px',
      lineHeight: '20px',
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '15px',
      lineHeight: '20px',
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '13px',
      lineHeight: '18px',
    },
    body1: {
      fontWeight: 400,
      fontSize: '17px',
      lineHeight: '22px',
    },
    body2: {
      fontWeight: 400,
      fontSize: '15px',
      lineHeight: '20px',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      fontSize: '17px',
      lineHeight: '22px',
      letterSpacing: '-0.01em',
    },
    caption: {
      fontWeight: 400,
      fontSize: '12px',
      lineHeight: '16px',
    },
    overline: {
      fontWeight: 500,
      fontSize: '11px',
      lineHeight: '13px',
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          WebkitTapHighlightColor: 'transparent',
        },
        '&::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: iOSColors.systemGray6,
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: iOSColors.systemGray4,
          borderRadius: '4px',
          '&:hover': {
            background: iOSColors.systemGray3,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '14px',
          padding: '12px 24px',
          fontSize: '17px',
          lineHeight: '22px',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 122, 255, 0.3)',
          },
          '&:active': {
            boxShadow: '0 2px 4px rgba(0, 122, 255, 0.2)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
          },
        },
        sizeSmall: {
          padding: '8px 16px',
          fontSize: '15px',
          borderRadius: '12px',
        },
        sizeLarge: {
          padding: '16px 32px',
          fontSize: '17px',
          borderRadius: '16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          border: '1px solid transparent',
          background: 'linear-gradient(white, white) padding-box, linear-gradient(145deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.04) 100%) border-box',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        },
        elevation2: {
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
        },
        elevation3: {
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: iOSColors.systemGray6,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: iOSColors.systemGray5,
            },
            '&.Mui-focused': {
              backgroundColor: iOSColors.systemBackground,
              boxShadow: `0 0 0 4px ${iOSColors.systemBlue}20`,
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: iOSColors.systemGray4,
              borderWidth: '1px',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: iOSColors.systemGray3,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: iOSColors.systemBlue,
              borderWidth: '2px',
            },
          },
          '& .MuiInputLabel-root': {
            fontSize: '15px',
            '&.Mui-focused': {
              color: iOSColors.systemBlue,
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 0 0 rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderBottom: `1px solid ${iOSColors.systemGray5}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: `1px solid ${iOSColors.systemGray5}`,
          backdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          width: '280px',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: iOSColors.systemGray4,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: iOSColors.systemGray3,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: iOSColors.systemBlue,
            borderWidth: '2px',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          fontWeight: 500,
          fontSize: '13px',
          height: '28px',
        },
        filled: {
          boxShadow: 'none',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '14px',
          padding: '16px',
        },
        standardSuccess: {
          backgroundColor: iOSColors.systemGreen + '20',
          color: iOSColors.systemGreen,
        },
        standardError: {
          backgroundColor: iOSColors.systemRed + '20',
          color: iOSColors.systemRed,
        },
        standardWarning: {
          backgroundColor: iOSColors.systemOrange + '20',
          color: iOSColors.systemOrange,
        },
        standardInfo: {
          backgroundColor: iOSColors.systemBlue + '20',
          color: iOSColors.systemBlue,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '20px',
          margin: '16px',
          maxWidth: 'calc(100% - 32px)',
          maxHeight: 'calc(100% - 32px)',
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            borderBottomColor: iOSColors.systemGray5,
            padding: '12px 16px',
          },
          '& .MuiTableHead-root .MuiTableCell-root': {
            fontWeight: 600,
            fontSize: '13px',
            color: iOSColors.secondaryLabel,
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          margin: '4px 8px',
          padding: '8px 12px',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: iOSColors.systemGray5,
          },
          '&.Mui-selected': {
            backgroundColor: iOSColors.systemBlue + '14',
          },
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