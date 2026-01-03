import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  Button,
  Alert,
  IconButton,
  Divider,
  Chip,
} from '@mui/material';
import {
  MeetingRoom,
  Assignment,
  TrendingUp,
  AttachMoney,
  Refresh,
  ArrowForward,
  CalendarToday,
  CheckCircle,
  PendingActions,
  AddCircle,
  ListAlt,
  Assessment,
} from '@mui/icons-material';
import { getSalesDashboardStats } from '../../services/dashboardService';
import { useAuth } from '../../context/AuthContext';
import AIInsights from '../AI/AIInsights';
import useHaptic from '../../hooks/useHaptic';

const StatsCard = ({ title, value, icon, color, gradient, delay = 0 }) => {
  const { impactLight } = useHaptic();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay,
        duration: 0.4,
        type: 'spring',
        stiffness: 200,
        damping: 20,
      }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={impactLight}
    >
      <Card
        sx={{
          height: '100%',
          minHeight: '180px',  // ← Increased from 160px
          background: gradient,
          color: 'white',
          borderRadius: 3,
          border: 'none',
          boxShadow: `0 4px 12px ${color}40`,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            boxShadow: `0 8px 24px ${color}60`,
          },
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '180px',  // ← Increased from 150px
            height: '180px',
            opacity: 0.1,
            transform: 'translate(30%, -30%)',
          }}
        >
          {React.cloneElement(icon, { sx: { fontSize: 180 } })}  {/* ← Increased from 150 */}
        </Box>

        <CardContent sx={{ position: 'relative', zIndex: 1, p: 3.5 }}>  {/* ← Increased padding */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2.5 }}>  {/* ← More margin */}
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {React.cloneElement(icon, { sx: { fontSize: 32 } })}  {/* ← Increased from 28 */}
            </Box>
          </Box>

          <Typography
            variant="body2"
            sx={{
              opacity: 0.9,
              fontWeight: 500,
              mb: 1.5,
              fontSize: '15px',  // ← Increased from 14px
              letterSpacing: '0.5px',
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '32px', sm: '36px', md: '40px' },  // ← Increased sizes
              lineHeight: 1.2,
            }}
          >
            {value}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// iOS-style Action Button Component
const ActionButton = ({ icon, label, href, primary = false, delay = 0 }) => {
  const { impactMedium } = useHaptic();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button
        variant={primary ? 'contained' : 'outlined'}
        href={href}
        fullWidth
        size="large"
        onClick={impactMedium}
        endIcon={<ArrowForward />}
        sx={{
          py: 1.5,
          borderRadius: 2,
          fontSize: '16px',
          fontWeight: 600,
          textTransform: 'none',
          ...(primary && {
            background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
            boxShadow: '0 4px 12px rgba(0, 122, 255, 0.4)',
            border: 'none',
            '&:hover': {
              background: 'linear-gradient(135deg, #0051D5 0%, #007AFF 100%)',
              boxShadow: '0 6px 16px rgba(0, 122, 255, 0.5)',
            },
          }),
          ...(!primary && {
            borderWidth: 1.5,
            '&:hover': {
              borderWidth: 1.5,
              bgcolor: 'rgba(0, 122, 255, 0.05)',
            },
          }),
        }}
        startIcon={icon}
      >
        {label}
      </Button>
    </motion.div>
  );
};

