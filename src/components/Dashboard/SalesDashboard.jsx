import React, { useEffect, useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  Button,
  Alert
} from '@mui/material';
import {
  MeetingRoom,
  Assignment,
  TrendingUp,
  AttachMoney
} from '@mui/icons-material';
import { getSalesDashboardStats } from '../../services/dashboardService';
import { useAuth } from '../../context/AuthContext';
import AIInsights from '../AI/AIInsights'; // Added AI Insights component
const StatsCard = ({ title, value, icon, color }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box sx={{ color, mr: 2 }}>
          {icon}
        </Box>
        <Typography variant="h6" color="textSecondary">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4">
        {value}
      </Typography>
    </CardContent>
  </Card>
);
const SalesDashboard = () => {
  const { user, userData } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Indian Rupee formatter
  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
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

    console.log('Fetching dashboard for user:', user.uid, 'role:', userData?.role);
    setLoading(true);
    setError(null);

    const result = await getSalesDashboardStats(user.uid, userData?.role || 'sales');
    console.log('Dashboard fetch result:', result);

    if (result.success) {
      setStats(result.stats);
    } else {
      setError(result.error || 'Failed to load dashboard data');
    }

    setLoading(false);
  };
  const refreshDashboard = () => {
    fetchDashboardStats();
  };
  if (loading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading dashboard data...</Typography>
      </Box>
    );
  }
  if (error) {
    return (
      <Alert 
        severity="error" 
        sx={{ mt: 2 }}
        action={
          <Button color="inherit" size="small" onClick={refreshDashboard}>
            RETRY
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Sales Dashboard
        </Typography>
        <Button 
          variant="outlined" 
          onClick={refreshDashboard}
          size="small"
        >
          Refresh
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Meetings This Week"
            value={stats?.totalMeetingsThisWeek || 0}
            icon={<MeetingRoom fontSize="large" />}
            color="#3f51b5"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Pending Actions"
            value={stats?.totalActionsPending || 0}
            icon={<Assignment fontSize="large" />}
            color="#f44336"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Visits"
            value={stats?.totalVisits || 0}
            icon={<TrendingUp fontSize="large" />}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Expenses"
            value={formatINR(stats?.totalExpenses || 0)}
            icon={<AttachMoney fontSize="large" />}
            color="#ff9800"
          />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Recent Activities
            </Typography>
            {stats?.totalVisits > 0 ? (
              <Box>
                <Typography variant="body2" color="textSecondary">
                  You have completed {stats.totalVisits} visits.
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  {stats.totalActionsPending} pending actions need attention.
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Total expenses: {formatINR(stats.totalExpenses || 0)}
                </Typography>

                {/* AI Insights Section */}
                {stats.recentVisit && (
                  <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                    <Typography variant="subtitle2" gutterBottom>
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
              <Typography variant="body2" color="textSecondary">
                No visits recorded yet. Start by submitting your first visit!
              </Typography>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                href="/new-visit"
                fullWidth
                size="large"
              >
                Submit New Visit
              </Button>
              <Button
                variant="outlined"
                href="/visits"
                fullWidth
                size="large"
              >
                View All Visits
              </Button>
              <Button
                variant="outlined"
                href="/visits"
                fullWidth
                size="large"
              >
                Generate Reports
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
export default SalesDashboard;