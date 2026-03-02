import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';
import { Business } from '@mui/icons-material';

const PrivateRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: 'background.default',
          gap: 3,
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(0, 122, 255, 0.3)',
            }}
          >
            <Business sx={{ fontSize: 40, color: 'white' }} />
          </Box>
        </motion.div>

        <Box sx={{ position: 'relative' }}>
          <CircularProgress
            size={50}
            thickness={4}
            sx={{
              color: 'primary.main',
            }}
          />
        </Box>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
            Loading SalesSynapse...
          </Typography>
        </motion.div>
      </Box>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
