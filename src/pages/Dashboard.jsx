import React from "react";
import { Container } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import SalesDashboard from "../components/Dashboard/SalesDashboard";
import ManagerDashboard from "../components/Dashboard/ManagerDashboard";

const Dashboard = () => {
  const { user, userData } = useAuth(); // userData is now in useAuth

  // Check if user is manager based on role in Firestore

  const isManager = userData?.role === "manager";
  return (
    <Container maxWidth="xl">
      {isManager ? <ManagerDashboard /> : <SalesDashboard />}
    </Container>
  );
};

export default Dashboard;