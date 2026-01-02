import React, { useState, useEffect, useRef } from 'react';
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
  Fade,
  Zoom,
  Slide,
  Grow,
  InputAdornment,
  Divider,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
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
  Fingerprint,
  Face,
  Apple,
  Google,
  Security,
  ArrowBackIos,
  CheckCircle,
  Error as ErrorIcon,
  Info
} from '@mui/icons-material';
import { iOSUtils, iOSStyles } from '../utils/iosAnimations';
import useIOSAnimations from '../hooks/useIOSAnimations';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricLoading, setBiometricLoading] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const formRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  
  const { hapticFeedback, pressAnimation, shakeAnimation, fadeAnimation } = useIOSAnimations();

  useEffect(() => {
    // Simulate page load animation
    setTimeout(() => setPageLoaded(true), 100);
    
    // Check for biometric authentication
    const checkBiometric = () => {
      // In a real app, you would check for actual biometric capabilities
      setBiometricAvailable(Math.random() > 0.5); // Random for demo
    };
    
    checkBiometric();
    
    // Focus email field on load
    if (emailRef.current) {
      setTimeout(() => emailRef.current?.focus(), 300);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // iOS-style validation animation
    if (!email || !password) {
      if (!email && emailRef.current) {
        shakeAnimation(emailRef.current);
        emailRef.current.focus();
      } else if (!password && passwordRef.current) {
        shakeAnimation(passwordRef.current);
        passwordRef.current.focus();
      }
      hapticFeedback('error');
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    hapticFeedback('light');
    
    const result = await signIn(email, password);
    
    if (result.success) {
      hapticFeedback('success');
      setUser(result.user);
      
      // iOS-style success animation
      if (formRef.current) {
        formRef.current.style.transform = 'scale(0.95)';
        formRef.current.style.opacity = '0';
        formRef.current.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      }
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 300);
    } else {
      hapticFeedback('error');
      setError(result.error || 'Login failed. Please try again.');
      
      // Shake animation for error
      if (formRef.current) {
        shakeAnimation(formRef.current);
      }
    }
    
    setLoading(false);
  };

  const handleBiometricLogin = async () => {
    setBiometricLoading(true);
    hapticFeedback('medium');
    
    // Simulate biometric authentication
    setTimeout(async () => {
      if (Math.random() > 0.3) { // 70% success rate for demo
        hapticFeedback('success');
        
        // For demo, use a test account
        const result = await signIn('demo@salessynapse.com', 'demo123');
        
        if (result.success) {
          setUser(result.user);
          
          if (formRef.current) {
            formRef.current.style.transform = 'scale(0.95)';
            formRef.current.style.opacity = '0';
            formRef.current.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
          }
          
          setTimeout(() => {
            navigate('/dashboard');
          }, 300);
        }
      } else {
        hapticFeedback('error');
        setError('Biometric authentication failed. Please try again.');
      }
      
      setBiometricLoading(false);
    }, 1500);
  };

  const handleResetPassword = async () => {
    if (!resetEmail) {
      setResetError('Please enter your email address');
      hapticFeedback('error');
      return;
    }
    
    setResetLoading(true);
    setResetError('');
    hapticFeedback('light');
    
    const result = await resetPassword(resetEmail);
    
    if (result.success) {
      hapticFeedback('success');
      setResetSuccess(true);
      
      setTimeout(() => {
        setResetDialogOpen(false);
        setResetSuccess(false);
        setResetEmail('');
      }, 3000);
    } else {
      hapticFeedback('error');
      setResetError(result.error);
    }
    
    setResetLoading(false);
  };

  const handleResetDialogClose = () => {
    hapticFeedback('light');
    setResetDialogOpen(false);
    setResetEmail('');
    setResetError('');
    setResetSuccess(false);
  };

  const handleContactAdmin = () => {
    hapticFeedback('light');
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${APP_NAME} Support Request&body=Hello,%0D%0A%0D%0AI need assistance with ${APP_NAME}.%0D%0A%0D%0APlease help with:`;
  };

  const handleSocialLogin = (provider) => {
    hapticFeedback('light');
    // For demo purposes only
    alert(`${provider} login would be implemented in production`);
  };

  return (
    <>
      <Container 
        component="main" 
        maxWidth="xs"
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <CssBaseline />
        
        {/* iOS-style Dynamic Background */}
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            opacity: 0.1,
            zIndex: -1,
          }}
        />
        
        {/* Main Login Card */}
        <Fade in={pageLoaded} timeout={500}>
          <Box
            ref={formRef}
            sx={{
              width: '100%',
              maxWidth: isMobile ? '100%' : '400px',
              animation: pageLoaded ? 'slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
              '@keyframes slideUp': {
                from: { opacity: 0, transform: 'translateY(40px)' },
                to: { opacity: 1, transform: 'translateY(0)' },
              },
            }}
          >
            {/* iOS-style Header */}
            <Box
              sx={{
                textAlign: 'center',
                mb: 4,
                animation: pageLoaded ? 'fadeIn 0.8s ease-out 0.2s both' : 'none',
                '@keyframes fadeIn': {
                  from: { opacity: 0, transform: 'translateY(-20px)' },
                  to: { opacity: 1, transform: 'translateY(0)' },
                },
              }}
            >
              {/* Logo with iOS-style shine */}
              <Box
                sx={{
                  position: 'relative',
                  width: 80,
                  height: 80,
                  margin: '0 auto 20px',
                  borderRadius: iOSStyles.borderRadius.large,
                  background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 32px rgba(0, 122, 255, 0.3)',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: iOSStyles.borderRadius.large,
                    background: 'linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)',
                    opacity: 0.5,
                  },
                }}
              >
                <Business sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                  fontSize: isMobile ? '28px' : '34px',
                }}
              >
                {APP_NAME}
              </Typography>
              
              <Typography
                variant="subtitle1"
                sx={{
                  color: iOSStyles.colors.secondaryLabel,
                  fontSize: isMobile ? '15px' : '17px',
                  opacity: 0.8,
                }}
              >
                AI-Powered Sales Intelligence
              </Typography>
            </Box>

            {/* Login Card */}
            <Paper
              elevation={0}
              sx={{
                p: isMobile ? 3 : 4,
                borderRadius: iOSStyles.borderRadius.xlarge,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: `1px solid ${iOSStyles.colors.systemGray5}`,
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                animation: pageLoaded ? 'scaleIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both' : 'none',
                '@keyframes scaleIn': {
                  from: { opacity: 0, transform: 'scale(0.95)' },
                  to: { opacity: 1, transform: 'scale(1)' },
                },
              }}
            >
              {/* Login Header */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: iOSStyles.colors.label,
                    mb: 1,
                    fontSize: isMobile ? '20px' : '22px',
                  }}
                >
                  Welcome Back
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: iOSStyles.colors.secondaryLabel,
                    fontSize: isMobile ? '14px' : '15px',
                  }}
                >
                  Sign in to continue to your dashboard
                </Typography>
              </Box>

              {/* Error Alert */}
              {error && (
                <Zoom in={!!error}>
                  <Alert
                    severity="error"
                    icon={<ErrorIcon />}
                    sx={{
                      mb: 3,
                      borderRadius: iOSStyles.borderRadius.medium,
                      border: `1px solid ${iOSStyles.colors.systemRed}40`,
                      backgroundColor: `${iOSStyles.colors.systemRed}15`,
                      animation: 'shake 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      '@keyframes shake': {
                        '0%, 100%': { transform: 'translateX(0)' },
                        '25%': { transform: 'translateX(-4px)' },
                        '75%': { transform: 'translateX(4px)' },
                      },
                    }}
                    onClose={() => setError('')}
                  >
                    {error}
                  </Alert>
                </Zoom>
              )}

              {/* Biometric Login Option */}
              {biometricAvailable && (
                <Grow in={biometricAvailable}>
                  <Box sx={{ mb: 3 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleBiometricLogin}
                      disabled={biometricLoading || loading}
                      sx={{
                        py: 2,
                        borderRadius: iOSStyles.borderRadius.large,
                        backgroundColor: iOSStyles.colors.systemBackground,
                        border: `1.5px solid ${iOSStyles.colors.systemGray4}`,
                        color: iOSStyles.colors.label,
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '17px',
                        '&:hover': {
                          backgroundColor: iOSStyles.colors.systemGray6,
                          borderColor: iOSStyles.colors.systemGray3,
                        },
                        '&:active': {
                          transform: 'scale(0.98)',
                        },
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                      startIcon={
                        biometricLoading ? (
                          <CircularProgress size={20} />
                        ) : (
                          <Fingerprint sx={{ color: iOSStyles.colors.systemBlue }} />
                        )
                      }
                    >
                      {biometricLoading ? 'Authenticating...' : 'Use Face ID'}
                    </Button>
                    
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: iOSStyles.colors.tertiaryLabel,
                          display: 'block',
                          mb: 0.5,
                        }}
                      >
                        or continue with
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                    </Box>
                  </Box>
                </Grow>
              )}

              {/* Login Form */}
              <Box component="form" onSubmit={handleSubmit} noValidate>
                {/* Email Field */}
                <TextField
                  inputRef={emailRef}
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus={!isMobile}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading || biometricLoading}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: iOSStyles.colors.systemGray }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: iOSStyles.borderRadius.medium,
                      backgroundColor: iOSStyles.colors.systemGray6,
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        backgroundColor: iOSStyles.colors.systemGray5,
                      },
                      '&.Mui-focused': {
                        backgroundColor: iOSStyles.colors.systemBackground,
                        boxShadow: `0 0 0 4px ${iOSStyles.colors.systemBlue}20`,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '15px',
                      '&.Mui-focused': {
                        color: iOSStyles.colors.systemBlue,
                      },
                    },
                  }}
                />

                {/* Password Field */}
                <TextField
                  inputRef={passwordRef}
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
                  disabled={loading || biometricLoading}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: iOSStyles.colors.systemGray }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => {
                            hapticFeedback('light');
                            setShowPassword(!showPassword);
                          }}
                          edge="end"
                          sx={{ color: iOSStyles.colors.systemGray }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: iOSStyles.borderRadius.medium,
                      backgroundColor: iOSStyles.colors.systemGray6,
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        backgroundColor: iOSStyles.colors.systemGray5,
                      },
                      '&.Mui-focused': {
                        backgroundColor: iOSStyles.colors.systemBackground,
                        boxShadow: `0 0 0 4px ${iOSStyles.colors.systemBlue}20`,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '15px',
                      '&.Mui-focused': {
                        color: iOSStyles.colors.systemBlue,
                      },
                    },
                  }}
                />

                {/* Remember Me & Forgot Password */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Chip
                      label="Remember me"
                      size="small"
                      onClick={() => {
                        hapticFeedback('light');
                        setRememberMe(!rememberMe);
                      }}
                      clickable
                      color={rememberMe ? 'primary' : 'default'}
                      variant={rememberMe ? 'filled' : 'outlined'}
                      sx={{
                        fontSize: '13px',
                        fontWeight: 500,
                        '&:active': {
                          transform: 'scale(0.95)',
                        },
                        transition: 'transform 0.2s ease',
                      }}
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    onClick={() => {
                      hapticFeedback('light');
                      setResetDialogOpen(true);
                    }}
                    sx={{
                      color: iOSStyles.colors.systemBlue,
                      cursor: 'pointer',
                      fontWeight: 500,
                      fontSize: '15px',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                      '&:active': {
                        opacity: 0.7,
                      },
                    }}
                  >
                    Forgot password?
                  </Typography>
                </Box>

                {/* Sign In Button */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading || biometricLoading}
                  sx={{
                    py: 2,
                    mb: 3,
                    borderRadius: iOSStyles.borderRadius.large,
                    backgroundColor: iOSStyles.colors.systemBlue,
                    fontSize: '17px',
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: '0 4px 20px rgba(0, 122, 255, 0.3)',
                    '&:hover': {
                      backgroundColor: '#0056CC',
                      boxShadow: '0 6px 24px rgba(0, 122, 255, 0.4)',
                    },
                    '&:active': {
                      transform: 'scale(0.98)',
                      boxShadow: '0 2px 12px rgba(0, 122, 255, 0.2)',
                    },
                    '&.Mui-disabled': {
                      backgroundColor: iOSStyles.colors.systemGray4,
                      color: iOSStyles.colors.systemGray2,
                    },
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  startIcon={
                    loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <LoginIcon />
                    )
                  }
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>

                {/* Social Login Options */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      textAlign: 'center',
                      color: iOSStyles.colors.secondaryLabel,
                      mb: 2,
                      fontSize: '15px',
                    }}
                  >
                    Or sign in with
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <IconButton
                      onClick={() => handleSocialLogin('Apple')}
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: iOSStyles.borderRadius.medium,
                        backgroundColor: iOSStyles.colors.systemGray6,
                        border: `1px solid ${iOSStyles.colors.systemGray5}`,
                        '&:hover': {
                          backgroundColor: iOSStyles.colors.systemGray5,
                        },
                        '&:active': {
                          transform: 'scale(0.95)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <Apple sx={{ color: iOSStyles.colors.label }} />
                    </IconButton>
                    <IconButton
                      onClick={() => handleSocialLogin('Google')}
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: iOSStyles.borderRadius.medium,
                        backgroundColor: iOSStyles.colors.systemGray6,
                        border: `1px solid ${iOSStyles.colors.systemGray5}`,
                        '&:hover': {
                          backgroundColor: iOSStyles.colors.systemGray5,
                        },
                        '&:active': {
                          transform: 'scale(0.95)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <Google sx={{ color: iOSStyles.colors.label }} />
                    </IconButton>
                  </Box>
                </Box>

                {/* Contact Admin */}
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: iOSStyles.colors.secondaryLabel,
                      mb: 2,
                      fontSize: '15px',
                    }}
                  >
                    New to {APP_NAME}?
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={handleContactAdmin}
                    sx={{
                      borderRadius: iOSStyles.borderRadius.large,
                      borderColor: iOSStyles.colors.systemGray4,
                      color: iOSStyles.colors.label,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '15px',
                      '&:hover': {
                        borderColor: iOSStyles.colors.systemGray3,
                        backgroundColor: iOSStyles.colors.systemGray6,
                      },
                      '&:active': {
                        transform: 'scale(0.98)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                    startIcon={<Security />}
                  >
                    Request Access
                  </Button>
                </Box>
              </Box>
            </Paper>

            {/* Footer */}
            <Fade in={pageLoaded} timeout={800}>
              <Box
                sx={{
                  mt: 4,
                  textAlign: 'center',
                  animation: 'fadeIn 1s ease-out 0.5s both',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: iOSStyles.colors.tertiaryLabel,
                    display: 'block',
                    fontSize: '13px',
                  }}
                >
                  © {new Date().getFullYear()} RV Solutions
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: iOSStyles.colors.tertiaryLabel,
                    display: 'block',
                    fontSize: '13px',
                  }}
                >
                  Developed in CEO Office Lab by Harpinder Singh
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: iOSStyles.colors.tertiaryLabel,
                    display: 'block',
                    fontSize: '13px',
                  }}
                >
                  For Support: {SUPPORT_EMAIL}
                </Typography>
              </Box>
            </Fade>
          </Box>
        </Fade>
      </Container>

      {/* Password Reset Dialog - iOS Style */}
      <Dialog
        open={resetDialogOpen}
        onClose={handleResetDialogClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: iOSStyles.borderRadius.xlarge,
            margin: isMobile ? 2 : 3,
            maxWidth: isMobile ? 'calc(100% - 32px)' : '400px',
            overflow: 'hidden',
            border: `1px solid ${iOSStyles.colors.systemGray5}`,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
            animation: resetDialogOpen ? 'scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
          },
        }}
      >
        <DialogTitle sx={{ p: 3, pb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Reset Password
            </Typography>
            <IconButton
              onClick={handleResetDialogClose}
              size="small"
              sx={{
                color: iOSStyles.colors.systemGray,
                '&:active': { transform: 'scale(0.9)' },
                transition: 'transform 0.2s ease',
              }}
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 0 }}>
          {resetSuccess ? (
            <Zoom in={resetSuccess}>
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CheckCircle
                  sx={{
                    fontSize: 64,
                    color: iOSStyles.colors.systemGreen,
                    mb: 3,
                    animation: 'scaleIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Email Sent!
                </Typography>
                <Typography variant="body2" sx={{ color: iOSStyles.colors.secondaryLabel }}>
                  Password reset email sent! Please check your inbox and follow the instructions.
                </Typography>
              </Box>
            </Zoom>
          ) : (
            <>
              <Typography variant="body2" sx={{ color: iOSStyles.colors.secondaryLabel, mb: 3 }}>
                Enter your email address and we'll send you a link to reset your password.
              </Typography>

              {resetError && (
                <Slide direction="down" in={!!resetError}>
                  <Alert
                    severity="error"
                    sx={{
                      mb: 2,
                      borderRadius: iOSStyles.borderRadius.medium,
                      animation: 'shake 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    onClose={() => setResetError('')}
                  >
                    {resetError}
                  </Alert>
                </Slide>
              )}

              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                disabled={resetLoading}
                variant="outlined"
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: iOSStyles.colors.systemGray }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: iOSStyles.borderRadius.medium,
                    backgroundColor: iOSStyles.colors.systemGray6,
                    '&:hover': {
                      backgroundColor: iOSStyles.colors.systemGray5,
                    },
                    '&.Mui-focused': {
                      backgroundColor: iOSStyles.colors.systemBackground,
                      boxShadow: `0 0 0 4px ${iOSStyles.colors.systemBlue}20`,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '15px',
                    '&.Mui-focused': {
                      color: iOSStyles.colors.systemBlue,
                    },
                  },
                }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          {!resetSuccess && (
            <>
              <Button
                onClick={handleResetDialogClose}
                disabled={resetLoading}
                sx={{
                  borderRadius: iOSStyles.borderRadius.medium,
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:active': { transform: 'scale(0.98)' },
                  transition: 'transform 0.2s ease',
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleResetPassword}
                variant="contained"
                disabled={resetLoading}
                sx={{
                  borderRadius: iOSStyles.borderRadius.medium,
                  textTransform: 'none',
                  fontWeight: 600,
                  backgroundColor: iOSStyles.colors.systemBlue,
                  '&:hover': {
                    backgroundColor: '#0056CC',
                  },
                  '&:active': { transform: 'scale(0.98)' },
                  transition: 'all 0.2s ease',
                }}
                startIcon={resetLoading ? <CircularProgress size={20} /> : <Email />}
              >
                {resetLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </>
          )}
          {resetSuccess && (
            <Button
              onClick={handleResetDialogClose}
              variant="contained"
              fullWidth
              sx={{
                borderRadius: iOSStyles.borderRadius.medium,
                textTransform: 'none',
                fontWeight: 600,
                backgroundColor: iOSStyles.colors.systemBlue,
                '&:active': { transform: 'scale(0.98)' },
                transition: 'transform 0.2s ease',
              }}
            >
              Close
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* iOS-style Loading Overlay */}
      {(loading || biometricLoading) && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            animation: 'fadeIn 0.3s ease-out',
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress
              size={60}
              thickness={4}
              sx={{
                color: iOSStyles.colors.systemBlue,
                mb: 3,
                animation: 'spin 1s linear infinite',
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: iOSStyles.colors.label,
                mb: 1,
              }}
            >
              {biometricLoading ? 'Authenticating...' : 'Signing in...'}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: iOSStyles.colors.secondaryLabel,
                fontSize: '15px',
              }}
            >
              {biometricLoading
                ? 'Please use Face ID or Touch ID'
                : 'Please wait a moment'}
            </Typography>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Login;