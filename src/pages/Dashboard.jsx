import React from 'react';
import { Container, Fade } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import SalesDashboard from '../components/Dashboard/SalesDashboard';
import ManagerDashboard from '../components/Dashboard/ManagerDashboard';

const Dashboard = () => {
  const { user, userData } = useAuth();

  // Check if user is manager based on role in Firestore
  const isManager = userData?.role === 'manager';

  return (
    <Fade in={true} timeout={400}>
      <Container 
        maxWidth="xl" 
        sx={{ 
          px: { xs: 2, sm: 3 },
          animation: 'iosFadeIn 0.4s ease-out',
        }}
      >
        {isManager ? <ManagerDashboard /> : <SalesDashboard />}
      </Container>
    </Fade>
  );
};

export default Dashboard;