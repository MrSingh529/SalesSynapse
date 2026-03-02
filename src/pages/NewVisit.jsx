import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Alert,
  Snackbar,
  Box,
  CircularProgress
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import NewVisitForm from '../components/Visits/NewVisitForm';
import { createVisit, getVisitById, updateVisit } from '../services/visitService'; 
import { useAuth } from '../context/AuthContext';

const NewVisit = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams(); // Get the ID from the URL if it exists
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [initialData, setInitialData] = useState(null); // Store data to edit

  const isEditMode = Boolean(id);

  // Fetch visit data if in edit mode
  useEffect(() => {
    const fetchVisitData = async () => {
      if (isEditMode) {
        setFetching(true);
        try {
          const result = await getVisitById(id);
          if (result.success) {
            // Check if user has permission to edit
            if (result.visit.salesPersonId !== user.uid && !user.email.includes("manager")) {
              setError("You don't have permission to edit this visit.");
              setTimeout(() => navigate('/visits'), 3000);
            } else {
              setInitialData(result.visit);
            }
          } else {
            setError(result.error || 'Failed to fetch visit details.');
          }
        } catch (err) {
          setError('An error occurred while fetching visit details.');
        }
        setFetching(false);
      }
    };

    if (user) {
      fetchVisitData();
    }
  }, [id, isEditMode, user, navigate]);

  const handleSubmit = async (visitData) => {
    if (!user) {
      setError('You must be logged in to submit a visit');
      return;
    }
    
    setLoading(true);
    setError('');
    
    let result;
    
    if (isEditMode) {
      // Call update if editing
      result = await updateVisit(id, visitData);
    } else {
      // Call create if new
      result = await createVisit(visitData, user.uid, user.email);
    }

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/visits');
      }, 2000);
    } else {
      setError(result.error || `Failed to ${isEditMode ? 'update' : 'submit'} visit. Please try again.`);
    }

    setLoading(false);
  };

  const handleCloseSnackbar = () => {
    setSuccess(false);
    setError('');
  };

  // Show a loader while fetching initial data for editing
  if (fetching) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {isEditMode ? 'Edit Visit' : 'Submit New Visit'}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {isEditMode ? 'Update the details of your customer meeting' : 'Fill in the details of your customer meeting'}
        </Typography>
      </Box>
      <Paper elevation={3} sx={{ p: 4 }}>
        {error && !fetching && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {/* Pass initialData to your form component */}
        {(!isEditMode || initialData) && (
          <NewVisitForm 
            onSubmit={handleSubmit} 
            loading={loading} 
            initialData={initialData} 
            isEditMode={isEditMode}
          />
        )}
      </Paper>
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={`Visit ${isEditMode ? 'updated' : 'submitted'} successfully! Redirecting...`}
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