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
  Alert,
  Fade,
  Grow,
  Zoom,
  Chip,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  MeetingRoom,
  Assignment,
  TrendingUp,
  AttachMoney,
  Refresh,
  ArrowForward,
  CheckCircle,
  Schedule,
  People,
  Business,
} from '@mui/icons-material';
import { getSalesDashboardStats } from '../../services/dashboardService';
import { useAuth } from '../../context/AuthContext';
import AIInsights from '../AI/AIInsights';

const StatsCard = ({ title, value, icon, color, index }) => (
  <Grow in={true} timeout={300 + (index * 100)}>
    <Card sx={{ 
      height: '100%',
      borderRadius: '16px',
      border: '1px solid rgba(0, 0, 0, 0.05)',
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.03)',
        borderColor: color + '30',
      },
    }}>
      <CardContent>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 2,
        }}>
          <Box sx={{ 
            width: 48, 
            height: 48, 
            borderRadius: '12px',
            background: `linear-gradient(135deg, ${color} 0%, ${color}80 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 4px 12px ${color}40`,
          }}>
            {React.cloneElement(icon, { 
              sx: { 
                color: 'white', 
                fontSize: 24 
              } 
            })}
          </Box>
          <Chip 
            label="This Week" 
            size="small" 
            sx={{ 
              background: 'rgba(0, 122, 255, 0.1)',
              color: '#007AFF',
              fontWeight: 500,
              fontSize: '12px',
            }}
          />
        </Box>
        <Typography variant="h3" sx={{ 
          fontWeight: 700, 
          mb: 1,
          fontSize: '32px',
          letterSpacing: '-0.02em',
        }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ 
          fontWeight: 500,
          fontSize: '14px',
          opacity: 0.8,
        }}>
          {title}
        </Typography>
      </CardContent>
    </Card>
  </Grow>
);

const QuickActionButton = ({ icon, label, onClick, color }) => (
  <Zoom in={true} timeout={500}>
    <Button
      variant="contained"
      onClick={onClick}
      fullWidth
      sx={{
        py: 2,
        borderRadius: '14px',
        fontSize: '16px',
        fontWeight: 600,
        textTransform: 'none',
        background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`,
        boxShadow: `0 6px 20px ${color}40`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 25px ${color}60`,
        },
        '&:active': {
          transform: 'scale(0.98)',
        },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
      }}
    >
      {icon}
      {label}
    </Button>
  </Zoom>
);

