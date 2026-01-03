import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Avatar,
  CssBaseline,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signIn, resetPassword } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { APP_NAME, SUPPORT_EMAIL } from '../utils/constants';
import {
  Business,
  Email,
  Lock,
  Close,
  Visibility,
  VisibilityOff,
  CheckCircle,
} from '@mui/icons-material';
import useHaptic from '../hooks/useHaptic';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState('');
  
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { impactLight, impactMedium, notificationSuccess, notificationError } = useHaptic();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    impactLight();

    const result = await signIn(email, password);

    if (result.success) {
      notificationSuccess();
      setUser(result.user);
      navigate('/dashboard');
    } else {
      notificationError();
      setError(result.error || 'Login failed. Please try again.');
    }

    setLoading(false);
  };

  const handleResetPassword = async () => {
    if (!resetEmail) {
      setResetError('Please enter your email address');
      return;
    }
    setResetLoading(true);
    setResetError('');
    impactLight();

    const result = await resetPassword(resetEmail);

    if (result.success) {
      notificationSuccess();
      setResetSuccess(true);
      setTimeout(() => {
        setResetDialogOpen(false);
        setResetSuccess(false);
        setResetEmail('');
      }, 3000);
    } else {
      notificationError();
      setResetError(result.error);
    }

    setResetLoading(false);
  };

  const handleResetDialogClose = () => {
    impactLight();
    setResetDialogOpen(false);
    setResetEmail('');
    setResetError('');
    setResetSuccess(false);
  };

  const handleContactAdmin = () => {
    impactMedium();
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${APP_NAME} Support Request&body=Hello,%0D%0A%0D%0AI need assistance with ${APP_NAME}.%0D%0A%0D%0APlease help with:`;
  };

  return (
    <>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />

        <Container component="main" maxWidth="xs">
          <CssBaseline />
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
          >
            <Paper
              elevation={10}
              sx={{
                p: 4,
                borderRadius: 4,
                backdropFilter: 'blur(20px)',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              {/* Logo Section */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Avatar
                    sx={{
                      width: 90,
                      height: 90,
                      background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
                      boxShadow: '0 8px 16px rgba(0, 122, 255, 0.3)',
                      mb: 2,
                    }}
                  >
                    <Business sx={{ fontSize: 50, color: 'white' }} />
                  </Avatar>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 0.5,
                    }}
                  >
                    {APP_NAME}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    AI-Powered Sales Intelligence
                  </Typography>
                </motion.div>
              </Box>

              {/* Error Alert */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert
                      severity="error"
                      sx={{ mb: 2, borderRadius: 2 }}
                      onClose={() => setError('')}
                    >
                      {error}
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Login Form */}
              <Box component="form" onSubmit={handleSubmit} noValidate>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => {
                              impactLight();
                              setShowPassword(!showPassword);
                            }}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{
                      mt: 3,
                      mb: 2,
                      py: 1.5,
                      fontSize: '17px',
                      fontWeight: 600,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
                      boxShadow: '0 4px 12px rgba(0, 122, 255, 0.4)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #0051D5 0%, #007AFF 100%)',
                        boxShadow: '0 6px 16px rgba(0, 122, 255, 0.5)',
                      },
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={26} color="inherit" />
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </motion.div>
              </Box>

              {/* Links Section */}
              <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                <Typography variant="body2" color="text.secondary" align="center">
                  Forgot your password?{' '}
                  <Box
                    component="span"
                    onClick={() => {
                      impactLight();
                      setResetDialogOpen(true);
                    }}
                    sx={{
                      color: 'primary.main',
                      cursor: 'pointer',
                      fontWeight: 600,
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    Reset here
                  </Box>
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                  New to {APP_NAME}?{' '}
                  <Box
                    component="span"
                    onClick={handleContactAdmin}
                    sx={{
                      color: 'primary.main',
                      cursor: 'pointer',
                      fontWeight: 600,
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    Contact administrator
                  </Box>
                </Typography>
              </Box>

              {/* Footer */}
              <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  © {new Date().getFullYear()} RV Solutions
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  Developed by Harpinder Singh
                </Typography>
              </Box>
            </Paper>
          </motion.div>
        </Container>
      </Box>

      {/* Password Reset Dialog */}
      <Dialog
        open={resetDialogOpen}
        onClose={handleResetDialogClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
          },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={600}>
              Reset Password
            </Typography>
            <IconButton
              onClick={handleResetDialogClose}
              size="small"
              sx={{
                color: 'text.secondary',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {resetSuccess ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <CheckCircle sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Email Sent!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Please check your inbox and follow the instructions to reset your password.
                </Typography>
              </Box>
            </motion.div>
          ) : (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Enter your email address and we'll send you a link to reset your password.
              </Typography>

              {resetError && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                  {resetError}
                </Alert>
              )}

              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                disabled={resetLoading}
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </>
          )}
        </DialogContent>
        {!resetSuccess && (
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleResetDialogClose} disabled={resetLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleResetPassword}
              variant="contained"
              disabled={resetLoading}
              startIcon={resetLoading ? <CircularProgress size={20} /> : <Email />}
            >
              {resetLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </>
  );
};

export default Login;
