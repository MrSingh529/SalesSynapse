import React, { useState } from 'react';
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
  Fade,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signIn, resetPassword } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { APP_NAME, SUPPORT_EMAIL } from '../utils/constants';
import { 
  Business, 
  Login as LoginIcon, 
  Close, 
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  ArrowForward,
} from '@mui/icons-material';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn(email, password);
    
    if (result.success) {
      setUser(result.user);
      // iOS-style navigation animation
      document.body.style.opacity = 0;
      setTimeout(() => navigate('/dashboard'), 300);
    } else {
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
    
    const result = await resetPassword(resetEmail);
    
    if (result.success) {
      setResetSuccess(true);
      setTimeout(() => {
        setResetDialogOpen(false);
        setResetSuccess(false);
        setResetEmail('');
      }, 3000);
    } else {
      setResetError(result.error);
    }
    
    setResetLoading(false);
  };

  const handleResetDialogClose = () => {
    setResetDialogOpen(false);
    setResetEmail('');
    setResetError('');
    setResetSuccess(false);
  };

  const handleContactAdmin = () => {
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${APP_NAME} Support Request&body=Hello Harpinder,%0D%0A%0D%0AI need assistance with ${APP_NAME}.%0D%0A%0D%0APlease help with:`;
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: { xs: 4, sm: 8 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Fade in={true} timeout={500}>
            <Paper 
              elevation={0}
              sx={{ 
                p: { xs: 3, sm: 4 },
                width: '100%',
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #007AFF 0%, #5856D6 100%)',
                },
              }}
            >
              {/* iOS Style Background Pattern */}
              <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 20% 80%, rgba(0, 122, 255, 0.05) 0%, transparent 50%)',
                pointerEvents: 'none',
              }} />
              
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                mb: 4,
                position: 'relative',
                zIndex: 1,
              }}>
                <Box sx={{
                  width: 80,
                  height: 80,
                  background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
                  borderRadius: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                  boxShadow: '0 4px 20px rgba(0, 122, 255, 0.3)',
                  animation: 'iosSpring 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                }}>
                  <Business sx={{ 
                    fontSize: 40, 
                    color: 'white',
                  }} />
                </Box>
                <Typography 
                  component="h1" 
                  variant="h4" 
                  sx={{ 
                    mt: 1, 
                    fontWeight: 700,
                    background: 'linear-gradient(90deg, #007AFF 0%, #5856D6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {APP_NAME}
                </Typography>
                <Typography 
                  variant="subtitle1" 
                  color="text.secondary" 
                  align="center" 
                  sx={{ 
                    mt: 1.5,
                    fontSize: '15px',
                    fontWeight: 400,
                  }}
                >
                  AI-Powered Sales Intelligence Platform
                </Typography>
              </Box>

              <Typography 
                component="h2" 
                variant="h6" 
                align="center" 
                color="text.primary" 
                gutterBottom
                sx={{
                  fontSize: '20px',
                  fontWeight: 600,
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                }}
              >
                <LoginIcon sx={{ color: '#007AFF' }} />
                Sign in to your account
              </Typography>

              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3,
                    borderRadius: '10px',
                    border: '1px solid #FF3B30',
                    background: 'rgba(255, 59, 48, 0.1)',
                    '& .MuiAlert-icon': {
                      alignItems: 'center',
                      color: '#FF3B30',
                    },
                    animation: 'iosSpring 0.4s',
                  }}
                >
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                {/* Email Field */}
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
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: '#8E8E93' }} />
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: '12px',
                      fontSize: '17px',
                      '& .MuiOutlinedInput-input': {
                        padding: '16px',
                      },
                      '&.Mui-focused': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#007AFF',
                          borderWidth: '2px',
                        },
                      },
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      fontSize: '15px',
                      '&.Mui-focused': {
                        color: '#007AFF',
                      },
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(0, 0, 0, 0.02)',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      },
                    },
                  }}
                />
                
                {/* Password Field */}
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
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: '#8E8E93' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: '#8E8E93' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: '12px',
                      fontSize: '17px',
                      '& .MuiOutlinedInput-input': {
                        padding: '16px',
                      },
                      '&.Mui-focused': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#007AFF',
                          borderWidth: '2px',
                        },
                      },
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      fontSize: '15px',
                      '&.Mui-focused': {
                        color: '#007AFF',
                      },
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(0, 0, 0, 0.02)',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      },
                    },
                  }}
                />

                {/* iOS Style Sign In Button */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  endIcon={!loading && <ArrowForward />}
                  sx={{ 
                    mt: 3, 
                    mb: 2,
                    py: 1.75,
                    borderRadius: '12px',
                    fontSize: '17px',
                    fontWeight: 600,
                    textTransform: 'none',
                    background: 'linear-gradient(180deg, #007AFF 0%, #0056CC 100%)',
                    boxShadow: '0 4px 20px rgba(0, 122, 255, 0.3)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 25px rgba(0, 122, 255, 0.4)',
                      background: 'linear-gradient(180deg, #007AFF 0%, #0056CC 100%)',
                    },
                    '&:active': {
                      transform: 'scale(0.98)',
                    },
                    '&.Mui-disabled': {
                      background: '#C7C7CC',
                      boxShadow: 'none',
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </Box>

              {/* iOS Style Footer Links */}
              <Box sx={{ 
                mt: 4, 
                pt: 3, 
                borderTop: '1px solid rgba(0, 0, 0, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      fontSize: '15px',
                      '&:hover': {
                        color: '#007AFF',
                        cursor: 'pointer',
                      },
                      transition: 'color 0.2s ease',
                    }}
                    onClick={() => setResetDialogOpen(true)}
                  >
                    Forgot Password?
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      fontSize: '15px',
                      '&:hover': {
                        color: '#007AFF',
                        cursor: 'pointer',
                      },
                      transition: 'color 0.2s ease',
                    }}
                    onClick={handleContactAdmin}
                  >
                    Contact Admin
                  </Typography>
                </Box>
                
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  align="center"
                  sx={{ 
                    opacity: 0.6,
                    fontSize: '13px',
                  }}
                >
                  New users require administrator setup
                </Typography>
              </Box>

              {/* Copyright Footer */}
              <Box sx={{ 
                mt: 4, 
                pt: 3, 
                borderTop: '1px solid rgba(0, 0, 0, 0.05)', 
                textAlign: 'center' 
              }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '13px' }}>
                  © {new Date().getFullYear()} RV Solutions
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5, fontSize: '12px' }}>
                  Developed in CEO Office Lab by Harpinder Singh
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5, fontSize: '12px' }}>
                  For Support: {SUPPORT_EMAIL}
                </Typography>
              </Box>
            </Paper>
          </Fade>
        </Box>
      </Container>

      {/* iOS Style Password Reset Dialog */}
      <Dialog 
        open={resetDialogOpen} 
        onClose={handleResetDialogClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle sx={{ 
          p: 3, 
          pb: 2,
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
          background: 'linear-gradient(90deg, #007AFF 0%, #5856D6 100%)',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Reset Password
          </Typography>
          <IconButton 
            onClick={handleResetDialogClose} 
            size="small"
            sx={{ color: 'white' }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {resetSuccess ? (
            <Alert 
              severity="success" 
              sx={{ 
                my: 2, 
                borderRadius: '12px',
                border: '1px solid #34C759',
                background: 'rgba(52, 199, 89, 0.1)',
              }}
            >
              Password reset email sent! Please check your inbox.
            </Alert>
          ) : (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontSize: '15px' }}>
                Enter your email address and we'll send you a link to reset your password.
              </Typography>
              
              {resetError && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 2, 
                    borderRadius: '10px',
                    border: '1px solid #FF3B30',
                    background: 'rgba(255, 59, 48, 0.1)',
                  }}
                >
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
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: '#8E8E93' }} />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: '12px',
                    fontSize: '17px',
                    '& .MuiOutlinedInput-input': {
                      padding: '16px',
                    },
                  },
                }}
                InputLabelProps={{
                  sx: { fontSize: '15px' },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                  },
                }}
                autoFocus
              />
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          {!resetSuccess ? (
            <>
              <Button 
                onClick={handleResetDialogClose} 
                disabled={resetLoading}
                sx={{
                  borderRadius: '10px',
                  px: 3,
                  py: 1,
                  fontWeight: 500,
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleResetPassword}
                variant="contained"
                disabled={resetLoading}
                startIcon={resetLoading ? <CircularProgress size={20} /> : <Email />}
                sx={{
                  borderRadius: '10px',
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  background: 'linear-gradient(180deg, #007AFF 0%, #0056CC 100%)',
                  '&:hover': {
                    background: 'linear-gradient(180deg, #007AFF 0%, #0056CC 100%)',
                  },
                }}
              >
                {resetLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </>
          ) : (
            <Button 
              onClick={handleResetDialogClose} 
              variant="contained" 
              fullWidth
              sx={{
                borderRadius: '12px',
                py: 1.5,
                fontWeight: 600,
                background: 'linear-gradient(180deg, #007AFF 0%, #0056CC 100%)',
              }}
            >
              Close
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Login;