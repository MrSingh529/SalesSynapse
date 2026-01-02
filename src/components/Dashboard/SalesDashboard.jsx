import React, { useEffect, useState, useRef } from 'react';
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
  Fade,
  Zoom,
  Grow,
  Slide,
  useScrollTrigger,
  useTheme,
  useMediaQuery,
  Chip,
  Avatar,
  Badge,
  Divider,
  LinearProgress,
  Tooltip
} from '@mui/material';
import {
  MeetingRoom,
  Assignment,
  TrendingUp,
  AttachMoney,
  Refresh,
  Add,
  ArrowUpward,
  ArrowDownward,
  MoreVert,
  CalendarToday,
  Notifications,
  AutoAwesome,
  ChevronRight,
  CheckCircle,
  Warning,
  Schedule,
  Business,
  Person
} from '@mui/icons-material';
import { getSalesDashboardStats } from '../../services/dashboardService';
import { useAuth } from '../../context/AuthContext';
import AIInsights from '../AI/AIInsights';
import { iOSStyles, iOSUtils } from '../../utils/iosAnimations';
import useIOSAnimations from '../../hooks/useIOSAnimations';
import IOSLoading from '../Common/IOSLoading';
import { motion, AnimatePresence } from 'framer-motion';

const StatsCard = ({ title, value, icon, color, subtext, trend, isLoading, index }) => {
  const { pressAnimation } = useIOSAnimations();
  const cardRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handlePress = () => {
    if (cardRef.current) {
      pressAnimation(cardRef.current);
    }
  };

  return (
    <Grow in={true} timeout={(index + 1) * 200}>
      <Card
        ref={cardRef}
        onClick={handlePress}
        sx={{
          height: '100%',
          borderRadius: iOSStyles.borderRadius.large,
          background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
          border: `1px solid ${iOSStyles.colors.systemGray5}`,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.1)',
            borderColor: color + '40',
          },
          '&:active': {
            transform: 'translateY(-2px)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, ${color} 0%, ${color}80 100%)`,
            borderRadius: `${iOSStyles.borderRadius.large}px ${iOSStyles.borderRadius.large}px 0 0`,
          },
        }}
      >
        <CardContent sx={{ p: isMobile ? 2 : 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ color: iOSStyles.colors.secondaryLabel, fontWeight: 500, fontSize: '13px' }}>
                {title}
              </Typography>
              {isLoading ? (
                <Box sx={{ mt: 1 }}>
                  <Box className="ios-skeleton" sx={{ width: 80, height: 32, borderRadius: 2 }} />
                </Box>
              ) : (
                <Typography variant="h4" sx={{ fontWeight: 700, color: iOSStyles.colors.label, mt: 1 }}>
                  {value}
                </Typography>
              )}
            </Box>
            
            <Box sx={{ 
              width: 48, 
              height: 48, 
              borderRadius: iOSStyles.borderRadius.medium,
              backgroundColor: color + '20',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {React.cloneElement(icon, { 
                sx: { color, fontSize: 24 } 
              })}
            </Box>
          </Box>
          
          {subtext && !isLoading && (
            <Typography variant="caption" sx={{ color: iOSStyles.colors.secondaryLabel, display: 'block', mb: 1 }}>
              {subtext}
            </Typography>
          )}
          
          {trend && !isLoading && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              {trend.direction === 'up' ? (
                <ArrowUpward sx={{ color: iOSStyles.colors.systemGreen, fontSize: 16, mr: 0.5 }} />
              ) : (
                <ArrowDownward sx={{ color: iOSStyles.colors.systemRed, fontSize: 16, mr: 0.5 }} />
              )}
              <Typography variant="caption" sx={{ 
                color: trend.direction === 'up' ? iOSStyles.colors.systemGreen : iOSStyles.colors.systemRed,
                fontWeight: 600,
                fontSize: '12px'
              }}>
                {trend.value}
              </Typography>
              <Typography variant="caption" sx={{ color: iOSStyles.colors.secondaryLabel, ml: 0.5 }}>
                from last week
              </Typography>
            </Box>
          )}
          
          {/* Shimmer effect on hover */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
              transition: 'left 0.5s',
              '&:hover': {
                left: '100%',
              },
            }}
          />
        </CardContent>
      </Card>
    </Grow>
  );
};

