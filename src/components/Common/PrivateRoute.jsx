import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  CircularProgress, 
  Box, 
  Typography,
  Fade,
  Zoom 
} from '@mui/material';
import { iOSStyles } from '../../utils/iosAnimations';

const PrivateRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Fade in={true} timeout={300}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: iOSStyles.colors.systemGray6,
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
        >
          {/* iOS-style loading spinner */}
          <Zoom in={true} style={{ transitionDelay: '100ms' }}>
            <Box
              sx={{
                position: 'relative',
                width: 80,
                height: 80,
                mb: 3,
              }}
            >
              {/* Outer ring */}
              <CircularProgress
                size={80}
                thickness={2}
                sx={{
                  color: iOSStyles.colors.systemGray4,
                  position: 'absolute',
                }}
              />
              
              {/* Inner spinning ring */}
              <CircularProgress
                size={80}
                thickness={2}
                variant="indeterminate"
                sx={{
                  color: iOSStyles.colors.systemBlue,
                  position: 'absolute',
                  animation: 'spin 1s linear infinite',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                }}
              />
              
              {/* Center logo */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 40,
                  height: 40,
                  borderRadius: iOSStyles.borderRadius.large,
                  backgroundColor: iOSStyles.colors.systemBlue,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 4px 12px ${iOSStyles.colors.systemBlue}40`,
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                    fill="white"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Box>
            </Box>
          </Zoom>

          {/* Loading text with typing animation */}
          <Fade in={true} timeout={500}>
            <Box sx={{ textAlign: 'center', maxWidth: 280 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: iOSStyles.colors.label,
                  mb: 1,
                  fontSize: '20px',
                }}
              >
                SalesSynapse
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: iOSStyles.colors.secondaryLabel,
                  mb: 3,
                  fontSize: '15px',
                }}
              >
                AI-Powered Sales Intelligence
              </Typography>
              
              {/* Animated dots */}
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
                {[0, 1, 2].map((dot) => (
                  <Box
                    key={dot}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: iOSStyles.colors.systemBlue,
                      animation: `pulse 1.4s ease-in-out ${dot * 0.16}s infinite both`,
                      '@keyframes pulse': {
                        '0%, 100%': { opacity: 0.3, transform: 'scale(0.8)' },
                        '50%': { opacity: 1, transform: 'scale(1)' },
                      },
                    }}
                  />
                ))}
              </Box>
              
              <Typography
                variant="caption"
                sx={{
                  color: iOSStyles.colors.tertiaryLabel,
                  display: 'block',
                  mt: 2,
                  fontSize: '13px',
                }}
              >
                Loading your dashboard...
              </Typography>
            </Box>
          </Fade>

          {/* iOS-style safe area indicator */}
          <Box
            sx={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              height: 'env(safe-area-inset-bottom)',
              backgroundColor: iOSStyles.colors.systemGray6,
            }}
          />
        </Box>
      </Fade>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;