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
  Alert,
  IconButton,
  Avatar,
  Chip,
  LinearProgress,
  Divider,
  Button,
} from '@mui/material';
import {
  People,
  Assignment,
  TrendingUp,
  AttachMoney,
  Refresh,
  Star,
  CheckCircle,
  Schedule,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { getManagerDashboardStats } from '../../services/dashboardService';
import { useAuth } from '../../context/AuthContext';
import useHaptic from '../../hooks/useHaptic';

// iOS Color Palette for Charts
const CHART_COLORS = ['#007AFF', '#34C759', '#FF9500', '#FF3B30', '#AF52DE', '#FF2D55'];

// iOS-style Stats Card
const ManagerStatsCard = ({ title, value, icon, color, gradient, trend, delay = 0 }) => {
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
          borderRadius: 3,
          border: 1,
          borderColor: 'divider',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        {/* Gradient Top Border */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: gradient,
          }}
        />

        <CardContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: 2,
                background: gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {React.cloneElement(icon, { sx: { fontSize: 26, color: 'white' } })}
            </Box>

            {trend && (
              <Chip
                icon={trend > 0 ? <ArrowUpward /> : <ArrowDownward />}
                label={`${Math.abs(trend)}%`}
                size="small"
                sx={{
                  bgcolor: trend > 0 ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 59, 48, 0.1)',
                  color: trend > 0 ? 'success.main' : 'error.main',
                  fontWeight: 600,
                }}
              />
            )}
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
            {title}
          </Typography>

          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {value}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// iOS-style Team Member Card
const TeamMemberCard = ({ member, index }) => {
  const { impactLight } = useHaptic();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
      whileHover={{ x: 4 }}
    >
      <Box
        onClick={impactLight}
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 2,
          borderRadius: 2,
          bgcolor: 'background.paper',
          border: 1,
          borderColor: 'divider',
          mb: 2,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            bgcolor: 'action.hover',
            borderColor: 'primary.main',
          },
        }}
      >
        <Avatar
          sx={{
            width: 48,
            height: 48,
            bgcolor: 'primary.main',
            mr: 2,
            fontWeight: 600,
          }}
        >
          {member.name?.charAt(0) || 'U'}
        </Avatar>

        <Box sx={{ flex: 1 }}>
          <Typography variant="body1" fontWeight={600}>
            {member.name || 'Team Member'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {member.email}
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'right' }}>
          <Chip
            icon={<CheckCircle />}
            label={`${member.visits || 0} visits`}
            size="small"
            color="primary"
            sx={{ fontWeight: 600 }}
          />
        </Box>
      </Box>
    </motion.div>
  );
};

const ManagerDashboard = () => {
  const { user } = useAuth();
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

    const result = await getManagerDashboardStats();

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
            Loading team dashboard...
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

  // Prepare chart data
  const visitsByRepData = stats?.visitsByRep?.map((rep) => ({
    name: rep.repName || 'Unknown',
    visits: rep.count || 0,
  })) || [];

  const visitStatusData = [
    { name: 'Completed', value: stats?.totalVisits || 0, color: '#34C759' },
    { name: 'Pending Actions', value: stats?.totalActionsPending || 0, color: '#FF9500' },
  ];

  return (
    <Box>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              Team Performance 📊
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Monitor your team's activities and progress
            </Typography>
          </Box>

          <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
            <IconButton
              onClick={refreshDashboard}
              sx={{
                bgcolor: 'background.paper',
                boxShadow: 1,
                border: 1,
                borderColor: 'divider',
                '&:hover': { bgcolor: 'primary.main', color: 'white' },
              }}
            >
              <Refresh />
            </IconButton>
          </motion.div>
        </Box>
      </motion.div>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <ManagerStatsCard
            title="Team Members"
            value={stats?.totalReps || 0}
            icon={<People />}
            color="#007AFF"
            gradient="linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)"
            trend={5}
            delay={0}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ManagerStatsCard
            title="Total Visits"
            value={stats?.totalVisits || 0}
            icon={<TrendingUp />}
            color="#34C759"
            gradient="linear-gradient(135deg, #34C759 0%, #66D77C 100%)"
            trend={12}
            delay={0.1}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ManagerStatsCard
            title="Pending Actions"
            value={stats?.totalActionsPending || 0}
            icon={<Assignment />}
            color="#FF9500"
            gradient="linear-gradient(135deg, #FF9500 0%, #FFAA33 100%)"
            trend={-3}
            delay={0.2}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ManagerStatsCard
            title="Team Expenses"
            value={formatINR(stats?.totalExpenses || 0)}
            icon={<AttachMoney />}
            color="#FF3B30"
            gradient="linear-gradient(135deg, #FF3B30 0%, #FF6B6B 100%)"
            trend={8}
            delay={0.3}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Visits by Rep Chart */}
        <Grid item xs={12} lg={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                border: 1,
                borderColor: 'divider',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                height: '100%',
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
                  <TrendingUp sx={{ color: 'white', fontSize: 20 }} />
                </Box>
                <Typography variant="h6" fontWeight={600}>
                  Visits by Sales Rep
                </Typography>
              </Box>

              {visitsByRepData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={visitsByRepData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E5EA" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: '#8E8E93', fontSize: 12 }}
                      axisLine={{ stroke: '#E5E5EA' }}
                    />
                    <YAxis
                      tick={{ fill: '#8E8E93', fontSize: 12 }}
                      axisLine={{ stroke: '#E5E5EA' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #E5E5EA',
                        borderRadius: 8,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    <Bar dataKey="visits" radius={[8, 8, 0, 0]}>
                      {visitsByRepData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    No visit data available yet
                  </Typography>
                </Box>
              )}
            </Paper>
          </motion.div>
        </Grid>

        {/* Visit Status Pie Chart */}
        <Grid item xs={12} lg={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                border: 1,
                borderColor: 'divider',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                height: '100%',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #34C759 0%, #66D77C 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                  }}
                >
                  <CheckCircle sx={{ color: 'white', fontSize: 20 }} />
                </Box>
                <Typography variant="h6" fontWeight={600}>
                  Visit Status
                </Typography>
              </Box>

              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={visitStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {visitStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #E5E5EA',
                      borderRadius: 8,
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    wrapperStyle={{ fontSize: 14 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </motion.div>
        </Grid>

        {/* Team Members List */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
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
                    background: 'linear-gradient(135deg, #AF52DE 0%, #C77BE8 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                  }}
                >
                  <People sx={{ color: 'white', fontSize: 20 }} />
                </Box>
                <Typography variant="h6" fontWeight={600}>
                  Team Members
                </Typography>
                <Chip
                  label={`${stats?.totalReps || 0} members`}
                  size="small"
                  sx={{ ml: 2, fontWeight: 600 }}
                />
              </Box>

              <Grid container spacing={2}>
                {stats?.visitsByRep && stats.visitsByRep.length > 0 ? (
                  stats.visitsByRep.map((member, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <TeamMemberCard member={member} index={index} />
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        No team members found
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ManagerDashboard;
