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
} from "@mui/icons-material";

const Login = () => {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

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
      <Container component="main" maxWidth="xs">
        <CssBaseline />

        <Box
          sx={{
            marginTop: 8,

            display: "flex",

            flexDirection: "column",

            alignItems: "center",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,

              width: "100%",

              borderRadius: 2,

              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Avatar
                sx={{
                  m: 1,

                  bgcolor: "white",

                  width: 80,

                  height: 80,

                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
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
                      '<Business sx={{ fontSize: 40, color: "primary.main" }} />';
                  }}
                />
              </Avatar>

              <Typography
                component="h1"
                variant="h4"
                sx={{ mt: 2, fontWeight: 700 }}
              >
                {APP_NAME}
              </Typography>

              <Typography
                variant="subtitle1"
                color="text.secondary"
                align="center"
                sx={{ mt: 1 }}
              >
                AI-Powered Sales Intelligence Platform
              </Typography>
            </Box>

            <Typography
              component="h2"
              variant="h6"
              align="center"
              color="primary"
              gutterBottom
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <LoginIcon />
                Sign in to your account
              </Box>
            </Typography>

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,

                  borderRadius: 1,

                  "& .MuiAlert-icon": {
                    alignItems: "center",
                  },
                }}
              >
                {error}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
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
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1,
                  },
                }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1,
                  },
                }}
              />

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

                  borderRadius: 1,

                  fontSize: "1rem",

                  fontWeight: 600,

                  textTransform: "none",

                  boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",

                  "&:hover": {
                    boxShadow: "0 6px 16px rgba(25, 118, 210, 0.4)",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Sign In"
                )}
              </Button>
            </Box>

            <Box sx={{ mt: 3, pt: 3, borderTop: 1, borderColor: "divider" }}>
              <Typography variant="body2" color="text.secondary" align="center">
                Forgot your password?{" "}
                <Box
                  component="span"
                  onClick={() => setResetDialogOpen(true)}
                  sx={{
                    color: "#1976d2",

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
                    color: "#1976d2",

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

            <Box
              sx={{
                mt: 4,
                pt: 3,
                borderTop: 1,
                borderColor: "divider",
                textAlign: "center",
              }}
            >
              <Typography variant="caption" color="text.secondary">
                © {new Date().getFullYear()} RV Solutions
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                Developed in CEO Office Lab by Harpinder Singh
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                For Support: {SUPPORT_EMAIL}
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Container>

      {/* Password Reset Dialog */}

      <Dialog
        open={resetDialogOpen}
        onClose={handleResetDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Reset Password</Typography>

            <IconButton onClick={handleResetDialogClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          {resetSuccess ? (
            <Alert severity="success" sx={{ my: 2 }}>
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
                <Alert severity="error" sx={{ mb: 2 }}>
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
                    borderRadius: 1,
                  },
                }}
                autoFocus
              />
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
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