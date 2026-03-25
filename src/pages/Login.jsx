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
  CssBaseline,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { signIn, resetPassword } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { APP_NAME, SUPPORT_EMAIL } from "../utils/constants";
import {
  Business,
  Close,
  Email,
  Visibility,
  VisibilityOff,
  ArrowForward,
  Lock,
  TrendingUp,
  Assignment,
  Analytics,
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
          height: "100vh",
          width: "100vw",
          bgcolor: "#F2F2F7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg" sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 6,
              overflow: "hidden",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.5)",
              animation: "slideUp 0.5s cubic-bezier(0.2, 0.9, 0.3, 1)",
              width: "100%",
              maxHeight: "90vh",
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
            <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, height: "100%" }}>
              {/* Left Side - Login Form */}
              <Box sx={{ flex: 1, p: { xs: 3, lg: 5 }, overflowY: "auto", maxHeight: "90vh" }}>
                {/* Logo */}
                <Box sx={{ mb: 3 }}>
                  <img
                    src="/logo.png"
                    alt={`${APP_NAME} Logo`}
                    style={{
                      width: "70px",
                      height: "70px",
                      objectFit: "contain",
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = "none";
                      const parent = e.target.parentElement;
                      if (parent) {
                        parent.innerHTML = '<svg width="70" height="70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 9L12 3L21 9L12 15L3 9Z" stroke="#007AFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 12V18L12 22L19 18V12" stroke="#007AFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                      }
                    }}
                  />
                </Box>

                {/* Welcome Text */}
                <Typography
                  variant="h4"
                  sx={{
                    fontSize: { xs: "1.75rem", lg: "2rem" },
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    color: "#1C1C1E",
                    mb: 0.5,
                  }}
                >
                  Welcome Back
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: "0.875rem", lg: "1rem" },
                    color: "#8E8E93",
                    mb: 3,
                  }}
                >
                  Sign in to continue to {APP_NAME}
                </Typography>

                {/* Error Alert */}
                {error && (
                  <Alert
                    severity="error"
                    sx={{
                      mb: 2,
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
                  <Box sx={{ mb: 2.5 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        color: "#8E8E93",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        mb: 0.5,
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
                            <Email sx={{ color: "#8E8E93", fontSize: 18 }} />
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
                          py: 1.5,
                          fontSize: "0.95rem",
                        },
                      }}
                    />
                  </Box>

                  {/* Password Field */}
                  <Box sx={{ mb: 2.5 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        color: "#8E8E93",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        mb: 0.5,
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
                            <Lock sx={{ color: "#8E8E93", fontSize: 18 }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              sx={{ color: "#8E8E93" }}
                              size="small"
                            >
                              {showPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
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
                          py: 1.5,
                          fontSize: "0.95rem",
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
                      py: 1.5,
                      borderRadius: 2,
                      fontSize: "0.95rem",
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
                      <CircularProgress size={22} color="inherit" />
                    ) : (
                      <>
                        <ArrowForward sx={{ mr: 1, fontSize: 18 }} />
                        Sign In
                      </>
                    )}
                  </Button>
                </Box>

                {/* Footer Links */}
                <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: "divider" }}>
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ fontSize: "0.8rem" }}>
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
                    sx={{ mt: 1, fontSize: "0.8rem" }}
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
                <Box sx={{ mt: 3, pt: 2, textAlign: "center" }}>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: "0.7rem" }}>
                    © {new Date().getFullYear()} RV Solutions
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: "0.7rem" }}>
                    Developed by Harpinder Singh
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: "0.7rem" }}>
                    For Support: {SUPPORT_EMAIL}
                  </Typography>
                </Box>
              </Box>

              {/* Right Side - Animated Illustration */}
              <Box
                sx={{
                  display: { xs: "none", lg: "flex" },
                  flex: 1,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  p: 4,
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Animated Background Circles */}
                <Box
                  sx={{
                    position: "absolute",
                    width: "200%",
                    height: "200%",
                    background: "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
                    backgroundSize: "50px 50px",
                    animation: "moveBackground 20s linear infinite",
                    "@keyframes moveBackground": {
                      "0%": {
                        transform: "translate(0, 0)",
                      },
                      "100%": {
                        transform: "translate(50px, 50px)",
                      },
                    },
                  }}
                />
                
                <Box sx={{ textAlign: "center", color: "white", position: "relative", zIndex: 1 }}>
                  {/* Animated Icon */}
                  <Box
                    sx={{
                      animation: "float 3s ease-in-out infinite",
                      "@keyframes float": {
                        "0%": {
                          transform: "translateY(0px)",
                        },
                        "50%": {
                          transform: "translateY(-15px)",
                        },
                        "100%": {
                          transform: "translateY(0px)",
                        },
                      },
                    }}
                  >
                    <Business sx={{ fontSize: 80, mb: 2, filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.2))" }} />
                  </Box>
              
                  {/* Animated Text */}
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      mb: 1.5,
                      fontSize: "1.5rem",
                      animation: "fadeInUp 0.8s ease-out",
                      "@keyframes fadeInUp": {
                        "0%": {
                          opacity: 0,
                          transform: "translateY(30px)",
                        },
                        "100%": {
                          opacity: 1,
                          transform: "translateY(0)",
                        },
                      },
                    }}
                  >
                    AI-Powered Sales Intelligence
                  </Typography>
              
                  <Typography
                    variant="body2"
                    sx={{
                      opacity: 0.9,
                      mb: 3,
                      fontSize: "0.85rem",
                      animation: "fadeInUp 0.8s ease-out 0.2s backwards",
                    }}
                  >
                    Transform your sales workflow with intelligent insights
                  </Typography>
              
                  {/* Animated Feature Cards */}
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 2 }}>
                    {[
                      { icon: TrendingUp, text: "Smart Sales Analytics", delay: 0 },
                      { icon: Assignment, text: "Automated Visit Reports", delay: 0.1 },
                      { icon: Analytics, text: "Real-time Pipeline Tracking", delay: 0.2 },
                    ].map((feature, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          bgcolor: "rgba(255,255,255,0.1)",
                          backdropFilter: "blur(10px)",
                          borderRadius: 2,
                          p: 1.5,
                          transition: "all 0.3s ease",
                          animation: `slideInRight 0.5s ease-out ${feature.delay}s backwards`,
                          "@keyframes slideInRight": {
                            "0%": {
                              opacity: 0,
                              transform: "translateX(-30px)",
                            },
                            "100%": {
                              opacity: 1,
                              transform: "translateX(0)",
                            },
                          },
                          "&:hover": {
                            transform: "translateX(8px)",
                            bgcolor: "rgba(255,255,255,0.2)",
                          },
                        }}
                      >
                        <feature.icon sx={{ fontSize: 22 }} />
                        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: "0.85rem" }}>
                          {feature.text}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
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
              Password reset email sent! Please check your inbox and follow the instructions.
            </Alert>
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
                startIcon={resetLoading ? <CircularProgress size={20} /> : <Email />}
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
            <Button onClick={handleResetDialogClose} variant="contained" fullWidth sx={{ borderRadius: 2 }}>
              Close
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Login;
