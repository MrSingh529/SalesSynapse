import React, { useEffect, useState } from 'react';
import {
  Grid, Typography, Box, CircularProgress, Alert, Button, IconButton, useTheme, useMediaQuery
} from '@mui/material';
import {
  MeetingRoom, Assignment, TrendingUp, AttachMoney, Refresh
} from '@mui/icons-material';
import { getSalesDashboardStats } from '../../services/dashboardService';
import { useAuth } from '../../context/AuthContext';
import AIInsights from '../AI/AIInsights';
import { iosColors, iosBorderRadius } from '../../styles/iosTheme';
import { motion } from 'framer-motion';

// iOS Style Stat Card
const IOSStatsCard = ({ title, value, icon, color }) => (
  <motion.div
    whileTap={{ scale: 0.96 }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
    style={{ height: '100%' }}
  >
    <Box sx={{ 
      p: 2.5, 
      height: '100%',
      bgcolor: iosColors.backgroundSecondary, 
      borderRadius: `${iosBorderRadius.large}px`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Box sx={{ 
          color: color, 
          bgcolor: `${color}15`, 
          p: 1, 
          borderRadius: 2, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          mr: 1.5
        }}>
          {React.cloneElement(icon, { fontSize: 'small' })}
        </Box>
        <Typography sx={{ fontSize: '15px', color: iosColors.secondaryLabel, fontWeight: 500 }}>
          {title}
        </Typography>
      </Box>
      <Typography sx={{ fontSize: '28px', fontWeight: 700, color: iosColors.label, mt: 1 }}>
        {value}
      </Typography>
    </Box>
  </motion.div>
);

// iOS Style Grouped List Item for Quick Actions
const IOSActionItem = ({ title, onClick }) => (
  <motion.div whileTap={{ scale: 0.98, backgroundColor: iosColors.systemGray6 }}>
    <Box 
      onClick={onClick}
      sx={{ 
        p: 2, 
        borderBottom: `0.5px solid ${iosColors.separator}`,
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        cursor: 'pointer',
        '&:last-child': { borderBottom: 'none' }
      }}
    >
      <Typography sx={{ color: iosColors.systemBlue, fontSize: '17px', fontWeight: 500 }}>
        {title}
      </Typography>
      <Typography sx={{ color: iosColors.systemGray3, fontSize: '20px' }}>›</Typography>
    </Box>
  </motion.div>
);

const SalesDashboard = () => {
  const { user, userData } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0
    }).format(amount || 0);
  };

  useEffect(() => {
    if (user) fetchDashboardStats();
  }, [user]);

  const fetchDashboardStats = async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true); setError(null);
    const result = await getSalesDashboardStats(user.uid, userData?.role || 'sales');
    if (result.success) setStats(result.stats);
    else setError(result.error || 'Failed to load dashboard data');
    setLoading(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress sx={{ color: iosColors.systemGray }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2, borderRadius: `${iosBorderRadius.medium}px` }}
        action={<Button color="inherit" size="small" onClick={fetchDashboardStats}>RETRY</Button>}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ pb: 4 }}>
      {/* Hidden mobile title, shown on desktop */}
      {!isMobile && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, px: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, fontSize: '34px', letterSpacing: '-0.02em' }}>
            Overview
          </Typography>
          <IconButton onClick={fetchDashboardStats} sx={{ color: iosColors.systemBlue }}>
            <Refresh />
          </IconButton>
        </Box>
      )}

      {/* Stats Grid */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6} md={3}>
          <IOSStatsCard title="This Week" value={stats?.totalMeetingsThisWeek || 0} icon={<MeetingRoom />} color={iosColors.systemBlue} />
        </Grid>
        <Grid item xs={6} md={3}>
          <IOSStatsCard title="Actions" value={stats?.totalActionsPending || 0} icon={<Assignment />} color={iosColors.systemRed} />
        </Grid>
        <Grid item xs={6} md={3}>
          <IOSStatsCard title="Total Visits" value={stats?.totalVisits || 0} icon={<TrendingUp />} color={iosColors.systemGreen} />
        </Grid>
        <Grid item xs={6} md={3}>
          <IOSStatsCard title="Expenses" value={formatINR(stats?.totalExpenses || 0)} icon={<AttachMoney />} color={iosColors.systemOrange} />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Activities Panel */}
        <Grid item xs={12} md={6}>
          <Typography sx={{ ml: 2, mb: 1, fontSize: '13px', textTransform: 'uppercase', color: iosColors.secondaryLabel, fontWeight: 500 }}>
            Recent Activity
          </Typography>
          <Box sx={{ 
            bgcolor: iosColors.backgroundSecondary, 
            borderRadius: `${iosBorderRadius.large}px`, 
            p: 3,
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
          }}>
            {stats?.totalVisits > 0 ? (
              <Box>
                <Typography sx={{ fontSize: '16px', color: iosColors.label, mb: 1 }}>
                  You have completed <b>{stats.totalVisits}</b> visits.
                </Typography>
                <Typography sx={{ fontSize: '16px', color: iosColors.systemRed, mb: 1 }}>
                  <b>{stats.totalActionsPending}</b> pending actions need attention.
                </Typography>
                
                {stats.recentVisit && (
                  <Box sx={{ mt: 3, pt: 3, borderTop: `0.5px solid ${iosColors.separator}` }}>
                    <Typography sx={{ fontSize: '15px', fontWeight: 600, color: iosColors.label, mb: 2 }}>
                      AI Insights for Latest Visit
                    </Typography>
                    <AIInsights visitData={stats.recentVisit} userRole="sales" showTitle={false} />
                  </Box>
                )}
              </Box>
            ) : (
              <Typography sx={{ color: iosColors.secondaryLabel, textAlign: 'center', py: 2 }}>
                No visits recorded yet.
              </Typography>
            )}
          </Box>
        </Grid>

        {/* Quick Actions Panel (iOS Grouped List Style) */}
        <Grid item xs={12} md={6}>
          <Typography sx={{ ml: 2, mb: 1, fontSize: '13px', textTransform: 'uppercase', color: iosColors.secondaryLabel, fontWeight: 500 }}>
            Quick Actions
          </Typography>
          <Box sx={{ 
            bgcolor: iosColors.backgroundSecondary, 
            borderRadius: `${iosBorderRadius.large}px`, 
            overflow: 'hidden',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
          }}>
            <IOSActionItem title="Submit New Visit" onClick={() => window.location.href = '/new-visit'} />
            <IOSActionItem title="View All Visits" onClick={() => window.location.href = '/visits'} />
            <IOSActionItem title="Generate Reports" onClick={() => window.location.href = '/visits'} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SalesDashboard;
