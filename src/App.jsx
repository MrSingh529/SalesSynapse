import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/Common/PrivateRoute';
import MainLayout from './components/Layout/MainLayout';
import PWAInstallPrompt from './components/Common/PWAInstallPrompt';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NewVisit from './pages/NewVisit';
import VisitReports from './pages/VisitReports';
import AdminDashboard from './pages/AdminDashboard';
import { iosTheme } from './styles/iosTheme';
import './styles/iosAnimations.css';
import './App.css';

function App() {
  return (
    <ThemeProvider theme={iosTheme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          {/* PWA Install Prompt */}
          <PWAInstallPrompt />
          
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<PrivateRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/new-visit" element={<NewVisit />} />
                  <Route path="/edit-visit/:id" element={<NewVisit />} />
                  <Route path="/visits" element={<VisitReports />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                </Route>
              </Route>
            </Routes>
          </AnimatePresence>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
