import React, { useState } from "react";
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
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { signIn, resetPassword } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { APP_NAME, SUPPORT_EMAIL } from "../utils/constants";
import {
  Business,
  Login as LoginIcon,
  Close,
  Email,
  Visibility,
  VisibilityOff,
  ArrowForward,
  Lock,
} from "@mui/icons-material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState("");

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn(email, password);

    if (result.success) {
      setUser(result.user);
      navigate("/dashboard");
    } else {
      setError(result.error || "Login failed. Please try again.");
    }

    setLoading(false);
  };

  const handleResetPassword = async () => {
    if (!resetEmail) {
      setResetError("Please enter your email address");
      return;
    }

    setResetLoading(true);
    setResetError("");

    const result = await resetPassword(resetEmail);

    if (result.success) {
      setResetSuccess(true);
      setTimeout(() => {
        setResetDialogOpen(false);
        setResetSuccess(false);
        setResetEmail("");
      }, 3000);
    } else {
      setResetError(result.error);
    }

    setResetLoading(false);
  };

  const handleResetDialogClose = () => {
    setResetDialogOpen(false);
    setResetEmail("");
    setResetError("");
    setResetSuccess(false);
  };

  const handleContactAdmin = () => {
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${APP_NAME} Support Request&body=Hello Harpinder,%0D%0A%0D%0AI need assistance with ${APP_NAME}.%0D%0A%0D%0APlease help with:`;
  };

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#F2F2F7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Container maxWidth="lg" disableGutters>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 6,
              overflow: "hidden",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.5)",
              animation: "slideUp 0.5s cubic-bezier(0.2, 0.9, 0.3, 1)",
              "@keyframes slideUp": {
                from: {
                  opacity: 0,
                  transform: "translateY(20px)",
                },
                to: {
                  opacity: 1,
                  transform: "translateY(0)",
                },
              },
            }}
          >
            <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" } }}>
              {/* Left Side - Login Form */}
              <Box sx={{ flex: 1, p: { xs: 3, lg: 6 } }}>
                {/* Logo */}
                <Box sx={{ mb: 4 }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: "white",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    }}
                  >
                    <img
                      src="/logo.png"
                      alt={`${APP_NAME} Logo`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = "none";
                        e.target.parentElement.innerHTML =
                          '<Business sx={{ fontSize: 40, color: "#007AFF" }} />';
                      }}
                    />
                  </Avatar>
                </Box>

                {/* Welcome Text */}
                <Typography
                  variant="h3"
                  sx={{
                    fontSize: { xs: "2rem", lg: "2.5rem" },
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    color: "#1C1C1E",
                    mb: 1,
                  }}
                >
                  Sales Synapse Pro
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: "1rem", lg: "1.125rem" },
                    color: "#8E8E93",
                    mb: 4,
                  }}
                >
                  AI-Powered Sales Intelligence Platform
                </Typography>

                {/* Error Alert */}
                {error && (
                  <Alert
                    severity="error"
                    sx={{
                      mb: 3,
                      borderRadius: 2,
                      "& .MuiAlert-icon": {
                        alignItems: "center",
                      },
                    }}
                  >
                    {error}
                  </Alert>
                )}

                {/* Login Form */}
                <Box component="form" onSubmit={handleSubmit} noValidate>
                  {/* Email Field */}
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#8E8E93",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        mb: 1,
                        display: "block",
                      }}
                    >
                      Email Address
                    </Typography>
                    <TextField
                      fullWidth
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      required
                      disabled={loading}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email sx={{ color: "#8E8E93", fontSize: 20 }} />
                          </InputAdornment>
                        ),
                        sx: {
                          bgcolor: "#F9F9FB",
                          borderRadius: 2,
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(60, 60, 67, 0.08)",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(60, 60, 67, 0.2)",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#007AFF",
                            borderWidth: 1,
                          },
                          "&.Mui-focused": {
                            bgcolor: "white",
                            boxShadow: "0 0 0 4px rgba(0, 122, 255, 0.1)",
                          },
                        },
                      }}
                      sx={{
                        "& .MuiInputBase-input": {
                          py: 1.75,
                          fontSize: "1rem",
                        },
                      }}
                    />
                  </Box>

                  {/* Password Field */}
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#8E8E93",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        mb: 1,
                        display: "block",
                      }}
                    >
                      Password
                    </Typography>
                    <TextField
                      fullWidth
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      disabled={loading}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock sx={{ color: "#8E8E93", fontSize: 20 }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              sx={{ color: "#8E8E93" }}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                        sx: {
                          bgcolor: "#F9F9FB",
                          borderRadius: 2,
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(60, 60, 67, 0.08)",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(60, 60, 67, 0.2)",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#007AFF",
                            borderWidth: 1,
                          },
                          "&.Mui-focused": {
                            bgcolor: "white",
                            boxShadow: "0 0 0 4px rgba(0, 122, 255, 0.1)",
                          },
                        },
                      }}
                      sx={{
                        "& .MuiInputBase-input": {
                          py: 1.75,
                          fontSize: "1rem",
                        },
                      }}
                    />
                  </Box>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    fullWidth
                    disabled={loading}
                    variant="contained"
                    sx={{
                      bgcolor: "#007AFF",
                      "&:hover": {
                        bgcolor: "#0051D5",
                      },
                      py: 1.75,
                      borderRadius: 2,
                      fontSize: "1rem",
                      fontWeight: 600,
                      textTransform: "none",
                      boxShadow: "0 4px 12px rgba(0, 122, 255, 0.3)",
                      "&:hover": {
                        boxShadow: "0 6px 16px rgba(0, 122, 255, 0.4)",
                        transform: "translateY(-1px)",
                      },
                      transition: "all 0.2s",
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      <>
                        <ArrowForward sx={{ mr: 1, fontSize: 20 }} />
                        Sign In
                      </>
                    )}
                  </Button>
                </Box>

                {/* Footer Links */}
                <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: "divider" }}>
                  <Typography variant="body2" color="text.secondary" align="center">
                    Forgot your password?{" "}
                    <Box
                      component="span"
                      onClick={() => setResetDialogOpen(true)}
                      sx={{
                        color: "#007AFF",
                        cursor: "pointer",
                        fontWeight: 500,
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      Reset here
                    </Box>
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                    sx={{ mt: 1 }}
                  >
                    New to {APP_NAME}?{" "}
                    <Box
                      component="span"
                      onClick={handleContactAdmin}
                      sx={{
                        color: "#007AFF",
                        cursor: "pointer",
                        fontWeight: 500,
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      Contact administrator
                    </Box>
                  </Typography>
                </Box>

                {/* Copyright */}
                <Box sx={{ mt: 4, pt: 3, textAlign: "center" }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    © {new Date().getFullYear()} RV Solutions
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Developed in CEO Office Lab by Harpinder Singh
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    For Support: {SUPPORT_EMAIL}
                  </Typography>
                </Box>
              </Box>

              {/* Right Side - Illustration (Hidden on mobile) */}
              <Box
                sx={{
                  display: { xs: "none", lg: "flex" },
                  flex: 1,
                  bgcolor: "transparent",
                  p: 6,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src="/login-illustration.png"
                  alt="Login Illustration"
                  style={{
                    maxHeight: "450px",
                    width: "auto",
                    maxWidth: "100%",
                    objectFit: "contain",
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                    // Fallback if image doesn't exist - show a decorative element
                    const parent = e.target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div style="text-align: center;">
                          <div style="font-size: 8rem;">🚀</div>
                          <div style="color: #8E8E93; margin-top: 1rem;">AI-Powered Sales Intelligence</div>
                        </div>
                      `;
                    }
                  }}
                />
              </Box>
            </Box>
          </Paper>
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
            borderRadius: 4,
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Reset Password
            </Typography>
            <IconButton onClick={handleResetDialogClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          {resetSuccess ? (
            <Alert severity="success" sx={{ my: 2, borderRadius: 2 }}>
              Password reset email sent! Please check your inbox and follow the
              instructions.
            </Alert>
          ) : (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Enter your email address and we'll send you a link to reset your
                password.
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
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
                autoFocus
              />
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 0 }}>
          {!resetSuccess && (
            <>
              <Button onClick={handleResetDialogClose} disabled={resetLoading}>
                Cancel
              </Button>

              <Button
                onClick={handleResetPassword}
                variant="contained"
                disabled={resetLoading}
                startIcon={
                  resetLoading ? <CircularProgress size={20} /> : <Email />
                }
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                }}
              >
                {resetLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </>
          )}

          {resetSuccess && (
            <Button
              onClick={handleResetDialogClose}
              variant="contained"
              fullWidth
              sx={{ borderRadius: 2 }}
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
