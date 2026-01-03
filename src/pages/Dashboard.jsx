import React from 'react';
import { Container } from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import SalesDashboard from '../components/Dashboard/SalesDashboard';
import ManagerDashboard from '../components/Dashboard/ManagerDashboard';

const Dashboard = () => {
  const { userData } = useAuth();
  const isManager = userData?.role === 'manager';

  console.log('Dashboard rendering:', { userData, isManager }); // ← ADD THIS

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{ width: '100%', minHeight: '500px' }} // ← ADD THIS
    >
      <Container maxWidth="xl" sx={{ py: 2 }}>
        {isManager ? <ManagerDashboard /> : <SalesDashboard />}
      </Container>
    </motion.div>
  );
};

export default Dashboard;
