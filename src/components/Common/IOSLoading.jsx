import React from 'react';
import { Box, Typography, CircularProgress, Fade, Zoom } from '@mui/material';
import { iOSStyles } from '../../utils/iosAnimations';

const IOSLoading = ({ 
  message = 'Loading...', 
  subMessage = 'Please wait a moment',
  showLogo = true,
  size = 'medium',
  fullScreen = true 
}) => {
  const sizes = {
    small: { spinner: 24, logo: 32 },
    medium: { spinner: 40, logo: 48 },
    large: { spinner: 60, logo: 64 },
  };

  const currentSize = sizes[size];

  const LoadingContent = () => (
    <Fade in={true} timeout={300}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        {/* Animated Logo */}
        {showLogo && (
          <Zoom in={true} style={{ transitionDelay: '100ms' }}>
            <Box
              sx={{
                position: 'relative',
                width: currentSize.logo + 24,
                height: currentSize.logo + 24,
                mb: 3,
              }}
            >
              {/* Outer glow */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${iOSStyles.colors.systemBlue}40 0%, transparent 70%)`,
                  animation: 'pulse 2s ease-in-out infinite',
                }}
              />
              
              {/* Logo container */}
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  borderRadius: iOSStyles.borderRadius.large,
                  background: `linear-gradient(135deg, ${iOSStyles.colors.systemBlue} 0%, ${iOSStyles.colors.systemPurple} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 8px 32px ${iOSStyles.colors.systemBlue}40`,
                  zIndex: 1,
                }}
              >
                <svg
                  width={currentSize.logo * 0.6}
                  height={currentSize.logo * 0.6}
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
        )}

        {/* Spinner */}
        <Box
          sx={{
            position: 'relative',
            width: currentSize.spinner + 20,
            height: currentSize.spinner + 20,
            mb: 3,
          }}
        >
          {/* Background ring */}
          <CircularProgress
            variant="determinate"
            value={100}
            size={currentSize.spinner + 20}
            thickness={2}
            sx={{
              color: iOSStyles.colors.systemGray4,
              position: 'absolute',
            }}
          />
          
          {/* Animated ring */}
          <CircularProgress
            variant="indeterminate"
            size={currentSize.spinner + 20}
            thickness={2}
            sx={{
              color: iOSStyles.colors.systemBlue,
              position: 'absolute',
              animation: 'spin 1s linear infinite',
            }}
          />
          
          {/* Inner dot */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: currentSize.spinner * 0.3,
              height: currentSize.spinner * 0.3,
              borderRadius: '50%',
              backgroundColor: iOSStyles.colors.systemBlue,
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
        </Box>

        {/* Messages */}
        <Typography
          variant={size === 'small' ? 'body1' : 'h6'}
          sx={{
            fontWeight: 600,
            color: iOSStyles.colors.label,
            mb: 1,
            fontSize: size === 'small' ? '15px' : '17px',
          }}
        >
          {message}
        </Typography>
        
        {subMessage && (
          <Typography
            variant="body2"
            sx={{
              color: iOSStyles.colors.secondaryLabel,
              fontSize: size === 'small' ? '13px' : '15px',
            }}
          >
            {subMessage}
          </Typography>
        )}

        {/* Animated dots */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 3 }}>
          {[0, 1, 2].map((dot) => (
            <Box
              key={dot}
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: iOSStyles.colors.systemBlue,
                animation: `bounce 1.4s ease-in-out ${dot * 0.16}s infinite both`,
              }}
            />
          ))}
        </Box>

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          
          @keyframes bounce {
            0%, 100% { transform: translateY(0); opacity: 0.3; }
            50% { transform: translateY(-6px); opacity: 1; }
          }
        `}</style>
      </Box>
    </Fade>
  );

  if (fullScreen) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          animation: 'fadeIn 0.3s ease-out',
          '@keyframes fadeIn': {
            from: { opacity: 0 },
            to: { opacity: 1 },
          },
        }}
      >
        <LoadingContent />
      </Box>
    );
  }

  return <LoadingContent />;
};

export default IOSLoading;