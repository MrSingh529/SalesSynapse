// iOS Animation Utilities
export const iOSAnimations = {
  // Page transitions
  pageTransition: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
  },

  // Modal animations
  modalTransition: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
  },

  // Slide in from right (iOS push navigation)
  slideInRight: {
    initial: { x: '100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '100%', opacity: 0 },
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
  },

  // Slide in from left (iOS pop navigation)
  slideInLeft: {
    initial: { x: '-100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '-100%', opacity: 0 },
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
  },

  // Fade in
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2, ease: 'easeOut' }
  },

  // Scale in (for buttons, cards)
  scaleIn: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.2, ease: 'easeOut' }
  },

  // Bounce (for notifications)
  bounce: {
    initial: { y: -50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { 
      type: 'spring',
      stiffness: 500,
      damping: 30
    }
  },

  // List item stagger
  listStagger: {
    container: {
      animate: {
        transition: {
          staggerChildren: 0.05
        }
      }
    },
    item: {
      initial: { y: 20, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  },

  // Hover animations
  hoverScale: {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 }
  },

  // Press animation (like iOS buttons)
  pressAnimation: {
    whileTap: { scale: 0.96 }
  },

  // Ripple effect
  rippleEffect: {
    whileTap: { scale: 0.95 },
    transition: { duration: 0.1 }
  },

  // Shake animation (for errors)
  shake: {
    animate: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.5 }
    }
  },

  // Loading spinner animation
  spinner: {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }
    }
  },

  // Pulse animation (for notifications)
  pulse: {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [1, 0.8, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  },

  // Slide up (for bottom sheets)
  slideUp: {
    initial: { y: '100%' },
    animate: { y: 0 },
    exit: { y: '100%' },
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
  },

  // Blur background (for modals)
  blurBackground: {
    initial: { backdropFilter: 'blur(0px)', opacity: 0 },
    animate: { backdropFilter: 'blur(8px)', opacity: 1 },
    exit: { backdropFilter: 'blur(0px)', opacity: 0 },
    transition: { duration: 0.3 }
  },

  // Card hover effect
  cardHover: {
    whileHover: { 
      y: -4,
      boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)'
    },
    whileTap: { 
      y: -2,
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)'
    }
  },

  // Icon bounce
  iconBounce: {
    animate: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 0.3,
        times: [0, 0.5, 1]
      }
    }
  },

  // Success checkmark animation
  successCheck: {
    pathLength: {
      initial: 0,
      animate: 1,
      transition: { duration: 0.5, ease: 'easeInOut' }
    }
  }
};

// iOS Gesture Handlers
export const iOSGestures = {
  // Swipe to dismiss
  swipeToDismiss: {
    drag: 'x',
    dragConstraints: { left: 0, right: 0 },
    dragElastic: 0.2,
    onDragEnd: (event, info, callback) => {
      if (info.offset.x > 100) {
        callback();
      }
    }
  },

  // Pull to refresh
  pullToRefresh: {
    drag: 'y',
    dragConstraints: { top: 0, bottom: 0 },
    dragElastic: 0.2,
    onDragEnd: (event, info, callback) => {
      if (info.offset.y > 100) {
        callback();
      }
    }
  },

  // Long press
  longPress: {
    whileTap: { scale: 0.95 },
    onTapStart: (callback) => {
      const timer = setTimeout(callback, 500);
      return () => clearTimeout(timer);
    }
  }
};