const SalesDashboard = () => {
  const { user, userData } = useAuth();
  const theme = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

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
    
    setRefreshing(true);
    setError(null);
    
    const result = await getSalesDashboardStats(user.uid, userData?.role || 'sales');
    
    if (result.success) {
      setStats(result.stats);
    } else {
      setError(result.error || 'Failed to load dashboard data');
    }
    
    setLoading(false);
    setRefreshing(false);
  };

  const refreshDashboard = () => {
    fetchDashboardStats();
  };

  if (loading) {
    return (
      <Fade in={true}>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="60vh">
          <Box sx={{
            width: 60,
            height: 60,
            border: '3px solid rgba(0, 122, 255, 0.2)',
            borderTopColor: '#007AFF',
            borderRadius: '50%',
            animation: 'ios-spin 0.8s linear infinite',
            mb: 2,
          }} />
          <Typography sx={{ mt: 2, color: '#8E8E93' }}>Loading dashboard data...</Typography>
        </Box>
      </Fade>
    );
  }

  if (error) {
    return (
      <Fade in={true}>
        <Alert 
          severity="error" 
          sx={{ 
            mt: 2, 
            borderRadius: '14px',
            border: '1px solid #FF3B30',
            background: 'rgba(255, 59, 48, 0.1)',
            backdropFilter: 'blur(10px)',
            animation: 'iosSpring 0.4s',
          }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={refreshDashboard}
              sx={{
                borderRadius: '8px',
                px: 2,
                fontWeight: 600,
              }}
            >
              RETRY
            </Button>
          }
        >
          {error}
        </Alert>
      </Fade>
    );
  }

  const statCards = [
    {
      title: 'Meetings This Week',
      value: stats?.totalMeetingsThisWeek || 0,
      icon: <MeetingRoom />,
      color: '#007AFF',
    },
    {
      title: 'Pending Actions',
      value: stats?.totalActionsPending || 0,
      icon: <Assignment />,
      color: '#FF9500',
    },
    {
      title: 'Total Visits',
      value: stats?.totalVisits || 0,
      icon: <TrendingUp />,
      color: '#34C759',
    },
    {
      title: 'Total Expenses',
      value: formatINR(stats?.totalExpenses || 0),
      icon: <AttachMoney />,
      color: '#5856D6',
    },
  ];

  const quickActions = [
    {
      icon: <MeetingRoom />,
      label: 'Submit New Visit',
      onClick: () => window.location.href = '/new-visit',
      color: '#007AFF',
    },
    {
      icon: <Business />,
      label: 'View All Visits',
      onClick: () => window.location.href = '/visits',
      color: '#34C759',
    },
    {
      icon: <People />,
      label: 'Generate Reports',
      onClick: () => window.location.href = '/visits',
      color: '#5856D6',
    },
  ];

  return (
    <Fade in={true} timeout={400}>
      <Box>
        {/* iOS Style Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          animation: 'iosFadeIn 0.4s ease-out',
        }}>
          <Box>
            <Typography variant="h4" sx={{ 
              fontWeight: 700,
              fontSize: '28px',
              letterSpacing: '-0.01em',
              mb: 0.5,
              background: 'linear-gradient(90deg, #007AFF 0%, #5856D6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Sales Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '15px' }}>
              Welcome back, {user?.email?.split('@')[0]}!
            </Typography>
          </Box>
          <IconButton 
            onClick={refreshDashboard}
            disabled={refreshing}
            sx={{
              width: 48,
              height: 48,
              background: 'rgba(0, 122, 255, 0.1)',
              borderRadius: '12px',
              '&:hover': {
                background: 'rgba(0, 122, 255, 0.2)',
                transform: 'scale(1.05)',
              },
              '&:active': {
                transform: 'scale(0.95)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            {refreshing ? (
              <CircularProgress size={24} color="primary" />
            ) : (
              <Refresh sx={{ color: '#007AFF' }} />
            )}
          </IconButton>
        </Box>
        
        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statCards.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={stat.title}>
              <StatsCard {...stat} index={index} />
            </Grid>
          ))}
        </Grid>

        {/* Content Grid */}
        <Grid container spacing={3}>
          {/* Recent Activities */}
          <Grid item xs={12} md={6}>
            <Fade in={true} timeout={600}>
              <Paper sx={{ 
                p: 3, 
                height: '100%',
                borderRadius: '18px',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
              }}>
                <Typography variant="h6" gutterBottom sx={{ 
                  fontWeight: 600,
                  fontSize: '18px',
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}>
                  <CheckCircle sx={{ color: '#34C759' }} />
                  Recent Activities
                </Typography>
                
                {stats?.totalVisits > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2,
                      p: 2,
                      borderRadius: '12px',
                      background: 'rgba(0, 122, 255, 0.05)',
                    }}>
                      <MeetingRoom sx={{ color: '#007AFF' }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" fontWeight={500}>
                          Completed {stats.totalVisits} visits
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Keep up the great work!
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2,
                      p: 2,
                      borderRadius: '12px',
                      background: stats.totalActionsPending > 0 
                        ? 'rgba(255, 149, 0, 0.05)' 
                        : 'rgba(52, 199, 89, 0.05)',
                    }}>
                      <Schedule sx={{ 
                        color: stats.totalActionsPending > 0 ? '#FF9500' : '#34C759' 
                      }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" fontWeight={500}>
                          {stats.totalActionsPending} pending actions
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {stats.totalActionsPending > 0 ? 'Needs attention' : 'All clear!'}
                        </Typography>
                      </Box>
                      {stats.totalActionsPending > 0 && (
                        <ArrowForward sx={{ 
                          color: '#FF9500',
                          fontSize: 20,
                        }} />
                      )}
                    </Box>

                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2,
                      p: 2,
                      borderRadius: '12px',
                      background: 'rgba(88, 86, 214, 0.05)',
                    }}>
                      <AttachMoney sx={{ color: '#5856D6' }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" fontWeight={500}>
                          Total expenses: {formatINR(stats.totalExpenses || 0)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Average: {formatINR(stats.avgExpense || 0)} per visit
                        </Typography>
                      </Box>
                    </Box>

                    {/* AI Insights Section */}
                    {stats.recentVisit && (
                      <Box sx={{ 
                        mt: 3, 
                        pt: 3, 
                        borderTop: '1px solid rgba(0, 0, 0, 0.05)',
                      }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ 
                          fontWeight: 600,
                          mb: 2,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}>
                          <TrendingUp sx={{ color: '#007AFF' }} />
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
                  <Box sx={{ 
                    textAlign: 'center', 
                    py: 6,
                    px: 2,
                  }}>
                    <MeetingRoom sx={{ 
                      fontSize: 60, 
                      color: 'rgba(0, 0, 0, 0.1)',
                      mb: 2,
                    }} />
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                      No visits recorded yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.7 }}>
                      Start by submitting your first visit to see insights here
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Fade>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12} md={6}>
            <Fade in={true} timeout={800}>
              <Paper sx={{ 
                p: 3, 
                height: '100%',
                borderRadius: '18px',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
              }}>
                <Typography variant="h6" gutterBottom sx={{ 
                  fontWeight: 600,
                  fontSize: '18px',
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}>
                  <Assignment sx={{ color: '#FF9500' }} />
                  Quick Actions
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {quickActions.map((action, index) => (
                    <QuickActionButton key={action.label} {...action} />
                  ))}
                </Box>

                {/* Performance Tips */}
                <Box sx={{ 
                  mt: 4, 
                  pt: 3, 
                  borderTop: '1px solid rgba(0, 0, 0, 0.05)',
                }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ 
                    fontWeight: 600,
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}>
                    <TrendingUp sx={{ color: '#34C759' }} />
                    Performance Tips
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '14px' }}>
                      • Submit visits within 24 hours for better accuracy
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '14px' }}>
                      • Use AI insights to optimize your sales strategy
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '14px' }}>
                      • Track expenses regularly to stay within budget
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Fade>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
};

export default SalesDashboard;