const SalesDashboard = () => {
  const { user, userData } = useAuth();
  const { impactLight } = useHaptic();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Indian Rupee formatter
  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  useEffect(() => {
    if (user) {
      fetchDashboardStats();
    }
  }, [user]);

  const fetchDashboardStats = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const result = await getSalesDashboardStats(user.uid, userData?.role || 'sales');

    if (result.success) {
      setStats(result.stats);
    } else {
      setError(result.error || 'Failed to load dashboard data');
    }

    setLoading(false);
  };

  const refreshDashboard = () => {
    impactLight();
    fetchDashboardStats();
  };

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <CircularProgress size={60} thickness={4} />
          <Typography sx={{ mt: 3, color: 'text.secondary', fontWeight: 500 }}>
            Loading dashboard data...
          </Typography>
        </motion.div>
      </Box>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Alert
          severity="error"
          sx={{
            mt: 2,
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(255, 59, 48, 0.2)',
          }}
          action={
            <Button color="inherit" size="small" onClick={refreshDashboard}>
              RETRY
            </Button>
          }
        >
          {error}
        </Alert>
      </motion.div>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>  {/* ← Simplified */}
      {/* Header with Refresh */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 0.5,
              }}
            >
              Welcome Back! 👋
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Here's what's happening with your sales today
            </Typography>
          </Box>

          <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
            <IconButton
              onClick={refreshDashboard}
              sx={{
                bgcolor: 'background.paper',
                boxShadow: 1,
                '&:hover': { bgcolor: 'primary.main', color: 'white' },
              }}
            >
              <Refresh />
            </IconButton>
          </motion.div>
        </Box>
      </motion.div>

      {/* Stats Cards - Full Width with Better Spacing */}
      <Grid 
        container 
        spacing={3}  // ← Increased spacing
        sx={{ mb: 4 }}
      >
        <Grid item xs={12} sm={6} md={6} lg={3}>  {/* ← CHANGED md to 6 */}
          <StatsCard
            title="Meetings This Week"
            value={stats?.totalMeetingsThisWeek || 0}
            icon={<MeetingRoom />}
            color="#007AFF"
            gradient="linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)"
            delay={0}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={3}>  {/* ← CHANGED md to 6 */}
          <StatsCard
            title="Pending Actions"
            value={stats?.totalActionsPending || 0}
            icon={<Assignment />}
            color="#FF3B30"
            gradient="linear-gradient(135deg, #FF3B30 0%, #FF6B6B 100%)"
            delay={0.1}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={3}>  {/* ← CHANGED md to 6 */}
          <StatsCard
            title="Total Visits"
            value={stats?.totalVisits || 0}
            icon={<TrendingUp />}
            color="#34C759"
            gradient="linear-gradient(135deg, #34C759 0%, #66D77C 100%)"
            delay={0.2}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={3}>  {/* ← CHANGED md to 6 */}
          <StatsCard
            title="Total Expenses"
            value={formatINR(stats?.totalExpenses || 0)}
            icon={<AttachMoney />}
            color="#FF9500"
            gradient="linear-gradient(135deg, #FF9500 0%, #FFAA33 100%)"
            delay={0.3}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Activities Card */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                height: '100%',
                border: 1,
                borderColor: 'divider',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                  }}
                >
                  <CalendarToday sx={{ color: 'white', fontSize: 20 }} />
                </Box>
                <Typography variant="h6" fontWeight={600}>
                  Recent Activities
                </Typography>
              </Box>

              {stats?.totalVisits > 0 ? (
                <Box>
                  {/* Activity Items */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'rgba(52, 199, 89, 0.1)',
                        mb: 2,
                      }}
                    >
                      <CheckCircle sx={{ color: 'success.main', mr: 2 }} />
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {stats.totalVisits} Visits Completed
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Keep up the great work!
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'rgba(255, 59, 48, 0.1)',
                        mb: 2,
                      }}
                    >
                      <PendingActions sx={{ color: 'error.main', mr: 2 }} />
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {stats.totalActionsPending} Pending Actions
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Need your attention
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'rgba(255, 149, 0, 0.1)',
                      }}
                    >
                      <AttachMoney sx={{ color: 'warning.main', mr: 2 }} />
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          Total Expenses: {formatINR(stats.totalExpenses || 0)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Track your spending
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>

                  {/* AI Insights Section */}
                  {stats.recentVisit && (
                    <Box sx={{ mt: 3, pt: 3, borderTop: 1, borderColor: 'divider' }}>
                      <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                        AI Insights for Your Latest Visit
                      </Typography>
                      <AIInsights
                        visitData={stats.recentVisit}
                        userRole="sales"
                        showTitle={false}
                      />
                    </Box>
                  )}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    No visits recorded yet. Start by submitting your first visit!
                  </Typography>
                  <Chip
                    label="Get Started"
                    color="primary"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
              )}
            </Paper>
          </motion.div>
        </Grid>

        {/* Quick Actions Card */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                height: '100%',
                border: 1,
                borderColor: 'divider',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #FF9500 0%, #FFAA33 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                  }}
                >
                  <TrendingUp sx={{ color: 'white', fontSize: 20 }} />
                </Box>
                <Typography variant="h6" fontWeight={600}>
                  Quick Actions
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <ActionButton
                  icon={<AddCircle />}
                  label="Submit New Visit"
                  href="/new-visit"
                  primary
                  delay={0.5}
                />
                <ActionButton
                  icon={<ListAlt />}
                  label="View All Visits"
                  href="/visits"
                  delay={0.6}
                />
                <ActionButton
                  icon={<Assessment />}
                  label="Generate Reports"
                  href="/visits"
                  delay={0.7}
                />
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Tips Section */}
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'rgba(0, 122, 255, 0.05)',
                  border: 1,
                  borderColor: 'primary.light',
                }}
              >
                <Typography variant="subtitle2" fontWeight={600} color="primary.main" gutterBottom>
                  💡 Pro Tip
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Submit visits right after meetings to capture fresh insights and improve AI analysis accuracy.
                </Typography>
              </Box>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SalesDashboard;
