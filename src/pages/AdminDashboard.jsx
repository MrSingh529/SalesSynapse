import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import ManagerDashboard from '../components/Dashboard/ManagerDashboard';
const AdminDashboard = () => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Manager Dashboard
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Overview of team performance and visits
        </Typography>
      </Box>
      <ManagerDashboard />
    </Container>
  );
};
export default AdminDashboard;