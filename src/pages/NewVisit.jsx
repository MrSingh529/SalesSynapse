import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Container,
  Paper,
  Typography,
  Alert,
  Snackbar,
  Box,
  Fade,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ErrorOutline } from '@mui/icons-material';
import NewVisitForm from '../components/Visits/NewVisitForm';
import { createVisit } from '../services/visitService';
import { useAuth } from '../context/AuthContext';
import useHaptic from '../hooks/useHaptic';

const NewVisit = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { notificationSuccess, notificationError } = useHaptic();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (visitData) => {
    if (!user) {
      setError('You must be logged in to submit a visit');
      notificationError();
      return;
    }

    setLoading(true);
    setError('');

    const result = await createVisit(visitData, user.uid, user.email);

    if (result.success) {
      notificationSuccess();
      setSuccess(true);
      setTimeout(() => {
        navigate('/visits');
      }, 2000);
    } else {
      notificationError();
      setError(result.error || 'Failed to submit visit. Please try again.');
    }

    setLoading(false);
  };

  const handleCloseSnackbar = () => {
    setSuccess(false);
    setError('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Submit New Visit
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Fill in the details of your customer meeting
            </Typography>
          </Box>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 3,
              border: 1,
              borderColor: 'divider',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            }}
          >
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Alert
                    severity="error"
                    icon={<ErrorOutline />}
                    sx={{ mb: 3, borderRadius: 2 }}
                    onClose={() => setError('')}
                  >
                    {error}
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <NewVisitForm onSubmit={handleSubmit} loading={loading} />
          </Paper>
        </motion.div>

        {/* Success Snackbar */}
        <Snackbar
          open={success}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          TransitionComponent={Fade}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="success"
            icon={<CheckCircle />}
            sx={{
              width: '100%',
              borderRadius: 2,
              fontWeight: 500,
            }}
          >
            Visit submitted successfully! Redirecting...
          </Alert>
        </Snackbar>

        {/* Error Snackbar */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="error"
            icon={<ErrorOutline />}
            sx={{ width: '100%', borderRadius: 2 }}
          >
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </motion.div>
  );
};

export default NewVisit;
