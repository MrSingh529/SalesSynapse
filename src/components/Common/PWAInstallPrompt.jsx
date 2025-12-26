import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  InstallDesktop,
  Close,
  PhoneAndroid,
  Laptop,
  Tablet,
  Info
} from '@mui/icons-material';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        window.navigator.standalone || 
                        document.referrer.includes('android-app://');
    setIsStandalone(isStandalone);

    // Check for iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOS);

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show install prompt after 5 seconds
      setTimeout(() => {
        if (!isStandalone && !localStorage.getItem('pwaInstallDismissed')) {
          setShowInstallPrompt(true);
        }
      }, 5000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if app was recently installed
    if (window.navigator.getInstalledRelatedApps) {
      window.navigator.getInstalledRelatedApps().then(apps => {
        if (apps.length > 0) {
          console.log('PWA is installed');
        }
      });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      if (isIOS) {
        setShowIOSInstructions(true);
      }
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setShowInstallPrompt(false);
    } else {
      console.log('User dismissed the install prompt');
    }
    
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwaInstallDismissed', 'true');
  };

  const handleIOSInstructionsClose = () => {
    setShowIOSInstructions(false);
  };

  if (isStandalone) {
    return null; // Don't show if already installed
  }

  return (
    <>
      {/* Install Prompt Snackbar */}
      <Snackbar
        open={showInstallPrompt}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ 
          bottom: { xs: 70, sm: 80 },
          '& .MuiSnackbarContent-root': {
            borderRadius: 2,
            maxWidth: 500
          }
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 2, 
            display: 'flex', 
            alignItems: 'center',
            gap: 2,
            bgcolor: 'background.paper',
            color: 'text.primary'
          }}
        >
          <InstallDesktop sx={{ color: 'primary.main', fontSize: 28 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Install SalesSynapse Pro
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Install this app on your {isIOS ? 'iOS device' : 'device'} for a better experience
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              variant="contained" 
              size="small"
              onClick={handleInstallClick}
              startIcon={<InstallDesktop />}
            >
              Install
            </Button>
            <IconButton size="small" onClick={handleDismiss}>
              <Close />
            </IconButton>
          </Box>
        </Paper>
      </Snackbar>

      {/* iOS Install Instructions Dialog */}
      <Dialog 
        open={showIOSInstructions} 
        onClose={handleIOSInstructionsClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhoneAndroid sx={{ color: 'primary.main' }} />
            <Typography variant="h6">Install on iOS</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2 }}>
            <Typography variant="body1" paragraph>
              To install SalesSynapse Pro on your iOS device:
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box sx={{ 
                  bgcolor: 'primary.main', 
                  color: 'white',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  1
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Tap the Share button
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tap the Share icon <Info sx={{ fontSize: 14, verticalAlign: 'middle' }} /> in Safari's menu bar
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box sx={{ 
                  bgcolor: 'primary.main', 
                  color: 'white',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  2
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Scroll down and tap "Add to Home Screen"
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Scroll through the share options and select "Add to Home Screen"
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box sx={{ 
                  bgcolor: 'primary.main', 
                  color: 'white',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  3
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Tap "Add" in the top-right corner
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Confirm by tapping "Add" in the top-right corner
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2">
                After installation, you can access SalesSynapse Pro directly from your home screen like any other app.
              </Typography>
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleIOSInstructionsClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PWAInstallPrompt;