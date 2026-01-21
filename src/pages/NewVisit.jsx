import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Alert,
  Snackbar,
  Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NewVisitForm from '../components/Visits/NewVisitForm';
import { createVisit } from '../services/visitService';
import { useAuth } from '../context/AuthContext';
const NewVisit = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const handleSubmit = async (visitData) => {
    if (!user) {
      setError('You must be logged in to submit a visit');
      return;
    }
    setLoading(true);
    setError('');
    const result = await createVisit(visitData, user.uid, user.email);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/visits');
      }, 2000);
    } else {
      setError(result.error || 'Failed to submit visit. Please try again.');
    }

    setLoading(false);
  };
  const handleCloseSnackbar = () => {
    setSuccess(false);
    setError('');
  };
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Submit New Visit
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Fill in the details of your customer meeting
        </Typography>
      </Box>
      <Paper elevation={3} sx={{ p: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        <NewVisitForm onSubmit={handleSubmit} loading={loading} />
      </Paper>
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message="Visit submitted successfully! Redirecting..."
      />
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};
export default NewVisit;