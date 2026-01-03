import { useCallback } from 'react';

/**
 * iOS Haptic Feedback Simulation Hook
 * Provides visual and audio feedback similar to iOS haptics
 */
const useHaptic = () => {
  const triggerHaptic = useCallback((type = 'light') => {
    // Visual feedback via brief animation
    const element = document.activeElement;
    if (element) {
      element.classList.add('ios-haptic');
      setTimeout(() => {
        element.classList.remove('ios-haptic');
      }, 100);
    }

    // Try to use Vibration API if available (mobile)
    if ('vibrate' in navigator) {
      switch (type) {
        case 'light':
          navigator.vibrate(10);
          break;
        case 'medium':
          navigator.vibrate(20);
          break;
        case 'heavy':
          navigator.vibrate(30);
          break;
        case 'success':
          navigator.vibrate([10, 50, 10]);
          break;
        case 'error':
          navigator.vibrate([30, 50, 30, 50, 30]);
          break;
        default:
          navigator.vibrate(10);
      }
    }
  }, []);

  const impactLight = useCallback(() => triggerHaptic('light'), [triggerHaptic]);
  const impactMedium = useCallback(() => triggerHaptic('medium'), [triggerHaptic]);
  const impactHeavy = useCallback(() => triggerHaptic('heavy'), [triggerHaptic]);
  const notificationSuccess = useCallback(() => triggerHaptic('success'), [triggerHaptic]);
  const notificationError = useCallback(() => triggerHaptic('error'), [triggerHaptic]);

  return {
    impactLight,
    impactMedium,
    impactHeavy,
    notificationSuccess,
    notificationError,
  };
};

export default useHaptic;
