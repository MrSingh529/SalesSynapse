import React from 'react';
import { Container } from '@mui/material';
import { motion } from 'framer-motion';
import VisitReport from '../components/Visits/VisitReport';
import { useAuth } from '../context/AuthContext';

const VisitReports = () => {
  const { userData } = useAuth();
  const isManager = userData?.role === 'manager';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Container maxWidth="xl">
        <VisitReport isManager={isManager} />
      </Container>
    </motion.div>
  );
};

export default VisitReports;
