import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Button,
  IconButton,
  Typography,
  Paper,
} from '@mui/material';
import { Close, GetApp, Apple } from '@mui/icons-material';
import useHaptic from '../../hooks/useHaptic';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const { impactMedium } = useHaptic();

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    impactMedium();
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    impactMedium();
    setShowPrompt(false);
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{
            position: 'fixed',
            bottom: 16,
            left: 16,
            right: 16,
            zIndex: 9999,
            maxWidth: 400,
            margin: '0 auto',
          }}
        >
          <Paper
            elevation={8}
            sx={{
              p: 2,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
              color: 'white',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: 2,
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Apple sx={{ fontSize: 32 }} />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Install SalesSynapse
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                  Add to your home screen for quick access!
                </Typography>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleInstall}
                    startIcon={<GetApp />}
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      fontWeight: 600,
                      '&:hover': { bgcolor: 'grey.100' },
                    }}
                  >
                    Install
                  </Button>
                  <Button
                    variant="text"
                    size="small"
                    onClick={handleDismiss}
                    sx={{ color: 'white', fontWeight: 600 }}
                  >
                    Maybe Later
                  </Button>
                </Box>
              </Box>

              <IconButton
                size="small"
                onClick={handleDismiss}
                sx={{ color: 'white' }}
              >
                <Close />
              </IconButton>
            </Box>
          </Paper>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PWAInstallPrompt;
