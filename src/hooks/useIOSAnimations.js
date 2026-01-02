import { useState, useEffect, useCallback } from 'react';

export const useIOSAnimations = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });

  // iOS-style haptic feedback
  const hapticFeedback = useCallback((type = 'light') => {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30],
      success: [20, 40, 20],
      error: [40, 20, 40, 20],
      selection: [3],
      impact: [10, 20, 10],
    };

    if (window.navigator.vibrate) {
      window.navigator.vibrate(patterns[type] || patterns.light);
    }

    // Fallback for non-vibrate devices
    return new Promise((resolve) => {
      setTimeout(resolve, 50);
    });
  }, []);

  // iOS-style press animation
  const pressAnimation = useCallback(async (element, scale = 0.96) => {
    if (!element) return;
    
    setIsAnimating(true);
    element.style.transition = 'transform 0.1s cubic-bezier(0.4, 0, 0.2, 1)';
    element.style.transform = `scale(${scale})`;
    
    await hapticFeedback('light');
    
    setTimeout(() => {
      element.style.transform = 'scale(1)';
      setTimeout(() => {
        element.style.transition = '';
        setIsAnimating(false);
      }, 100);
    }, 100);
  }, [hapticFeedback]);

  // iOS-style bounce animation
  const bounceAnimation = useCallback(async (element) => {
    if (!element) return;
    
    setIsAnimating(true);
    element.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    element.style.transform = 'scale(1.1)';
    
    await hapticFeedback('medium');
    
    setTimeout(() => {
      element.style.transform = 'scale(1)';
      setTimeout(() => {
        element.style.transition = '';
        setIsAnimating(false);
      }, 300);
    }, 300);
  }, [hapticFeedback]);

  // iOS-style shake animation (for errors)
  const shakeAnimation = useCallback(async (element) => {
    if (!element) return;
    
    setIsAnimating(true);
    const keyframes = [
      { transform: 'translateX(0)' },
      { transform: 'translateX(-8px)' },
      { transform: 'translateX(8px)' },
      { transform: 'translateX(-8px)' },
      { transform: 'translateX(8px)' },
      { transform: 'translateX(0)' },
    ];
    
    await hapticFeedback('error');
    
    element.animate(keyframes, {
      duration: 500,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    });
    
    setTimeout(() => setIsAnimating(false), 500);
  }, [hapticFeedback]);

  // iOS-style slide animation
  const slideAnimation = useCallback(async (element, direction = 'right') => {
    if (!element) return;
    
    setIsAnimating(true);
    const startX = direction === 'right' ? '100%' : direction === 'left' ? '-100%' : '0';
    const endX = '0';
    
    element.style.transform = `translateX(${startX})`;
    element.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    
    await hapticFeedback('light');
    
    setTimeout(() => {
      element.style.transform = `translateX(${endX})`;
      setTimeout(() => {
        element.style.transition = '';
        setIsAnimating(false);
      }, 300);
    }, 10);
  }, [hapticFeedback]);

  // iOS-style fade animation
  const fadeAnimation = useCallback(async (element, type = 'in') => {
    if (!element) return;
    
    setIsAnimating(true);
    const startOpacity = type === 'in' ? 0 : 1;
    const endOpacity = type === 'in' ? 1 : 0;
    
    element.style.opacity = startOpacity;
    element.style.transition = 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    
    setTimeout(() => {
      element.style.opacity = endOpacity;
      setTimeout(() => {
        element.style.transition = '';
        setIsAnimating(false);
      }, 300);
    }, 10);
  }, []);

  // iOS-style swipe detection
  const setupSwipeDetection = useCallback((element, onSwipe) => {
    if (!element) return () => {};

    const handleTouchStart = (e) => {
      setTouchStart({
        x: e.changedTouches[0].screenX,
        y: e.changedTouches[0].screenY,
      });
    };

    const handleTouchEnd = (e) => {
      setTouchEnd({
        x: e.changedTouches[0].screenX,
        y: e.changedTouches[0].screenY,
      });

      // Check if it's a swipe
      const diffX = touchEnd.x - touchStart.x;
      const diffY = touchEnd.y - touchStart.y;

      // Minimum swipe distance
      if (Math.abs(diffX) > 50 && Math.abs(diffY) < 50) {
        if (onSwipe) {
          onSwipe(diffX > 0 ? 'right' : 'left');
          hapticFeedback('light');
        }
      }
    };

    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [touchStart, touchEnd, hapticFeedback]);

  // iOS-style long press detection
  const setupLongPress = useCallback((element, onLongPress, duration = 500) => {
    if (!element) return () => {};

    let pressTimer;

    const handleTouchStart = () => {
      pressTimer = setTimeout(() => {
        if (onLongPress) {
          onLongPress();
          hapticFeedback('medium');
        }
      }, duration);
    };

    const handleTouchEnd = () => {
      clearTimeout(pressTimer);
    };

    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchend', handleTouchEnd);
    element.addEventListener('touchmove', handleTouchEnd);

    return () => {
      clearTimeout(pressTimer);
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchmove', handleTouchEnd);
    };
  }, [hapticFeedback]);

  // iOS-style pull to refresh
  const setupPullToRefresh = useCallback((element, onRefresh) => {
    if (!element) return () => {};

    let startY = 0;
    let pulling = false;

    const handleTouchStart = (e) => {
      if (element.scrollTop === 0) {
        startY = e.touches[0].pageY;
        pulling = true;
      }
    };

    const handleTouchMove = (e) => {
      if (!pulling) return;

      const diff = e.touches[0].pageY - startY;
      
      if (diff > 0) {
        e.preventDefault();
        // You can add a refresh indicator here
      }
    };

    const handleTouchEnd = (e) => {
      if (!pulling) return;

      const diff = e.changedTouches[0].pageY - startY;
      
      if (diff > 100 && onRefresh) {
        hapticFeedback('medium');
        onRefresh();
      }
      
      pulling = false;
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [hapticFeedback]);

  // iOS-style scroll momentum
  const enableMomentumScroll = useCallback((element) => {
    if (!element) return;
    
    element.style.webkitOverflowScrolling = 'touch';
    element.style.overflowScrolling = 'touch';
  }, []);

  return {
    isAnimating,
    hapticFeedback,
    pressAnimation,
    bounceAnimation,
    shakeAnimation,
    slideAnimation,
    fadeAnimation,
    setupSwipeDetection,
    setupLongPress,
    setupPullToRefresh,
    enableMomentumScroll,
  };
};

export default useIOSAnimations;