import { createTheme } from '@mui/material/styles';

// iOS Color System
export const iosColors = {
  // Primary iOS Blues
  systemBlue: '#007AFF',
  systemBlueLight: '#5AC8FA',
  systemBlueDark: '#0051D5',
  
  // iOS Grays
  systemGray: '#8E8E93',
  systemGray2: '#AEAEB2',
  systemGray3: '#C7C7CC',
  systemGray4: '#D1D1D6',
  systemGray5: '#E5E5EA',
  systemGray6: '#F2F2F7',
  
  // Semantic Colors
  systemGreen: '#34C759',
  systemRed: '#FF3B30',
  systemOrange: '#FF9500',
  systemYellow: '#FFCC00',
  systemPurple: '#AF52DE',
  systemPink: '#FF2D55',
  
  // Backgrounds
  background: '#F2F2F7',
  backgroundSecondary: '#FFFFFF',
  backgroundTertiary: '#F2F2F7',
  
  // Text
  label: '#000000',
  labelSecondary: 'rgba(60, 60, 67, 0.6)',
  labelTertiary: 'rgba(60, 60, 67, 0.3)',
  
  // Separators
  separator: 'rgba(60, 60, 67, 0.29)',
  separatorOpaque: '#C6C6C8',
};

// iOS Typography (SF Pro)
export const iosTypography = {
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    'SF Pro Display',
    'SF Pro Text',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ].join(','),
  
  // iOS Text Styles
  largeTitle: {
    fontSize: '34px',
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
  },
  title1: {
    fontSize: '28px',
    fontWeight: 700,
    lineHeight: 1.3,
    letterSpacing: '-0.015em',
  },
  title2: {
    fontSize: '22px',
    fontWeight: 700,
    lineHeight: 1.4,
    letterSpacing: '-0.01em',
  },
  title3: {
    fontSize: '20px',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  headline: {
    fontSize: '17px',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  body: {
    fontSize: '17px',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  callout: {
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  subheadline: {
    fontSize: '15px',
    fontWeight: 400,
    lineHeight: 1.4,
  },
  footnote: {
    fontSize: '13px',
    fontWeight: 400,
    lineHeight: 1.4,
  },
  caption1: {
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: 1.3,
  },
  caption2: {
    fontSize: '11px',
    fontWeight: 400,
    lineHeight: 1.3,
  },
};

// iOS Shadows
export const iosShadows = {
  small: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)',
  medium: '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)',
  large: '0 8px 24px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1)',
  card: '0 2px 8px rgba(0, 0, 0, 0.08)',
};

// iOS Border Radius
export const iosBorderRadius = {
  small: 8,
  medium: 12,
  large: 16,
  xlarge: 20,
  button: 10,
  card: 16,
};

// Create iOS Theme
export const iosTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: iosColors.systemBlue,
      light: iosColors.systemBlueLight,
      dark: iosColors.systemBlueDark,
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: iosColors.systemGreen,
      light: '#6EE787',
      dark: '#2DA44E',
      contrastText: '#FFFFFF',
    },
    error: {
      main: iosColors.systemRed,
    },
    warning: {
      main: iosColors.systemOrange,
    },
    info: {
      main: iosColors.systemBlue,
    },
    success: {
      main: iosColors.systemGreen,
    },
    background: {
      default: iosColors.background,
      paper: iosColors.backgroundSecondary,
    },
    text: {
      primary: iosColors.label,
      secondary: iosColors.labelSecondary,
      disabled: iosColors.labelTertiary,
    },
    divider: iosColors.separator,
  },
  
  typography: {
    fontFamily: iosTypography.fontFamily,
    h1: iosTypography.largeTitle,
    h2: iosTypography.title1,
    h3: iosTypography.title2,
    h4: iosTypography.title3,
    h5: iosTypography.headline,
    h6: iosTypography.headline,
    subtitle1: iosTypography.callout,
    subtitle2: iosTypography.subheadline,
    body1: iosTypography.body,
    body2: iosTypography.callout,
    button: {
      ...iosTypography.headline,
      textTransform: 'none',
    },
    caption: iosTypography.caption1,
    overline: iosTypography.caption2,
  },
  
  shape: {
    borderRadius: iosBorderRadius.medium,
  },
  
  shadows: [
    'none',
    iosShadows.small,
    iosShadows.small,
    iosShadows.card,
    iosShadows.medium,
    iosShadows.medium,
    iosShadows.medium,
    iosShadows.medium,
    iosShadows.large,
    iosShadows.large,
    iosShadows.large,
    iosShadows.large,
    iosShadows.large,
    iosShadows.large,
    iosShadows.large,
    iosShadows.large,
    iosShadows.large,
    iosShadows.large,
    iosShadows.large,
    iosShadows.large,
    iosShadows.large,
    iosShadows.large,
    iosShadows.large,
    iosShadows.large,
    iosShadows.large,
  ],
  
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: iosTypography.fontFamily,
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          backgroundColor: iosColors.background,
          overscrollBehavior: 'none', // iOS-style scroll
        },
        '*': {
          scrollbarWidth: 'thin',
          scrollbarColor: `${iosColors.systemGray3} transparent`,
        },
        '*::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '*::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: iosColors.systemGray3,
          borderRadius: '20px',
          border: '2px solid transparent',
          backgroundClip: 'content-box',
        },
        '*::-webkit-scrollbar-thumb:hover': {
          backgroundColor: iosColors.systemGray2,
        },
      },
    },
    
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: iosBorderRadius.button,
          padding: '10px 20px',
          fontSize: '17px',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:active': {
            transform: 'scale(0.96)',
          },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: iosShadows.small,
          },
          '&:active': {
            boxShadow: 'none',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
            backgroundColor: 'rgba(0, 122, 255, 0.05)',
          },
        },
        text: {
          '&:hover': {
            backgroundColor: 'rgba(0, 122, 255, 0.05)',
          },
        },
      },
    },
    
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: iosBorderRadius.card,
          boxShadow: iosShadows.card,
          border: 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: iosShadows.medium,
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: iosBorderRadius.medium,
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: iosShadows.small,
        },
        elevation2: {
          boxShadow: iosShadows.card,
        },
        elevation3: {
          boxShadow: iosShadows.medium,
        },
      },
    },
    
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: iosBorderRadius.button,
            backgroundColor: iosColors.backgroundSecondary,
            transition: 'all 0.2s ease',
            '& fieldset': {
              borderColor: iosColors.systemGray4,
              borderWidth: '1px',
            },
            '&:hover fieldset': {
              borderColor: iosColors.systemGray3,
            },
            '&.Mui-focused fieldset': {
              borderColor: iosColors.systemBlue,
              borderWidth: '2px',
            },
          },
          '& .MuiInputLabel-root': {
            fontSize: '17px',
          },
        },
      },
    },
    
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: `1px solid ${iosColors.separator}`,
          backdropFilter: 'blur(20px) saturate(180%)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
        },
      },
    },
    
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: `1px solid ${iosColors.separator}`,
          backgroundColor: iosColors.backgroundSecondary,
        },
      },
    },
    
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: iosBorderRadius.small,
          transition: 'all 0.2s ease',
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
      },
    },
    
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: iosBorderRadius.button,
          fontWeight: 500,
        },
      },
    },
    
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: iosBorderRadius.medium,
          fontSize: '15px',
        },
      },
    },
  },
});

export default iosTheme;