const QuickActionButton = ({ icon, label, color, onClick, badge }) => {
  const { pressAnimation } = useIOSAnimations();
  const buttonRef = useRef(null);

  const handleClick = (e) => {
    if (buttonRef.current) {
      pressAnimation(buttonRef.current);
    }
    onClick(e);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <Box
        ref={buttonRef}
        onClick={handleClick}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          borderRadius: iOSStyles.borderRadius.large,
          backgroundColor: iOSStyles.colors.systemGray6,
          border: `1px solid ${iOSStyles.colors.systemGray5}`,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          position: 'relative',
          '&:hover': {
            backgroundColor: iOSStyles.colors.systemGray5,
            borderColor: color + '40',
          },
        }}
      >
        {badge && (
          <Badge
            badgeContent={badge}
            color="error"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              '& .MuiBadge-badge': {
                fontSize: 10,
                height: 18,
                minWidth: 18,
              },
            }}
          />
        )}
        
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            backgroundColor: color + '20',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 1.5,
          }}
        >
          {React.cloneElement(icon, { sx: { color, fontSize: 24 } })}
        </Box>
        
        <Typography
          variant="caption"
          sx={{
            color: iOSStyles.colors.label,
            fontWeight: 600,
            textAlign: 'center',
            fontSize: '13px',
          }}
        >
          {label}
        </Typography>
      </Box>
    </motion.div>
  );
};