// iOS Utility Functions
export const iOSUtils = {
  // Simulate haptic feedback
  hapticFeedback: (type = 'light') => {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30],
      success: [20, 40, 20],
      error: [40, 20, 40, 20]
    };

    if (window.navigator.vibrate) {
      window.navigator.vibrate(patterns[type] || patterns.light);
    }
    
    // Fallback visual feedback for desktop
    if (!window.navigator.vibrate) {
      const element = document.activeElement;
      if (element) {
        element.classList.add('haptic');
        setTimeout(() => element.classList.remove('haptic'), 100);
      }
    }
  },

  // iOS-style blur effect
  applyBlur: (element, intensity = 10) => {
    if (element) {
      element.style.backdropFilter = `blur(${intensity}px) saturate(180%)`;
      element.style.webkitBackdropFilter = `blur(${intensity}px) saturate(180%)`;
    }
  },

  // Safe area insets
  getSafeAreaInsets: () => {
    return {
      top: getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-top') || '0px',
      bottom: getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-bottom') || '0px',
      left: getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-left') || '0px',
      right: getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-right') || '0px'
    };
  },

  // iOS-style scroll momentum
  enableMomentumScroll: (element) => {
    if (element) {
      element.style.webkitOverflowScrolling = 'touch';
    }
  },

  // Prevent iOS zoom on double tap
  preventDoubleTapZoom: () => {
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    }, { passive: false });
  },

  // iOS-style back gesture detection
  setupBackGesture: (callback) => {
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      if (!startX || !startY) return;

      const diffX = e.touches[0].clientX - startX;
      const diffY = e.touches[0].clientY - startY;

      // Detect edge swipe (iOS back gesture)
      if (Math.abs(diffY) < 10 && diffX > 50 && startX < 20) {
        if (callback) callback();
        startX = 0;
        startY = 0;
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  },

  // iOS-style dynamic viewport height
  setupViewportHeight: () => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);

    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }
};

// iOS Component Wrappers
export const withIOSAnimations = (Component) => {
  return (props) => {
    // Add iOS-specific props and handlers
    const iosProps = {
      ...props,
      className: props.className ? `${props.className} ios-component` : 'ios-component',
      onClick: (e) => {
        iOSUtils.hapticFeedback('light');
        if (props.onClick) props.onClick(e);
      }
    };

    return <Component {...iosProps} />;
  };
};

// iOS Style Constants
export const iOSStyles = {
  colors: {
    systemBlue: '#007AFF',
    systemGreen: '#34C759',
    systemIndigo: '#5856D6',
    systemOrange: '#FF9500',
    systemPink: '#FF2D55',
    systemPurple: '#AF52DE',
    systemRed: '#FF3B30',
    systemTeal: '#5AC8FA',
    systemYellow: '#FFCC00',
    systemGray: '#8E8E93',
    systemGray2: '#AEAEB2',
    systemGray3: '#C7C7CC',
    systemGray4: '#D1D1D6',
    systemGray5: '#E5E5EA',
    systemGray6: '#F2F2F7',
    label: '#000000',
    secondaryLabel: '#3C3C4399',
    tertiaryLabel: '#3C3C434D',
    quaternaryLabel: '#3C3C432E'
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48
  },
  
  typography: {
    largeTitle: {
      fontSize: 34,
      fontWeight: '700',
      lineHeight: 41,
      letterSpacing: -0.02
    },
    title1: {
      fontSize: 28,
      fontWeight: '700',
      lineHeight: 34,
      letterSpacing: -0.01
    },
    title2: {
      fontSize: 22,
      fontWeight: '600',
      lineHeight: 28
    },
    title3: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 25
    },
    headline: {
      fontSize: 17,
      fontWeight: '600',
      lineHeight: 22
    },
    body: {
      fontSize: 17,
      fontWeight: '400',
      lineHeight: 22
    },
    callout: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 21
    },
    subhead: {
      fontSize: 15,
      fontWeight: '400',
      lineHeight: 20
    },
    footnote: {
      fontSize: 13,
      fontWeight: '400',
      lineHeight: 18
    },
    caption1: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 16
    },
    caption2: {
      fontSize: 11,
      fontWeight: '400',
      lineHeight: 13
    }
  },
  
  shadows: {
    small: '0 2px 8px rgba(0, 0, 0, 0.04)',
    medium: '0 4px 16px rgba(0, 0, 0, 0.08)',
    large: '0 8px 24px rgba(0, 0, 0, 0.12)',
    xlarge: '0 12px 32px rgba(0, 0, 0, 0.16)'
  },
  
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
    xlarge: 20,
    round: 9999
  }
};

export default iOSAnimations;