import React from 'react';
import { Container } from '@mui/material';
import VisitReport from '../components/Visits/VisitReport';
import { useAuth } from '../context/AuthContext'; // Changed from '../hooks/useAuth'
const VisitReports = () => {
  const { user, userData } = useAuth(); // userData is now in useAuth
  
  const isManager = userData?.role === 'manager';
  return (
    <Container maxWidth="xl">
      <VisitReport isManager={isManager} />
    </Container>
  );
};
export default VisitReports;