const SalesDashboard = () => {
  const { user, userData } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [pullProgress, setPullProgress] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const containerRef = useRef(null);
  const startYRef = useRef(0);
  const { hapticFeedback, setupPullToRefresh } = useIOSAnimations();
  
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

  useEffect(() => {
    if (containerRef.current) {
      return setupPullToRefresh(containerRef.current, handleRefresh);
    }
  }, []);

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
      hapticFeedback('success');
    } else {
      setError(result.error || 'Failed to load dashboard data');
      hapticFeedback('error');
    }
    
    setLoading(false);
    setRefreshing(false);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardStats();
  };

  const handleQuickAction = (action) => {
    hapticFeedback('light');
    switch (action) {
      case 'new-visit':
        window.location.href = '/new-visit';
        break;
      case 'reports':
        window.location.href = '/visits';
        break;
      case 'calendar':
        // Open calendar
        break;
      case 'notifications':
        setShowNotifications(!showNotifications);
        break;
    }
  };

  const quickActions = [
    { icon: <Add />, label: 'New Visit', color: iOSStyles.colors.systemBlue, action: 'new-visit' },
    { icon: <Assignment />, label: 'Reports', color: iOSStyles.colors.systemGreen, action: 'reports', badge: 3 },
    { icon: <CalendarToday />, label: 'Calendar', color: iOSStyles.colors.systemOrange, action: 'calendar' },
    { icon: <Notifications />, label: 'Alerts', color: iOSStyles.colors.systemRed, action: 'notifications', badge: 5 },
  ];

  if (loading && !stats) {
    return <IOSLoading message="Loading Dashboard" subMessage="Fetching your sales data..." />;
  }

  if (error) {
    return (
      <Fade in={true}>
        <Alert 
          severity="error" 
          sx={{ 
            mt: 2,
            borderRadius: iOSStyles.borderRadius.large,
            border: `1px solid ${iOSStyles.colors.systemRed}40`,
            backgroundColor: `${iOSStyles.colors.systemRed}15`,
          }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={fetchDashboardStats}
              sx={{
                borderRadius: iOSStyles.borderRadius.medium,
                textTransform: 'none',
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

  const trendData = [
    { day: 'Mon', visits: 4, expenses: 1500 },
    { day: 'Tue', visits: 6, expenses: 2200 },
    { day: 'Wed', visits: 3, expenses: 1200 },
    { day: 'Thu', visits: 7, expenses: 2800 },
    { day: 'Fri', visits: 5, expenses: 1800 },
    { day: 'Sat', visits: 2, expenses: 800 },
    { day: 'Sun', visits: 1, expenses: 500 },
  ];

  return (
    <Box ref={containerRef} sx={{ position: 'relative' }}>
      {/* Pull to refresh indicator */}
      {refreshing && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            animation: 'slideDown 0.3s ease-out',
            '@keyframes slideDown': {
              from: { transform: 'translateY(-100%)' },
              to: { transform: 'translateY(0)' },
            },
          }}
        >
          <CircularProgress size={24} />
        </Box>
      )}

      {/* Header */}
      <Slide direction="down" in={true}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          animation: 'fadeIn 0.5s ease-out',
        }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: iOSStyles.colors.label, mb: 0.5 }}>
              Dashboard
            </Typography>
            <Typography variant="body2" sx={{ color: iOSStyles.colors.secondaryLabel }}>
              Welcome back, {user?.email?.split('@')[0]}! Here's your overview.
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              icon={<CalendarToday />}
              label={new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              size="small"
              sx={{
                borderRadius: iOSStyles.borderRadius.medium,
                backgroundColor: iOSStyles.colors.systemGray6,
                border: `1px solid ${iOSStyles.colors.systemGray5}`,
                fontWeight: 500,
              }}
            />
            
            <Tooltip title="Refresh">
              <IconButton
                onClick={handleRefresh}
                disabled={refreshing}
                sx={{
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
                <Refresh sx={{ 
                  color: iOSStyles.colors.systemBlue,
                  animation: refreshing ? 'spin 1s linear infinite' : 'none',
                  '@keyframes spin': {
                    from: { transform: 'rotate(0deg)' },
                    to: { transform: 'rotate(360deg)' },
                  },
                }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Slide>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            index={0}
            title="Meetings This Week"
            value={stats?.totalMeetingsThisWeek || 0}
            icon={<MeetingRoom />}
            color={iOSStyles.colors.systemBlue}
            subtext={`${stats?.uniqueCompanies || 0} unique companies`}
            trend={{ direction: 'up', value: '+12%' }}
            isLoading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            index={1}
            title="Pending Actions"
            value={stats?.totalActionsPending || 0}
            icon={<Assignment />}
            color={iOSStyles.colors.systemRed}
            subtext="Need attention"
            trend={{ direction: 'down', value: '-8%' }}
            isLoading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            index={2}
            title="Total Visits"
            value={stats?.totalVisits || 0}
            icon={<TrendingUp />}
            color={iOSStyles.colors.systemGreen}
            subtext="All time"
            trend={{ direction: 'up', value: '+24%' }}
            isLoading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            index={3}
            title="Total Expenses"
            value={formatINR(stats?.totalExpenses || 0)}
            icon={<AttachMoney />}
            color={iOSStyles.colors.systemOrange}
            subtext="This month"
            trend={{ direction: 'down', value: '-15%' }}
            isLoading={loading}
          />
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Left Column - Activity & AI Insights */}
        <Grid item xs={12} lg={8}>
          <Slide direction="right" in={true} timeout={300}>
            <Paper
              sx={{
                p: isMobile ? 2 : 3,
                borderRadius: iOSStyles.borderRadius.large,
                background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                border: `1px solid ${iOSStyles.colors.systemGray5}`,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                mb: 3,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: iOSStyles.colors.label }}>
                  Weekly Activity
                </Typography>
                <Chip
                  label="This Week"
                  size="small"
                  sx={{
                    backgroundColor: iOSStyles.colors.systemBlue + '20',
                    color: iOSStyles.colors.systemBlue,
                    fontWeight: 600,
                  }}
                />
              </Box>

              {/* Activity Bars */}
              <Box sx={{ mb: 4 }}>
                <Grid container spacing={1} sx={{ mb: 2 }}>
                  {trendData.map((day, index) => (
                    <Grid item xs key={day.day}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="caption" sx={{ color: iOSStyles.colors.secondaryLabel, display: 'block', mb: 1 }}>
                          {day.day}
                        </Typography>
                        <Box
                          sx={{
                            height: 80,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                          }}
                        >
                          <Box
                            sx={{
                              height: `${(day.visits / 7) * 60}px`,
                              backgroundColor: iOSStyles.colors.systemBlue,
                              borderRadius: `${iOSStyles.borderRadius.small}px ${iOSStyles.borderRadius.small}px 0 0`,
                              position: 'relative',
                              animation: `growUp 0.5s ease-out ${index * 0.1}s both`,
                              '@keyframes growUp': {
                                from: { height: 0 },
                                to: { height: `${(day.visits / 7) * 60}px` },
                              },
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                position: 'absolute',
                                top: -20,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                color: iOSStyles.colors.systemBlue,
                                fontWeight: 600,
                                fontSize: '11px',
                              }}
                            >
                              {day.visits}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                
                <Divider sx={{ my: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: iOSStyles.colors.systemBlue }} />
                      <Typography variant="caption" sx={{ color: iOSStyles.colors.secondaryLabel }}>
                        Visits
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: iOSStyles.colors.systemGreen }} />
                      <Typography variant="caption" sx={{ color: iOSStyles.colors.secondaryLabel }}>
                        Expenses
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Recent Activities List */}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: iOSStyles.colors.label, mb: 2 }}>
                  Recent Activities
                </Typography>
                
                <AnimatePresence>
                  {[
                    { id: 1, type: 'visit', company: 'TechCorp Inc.', time: '2 hours ago', status: 'completed' },
                    { id: 2, type: 'action', task: 'Follow up with design team', time: 'Yesterday', status: 'pending' },
                    { id: 3, type: 'visit', company: 'Global Solutions', time: '2 days ago', status: 'completed' },
                    { id: 4, type: 'expense', amount: '₹2,500', time: '3 days ago', status: 'approved' },
                  ].map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          p: 2,
                          mb: 1,
                          borderRadius: iOSStyles.borderRadius.medium,
                          backgroundColor: iOSStyles.colors.systemGray6,
                          border: `1px solid ${iOSStyles.colors.systemGray5}`,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: iOSStyles.colors.systemGray5,
                            transform: 'translateX(4px)',
                          },
                        }}
                      >
                        <Box sx={{ mr: 2 }}>
                          {activity.type === 'visit' && (
                            <Business sx={{ color: iOSStyles.colors.systemBlue }} />
                          )}
                          {activity.type === 'action' && (
                            <Assignment sx={{ color: iOSStyles.colors.systemOrange }} />
                          )}
                          {activity.type === 'expense' && (
                            <AttachMoney sx={{ color: iOSStyles.colors.systemGreen }} />
                          )}
                        </Box>
                        
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: iOSStyles.colors.label }}>
                            {activity.type === 'visit' && `Visit to ${activity.company}`}
                            {activity.type === 'action' && activity.task}
                            {activity.type === 'expense' && `Expense: ${activity.amount}`}
                          </Typography>
                          <Typography variant="caption" sx={{ color: iOSStyles.colors.secondaryLabel }}>
                            {activity.time}
                          </Typography>
                        </Box>
                        
                        <Chip
                          label={activity.status}
                          size="small"
                          sx={{
                            backgroundColor: 
                              activity.status === 'completed' ? `${iOSStyles.colors.systemGreen}20` :
                              activity.status === 'pending' ? `${iOSStyles.colors.systemOrange}20` :
                              `${iOSStyles.colors.systemBlue}20`,
                            color:
                              activity.status === 'completed' ? iOSStyles.colors.systemGreen :
                              activity.status === 'pending' ? iOSStyles.colors.systemOrange :
                              iOSStyles.colors.systemBlue,
                            fontWeight: 600,
                            fontSize: '11px',
                          }}
                        />
                      </Box>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </Box>

              {/* AI Insights Section */}
              {stats?.recentVisit && (
                <Box sx={{ mt: 4, pt: 3, borderTop: `1px solid ${iOSStyles.colors.systemGray5}` }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <AutoAwesome sx={{ color: iOSStyles.colors.systemPurple }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: iOSStyles.colors.label }}>
                      AI Insights for Your Latest Visit
                    </Typography>
                  </Box>
                  <AIInsights 
                    visitData={stats.recentVisit}
                    userRole="sales"
                    showTitle={false}
                  />
                </Box>
              )}
            </Paper>
          </Slide>
        </Grid>

        {/* Right Column - Quick Actions & Performance */}
        <Grid item xs={12} lg={4}>
          <Slide direction="left" in={true} timeout={400}>
            <Box>
              {/* Quick Actions */}
              <Paper
                sx={{
                  p: isMobile ? 2 : 3,
                  borderRadius: iOSStyles.borderRadius.large,
                  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                  border: `1px solid ${iOSStyles.colors.systemGray5}`,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                  mb: 3,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, color: iOSStyles.colors.label, mb: 3 }}>
                  Quick Actions
                </Typography>
                
                <Grid container spacing={2}>
                  {quickActions.map((action) => (
                    <Grid item xs={6} key={action.label}>
                      <QuickActionButton
                        icon={action.icon}
                        label={action.label}
                        color={action.color}
                        badge={action.badge}
                        onClick={() => handleQuickAction(action.action)}
                      />
                    </Grid>
                  ))}
                </Grid>
                
                <Button
                  fullWidth
                  variant="contained"
                  href="/new-visit"
                  sx={{
                    mt: 3,
                    py: 1.5,
                    borderRadius: iOSStyles.borderRadius.large,
                    backgroundColor: iOSStyles.colors.systemBlue,
                    fontSize: '15px',
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: '0 4px 20px rgba(0, 122, 255, 0.3)',
                    '&:hover': {
                      backgroundColor: '#0056CC',
                      boxShadow: '0 6px 24px rgba(0, 122, 255, 0.4)',
                    },
                    '&:active': {
                      transform: 'scale(0.98)',
                    },
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  startIcon={<Add />}
                >
                  Submit New Visit
                </Button>
              </Paper>

              {/* Performance Metrics */}
              <Paper
                sx={{
                  p: isMobile ? 2 : 3,
                  borderRadius: iOSStyles.borderRadius.large,
                  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                  border: `1px solid ${iOSStyles.colors.systemGray5}`,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, color: iOSStyles.colors.label, mb: 3 }}>
                  Performance
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: iOSStyles.colors.secondaryLabel }}>
                      Weekly Target
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: iOSStyles.colors.systemGreen }}>
                      85%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={85}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: iOSStyles.colors.systemGray5,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: iOSStyles.colors.systemGreen,
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: iOSStyles.colors.secondaryLabel }}>
                      Conversion Rate
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: iOSStyles.colors.systemBlue }}>
                      42%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={42}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: iOSStyles.colors.systemGray5,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: iOSStyles.colors.systemBlue,
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>
                
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: iOSStyles.colors.secondaryLabel }}>
                      Customer Satisfaction
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: iOSStyles.colors.systemOrange }}>
                      92%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={92}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: iOSStyles.colors.systemGray5,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: iOSStyles.colors.systemOrange,
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>
                
                <Button
                  fullWidth
                  variant="outlined"
                  href="/visits"
                  sx={{
                    mt: 3,
                    py: 1.5,
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
                  endIcon={<ChevronRight />}
                >
                  View Detailed Reports
                </Button>
              </Paper>
            </Box>
          </Slide>
        </Grid>
      </Grid>

      {/* Notifications Panel */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <Paper
              sx={{
                position: 'absolute',
                top: 60,
                right: 0,
                width: isMobile ? '100%' : 320,
                borderRadius: iOSStyles.borderRadius.large,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: `1px solid ${iOSStyles.colors.systemGray5}`,
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
                zIndex: 1000,
                overflow: 'hidden',
              }}
            >
              <Box sx={{ p: 2, borderBottom: `1px solid ${iOSStyles.colors.systemGray5}` }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Notifications (5)
                </Typography>
              </Box>
              <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                {[1, 2, 3, 4, 5].map((item) => (
                  <Box
                    key={item}
                    sx={{
                      p: 2,
                      borderBottom: `1px solid ${iOSStyles.colors.systemGray5}`,
                      '&:hover': {
                        backgroundColor: iOSStyles.colors.systemGray6,
                      },
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                      New visit scheduled
                    </Typography>
                    <Typography variant="caption" sx={{ color: iOSStyles.colors.secondaryLabel }}>
                      2 hours ago
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default SalesDashboard;