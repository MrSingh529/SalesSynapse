import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Slide,
  Fade,
  Zoom,
  Paper,
  Collapse
} from '@mui/material';
import {
  Close,
  CheckCircle,
  Error as ErrorIcon,
  Info,
  Warning,
  Notifications,
  ArrowForwardIos
} from '@mui/icons-material';
import { iOSStyles, iOSUtils } from '../../utils/iosAnimations';

const IOSNotification = ({
  type = 'info',
  title,
  message,
  duration = 5000,
  onClose,
  showClose = true,
  showIcon = true,
  action,
  position = 'top-right',
  show = true
}) => {
  const [isVisible, setIsVisible] = useState(show);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsVisible(show);
  }, [show]);

  useEffect(() => {
    if (duration && isVisible && !isHovered) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, isHovered]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };

  const handleClick = () => {
    if (action && action.onClick) {
      action.onClick();
      handleClose();
    }
  };

  const getTypeStyles = () => {
    const styles = {
      success: {
        backgroundColor: `${iOSStyles.colors.systemGreen}15`,
        borderColor: `${iOSStyles.colors.systemGreen}40`,
        icon: <CheckCircle sx={{ color: iOSStyles.colors.systemGreen }} />,
        iconColor: iOSStyles.colors.systemGreen,
      },
      error: {
        backgroundColor: `${iOSStyles.colors.systemRed}15`,
        borderColor: `${iOSStyles.colors.systemRed}40`,
        icon: <ErrorIcon sx={{ color: iOSStyles.colors.systemRed }} />,
        iconColor: iOSStyles.colors.systemRed,
      },
      warning: {
        backgroundColor: `${iOSStyles.colors.systemOrange}15`,
        borderColor: `${iOSStyles.colors.systemOrange}40`,
        icon: <Warning sx={{ color: iOSStyles.colors.systemOrange }} />,
        iconColor: iOSStyles.colors.systemOrange,
      },
      info: {
        backgroundColor: `${iOSStyles.colors.systemBlue}15`,
        borderColor: `${iOSStyles.colors.systemBlue}40`,
        icon: <Info sx={{ color: iOSStyles.colors.systemBlue }} />,
        iconColor: iOSStyles.colors.systemBlue,
      },
    };
    return styles[type] || styles.info;
  };

  const getPositionStyles = () => {
    const positions = {
      'top-right': { top: 20, right: 20, left: 'auto' },
      'top-left': { top: 20, left: 20, right: 'auto' },
      'top-center': { top: 20, left: '50%', transform: 'translateX(-50%)' },
      'bottom-right': { bottom: 20, right: 20, left: 'auto' },
      'bottom-left': { bottom: 20, left: 20, right: 'auto' },
      'bottom-center': { bottom: 20, left: '50%', transform: 'translateX(-50%)' },
    };
    return positions[position] || positions['top-right'];
  };

  const typeStyles = getTypeStyles();
  const positionStyles = getPositionStyles();

  if (!isVisible) return null;

  return (
    <Slide
      direction="down"
      in={isVisible}
      mountOnEnter
      unmountOnExit
    >
      <Paper
        elevation={0}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        sx={{
          position: 'fixed',
          zIndex: 9999,
          maxWidth: 380,
          minWidth: 280,
          borderRadius: iOSStyles.borderRadius.large,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${iOSStyles.colors.systemGray5}`,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
          overflow: 'hidden',
          cursor: action ? 'pointer' : 'default',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          animation: 'dynamicIsland 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          '@keyframes dynamicIsland': {
            '0%': { transform: `${position === 'top-center' ? 'translate(-50%, -100%)' : 'translateY(-100%)'} scale(0.8)`, opacity: 0 },
            '100%': { transform: `${position === 'top-center' ? 'translate(-50%, 0)' : 'translateY(0)'} scale(1)`, opacity: 1 },
          },
          '&:hover': {
            transform: `${position === 'top-center' ? 'translate(-50%, 0)' : 'translateY(0)'} scale(1.02)`,
            boxShadow: '0 25px 80px rgba(0, 0, 0, 0.25)',
          },
          '&:active': {
            transform: `${position === 'top-center' ? 'translate(-50%, 0)' : 'translateY(0)'} scale(0.98)`,
          },
          ...positionStyles,
        }}
      >
        {/* Progress bar */}
        {duration && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              backgroundColor: typeStyles.iconColor,
              transformOrigin: 'left',
              animation: !isHovered ? `shrink ${duration}ms linear forwards` : 'none',
              '@keyframes shrink': {
                from: { transform: 'scaleX(1)' },
                to: { transform: 'scaleX(0)' },
              },
            }}
          />
        )}

        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            {/* Icon */}
            {showIcon && (
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: iOSStyles.borderRadius.medium,
                  backgroundColor: `${typeStyles.iconColor}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {typeStyles.icon}
              </Box>
            )}

            {/* Content */}
            <Box sx={{ flex: 1 }}>
              {title && (
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: iOSStyles.colors.label,
                    mb: 0.5,
                    fontSize: '15px',
                  }}
                >
                  {title}
                </Typography>
              )}
              
              {message && (
                <Typography
                  variant="body2"
                  sx={{
                    color: iOSStyles.colors.secondaryLabel,
                    fontSize: '13px',
                    lineHeight: 1.4,
                  }}
                >
                  {message}
                </Typography>
              )}

              {/* Action */}
              {action && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    mt: 1.5,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: typeStyles.iconColor,
                      fontWeight: 600,
                      fontSize: '12px',
                    }}
                  >
                    {action.label}
                  </Typography>
                  <ArrowForwardIos sx={{ fontSize: 12, color: typeStyles.iconColor }} />
                </Box>
              )}
            </Box>

            {/* Close button */}
            {showClose && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  iOSUtils.hapticFeedback('light');
                  handleClose();
                }}
                sx={{
                  color: iOSStyles.colors.systemGray,
                  '&:active': { transform: 'scale(0.9)' },
                  transition: 'transform 0.2s ease',
                  alignSelf: 'flex-start',
                }}
              >
                <Close fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Haptic feedback on click */}
        {action && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0,
              transition: 'opacity 0.2s',
              '&:active': {
                opacity: 0.1,
                backgroundColor: typeStyles.iconColor,
              },
            }}
          />
        )}
      </Paper>
    </Slide>
  );
};

// Notification manager component
export const IOSNotificationManager = () => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = (notification) => {
    const id = Date.now();
    const newNotification = { ...notification, id, show: true };
    setNotifications((prev) => [...prev, newNotification]);
    
    iOSUtils.hapticFeedback(notification.type === 'error' ? 'error' : 'light');
    
    return id;
  };

  const hideNotification = (id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, show: false } : n
      )
    );
    
    // Remove from array after animation
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 300);
  };

  const clearAll = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, show: false }))
    );
    
    setTimeout(() => {
      setNotifications([]);
    }, 300);
  };

  return (
    <>
      {notifications.map((notification, index) => (
        <IOSNotification
          key={notification.id}
          {...notification}
          onClose={() => hideNotification(notification.id)}
          position={notification.position || (index < 3 ? 'top-right' : 'bottom-right')}
          style={{ zIndex: 9999 - index }}
        />
      ))}
    </>
  );
};

export default IOSNotification;