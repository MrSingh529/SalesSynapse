import React, { useEffect, useState, useRef } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  Avatar,
  AvatarGroup,
  Tooltip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  IconButton,
  Button,
  Fade,
  Zoom,
  Slide,
  Grow,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab
} from '@mui/material';
import {
  People,
  Business,
  TrendingUp,
  AttachMoney,
  CalendarToday,
  BarChart,
  PieChart as PieChartIcon,
  Person,
  CorporateFare,
  Assessment,
  ShowChart,
  TrendingFlat,
  ArrowUpward,
  ArrowDownward,
  MoreVert,
  FilterList,
  Download,
  Refresh,
  AutoAwesome,
  ChevronRight,
  Notifications,
  Schedule
} from '@mui/icons-material';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart as RechartsBarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip as RechartsTooltip, Legend,
  LineChart, Line,
  AreaChart, Area,
  RadialBarChart, RadialBar,
  ScatterChart, Scatter
} from 'recharts';
import { getManagerDashboardStats } from '../../services/dashboardService';
import { SALES_STAGES, SALES_TYPES } from '../../utils/constants';
import AIInsights from '../AI/AIInsights';
import { iOSStyles, iOSUtils } from '../../utils/iosAnimations';
import useIOSAnimations from '../../hooks/useIOSAnimations';
import { motion, AnimatePresence } from 'framer-motion';

const StatsCard = ({ title, value, icon, color, subtext, trend, index }) => (
  <Grow in={true} timeout={(index + 1) * 200}>
    <Card sx={{ 
      height: '100%',
      borderRadius: iOSStyles.borderRadius.large,
      background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
      border: `1px solid ${iOSStyles.colors.systemGray5}`,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="subtitle2" sx={{ color: iOSStyles.colors.secondaryLabel, fontWeight: 500, mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: iOSStyles.colors.label, mb: 1 }}>
              {value}
            </Typography>
            {subtext && (
              <Typography variant="caption" sx={{ color: iOSStyles.colors.secondaryLabel, display: 'block' }}>
                {subtext}
              </Typography>
            )}
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                {trend.direction === 'up' ? (
                  <ArrowUpward sx={{ color: iOSStyles.colors.systemGreen, fontSize: 16 }} />
                ) : (
                  <ArrowDownward sx={{ color: iOSStyles.colors.systemRed, fontSize: 16 }} />
                )}
                <Typography variant="caption" sx={{ 
                  color: trend.direction === 'up' ? iOSStyles.colors.systemGreen : iOSStyles.colors.systemRed,
                  fontWeight: 600,
                  ml: 0.5
                }}>
                  {trend.value}
                </Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ 
            backgroundColor: `${color}20`,
            borderRadius: iOSStyles.borderRadius.medium,
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {React.cloneElement(icon, { 
              sx: { color, fontSize: 24 } 
            })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  </Grow>
);

const ManagerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const { hapticFeedback } = useIOSAnimations();
  
  useEffect(() => {
    fetchDashboardStats();
  }, []);
  
  const fetchDashboardStats = async () => {
    setLoading(true);
    setError(null);
    
    const result = await getManagerDashboardStats();
    
    console.log('Manager dashboard fetch result:', result);
    
    if (result.success) {
      setStats(result.stats);
      hapticFeedback('success');
    } else {
      setError(result.error || 'Failed to load manager dashboard data');
      hapticFeedback('error');
    }
    
    setLoading(false);
    setRefreshing(false);
  };
  
  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardStats();
  };
  
  const handleTabChange = (event, newValue) => {
    hapticFeedback('light');
    setTabValue(newValue);
  };
  
  const getStageData = () => {
    if (!stats?.stageCounts) return [];
    return Object.entries(stats.stageCounts)
      .filter(([_, count]) => count > 0)
      .map(([stage, count]) => ({
        name: SALES_STAGES.find(s => s.value === stage)?.label.split('–')[0] || stage,
        value: count,
        stage
      }));
  };
  
  const getSalesTypeData = () => {
    if (!stats?.salesTypeCounts) return [];
    return Object.entries(stats.salesTypeCounts)
      .filter(([_, count]) => count > 0)
      .map(([type, count]) => ({
        name: SALES_TYPES.find(t => t.value === type)?.label || type,
        value: count,
        type
      }));
  };
  
  const COLORS = ['#007AFF', '#34C759', '#FF9500', '#FF2D55', '#5856D6', '#FF3B30', '#5AC8FA'];
  
  // Indian Rupee formatter
  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };
  
  if (loading && !stats) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Alert 
        severity="error" 
        sx={{ mt: 2 }}
        action={
          <Button onClick={fetchDashboardStats} color="inherit" size="small">
            Retry
          </Button>
        }
      >
        Error: {error}
      </Alert>
    );
  }
  
  const isEmpty = stats.totalVisitsDone === 0;
  
  const monthlyTrends = [
    { month: 'Jan', visits: 65, expenses: 45000, revenue: 120000 },
    { month: 'Feb', visits: 78, expenses: 52000, revenue: 145000 },
    { month: 'Mar', visits: 92, expenses: 61000, revenue: 180000 },
    { month: 'Apr', visits: 85, expenses: 58000, revenue: 165000 },
    { month: 'May', visits: 103, expenses: 72000, revenue: 210000 },
    { month: 'Jun', visits: 96, expenses: 68000, revenue: 195000 },
  ];
  
  const topPerformersData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', visits: 24, conversion: 68, revenue: 450000 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', visits: 22, conversion: 72, revenue: 520000 },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', visits: 19, conversion: 61, revenue: 380000 },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', visits: 17, conversion: 58, revenue: 320000 },
  ];
  
  const salesFunnelData = [
    { stage: 'Prospecting', value: 100, fill: '#007AFF' },
    { stage: 'Qualification', value: 75, fill: '#34C759' },
    { stage: 'Needs Analysis', value: 60, fill: '#FF9500' },
    { stage: 'Proposal', value: 45, fill: '#FF2D55' },
    { stage: 'Negotiation', value: 30, fill: '#5856D6' },
    { stage: 'Closed Won', value: 20, fill: '#5AC8FA' },
  ];

  return (
    <Box>
      {/* Header */}
      <Slide direction="down" in={true}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 2 : 0,
        }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: iOSStyles.colors.label, mb: 0.5 }}>
              Manager Dashboard
            </Typography>
            <Typography variant="body2" sx={{ color: iOSStyles.colors.secondaryLabel }}>
              Team performance overview and analytics
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              icon={<CalendarToday />} 
              label={new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              variant="outlined"
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
                }} />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Filters">
              <IconButton
                onClick={() => setFilterOpen(!filterOpen)}
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
                <FilterList sx={{ color: iOSStyles.colors.systemBlue }} />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Export">
              <IconButton
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
                <Download sx={{ color: iOSStyles.colors.systemBlue }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Slide>

      {/* Tabs */}
      <Paper sx={{ 
        mb: 3, 
        borderRadius: iOSStyles.borderRadius.large,
        background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
        border: `1px solid ${iOSStyles.colors.systemGray5}`,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
      }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons="auto"
          sx={{ 
            px: 2,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '15px',
              minHeight: 56,
              '&.Mui-selected': {
                color: iOSStyles.colors.systemBlue,
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: iOSStyles.colors.systemBlue,
              height: 3,
              borderRadius: '3px 3px 0 0',
            },
          }}
        >
          <Tab label="Overview" icon={<Assessment />} iconPosition="start" />
          <Tab label="Performance" icon={<TrendingUp />} iconPosition="start" />
          <Tab label="Team" icon={<People />} iconPosition="start" />
          <Tab label="Analytics" icon={<BarChart />} iconPosition="start" />
          <Tab label="AI Insights" icon={<AutoAwesome />} iconPosition="start" />
        </Tabs>
      </Paper>

      {/* Overview Tab */}
      <AnimatePresence mode="wait">
        {tabValue === 0 && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {isEmpty ? (
              <Paper sx={{ p: 6, textAlign: 'center' }}>
                <Business sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h5" color="textSecondary" gutterBottom>
                  No Data Available
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Start by having your sales team submit their first visits.
                </Typography>
              </Paper>
            ) : (
              <>
                {/* Key Metrics */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatsCard
                      title="Total Visits"
                      value={stats.totalVisitsDone}
                      icon={<TrendingUp />}
                      color={iOSStyles.colors.systemBlue}
                      subtext={`${stats.uniqueCompanies} unique companies`}
                      trend={{ direction: 'up', value: '+18%' }}
                      index={0}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatsCard
                      title="Total Expenses"
                      value={formatINR(stats.totalExpenses)}
                      icon={<AttachMoney />}
                      color={iOSStyles.colors.systemRed}
                      subtext={`Avg: ${formatINR(stats.avgExpensesPerVisit)}/visit`}
                      trend={{ direction: 'down', value: '-12%' }}
                      index={1}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatsCard
                      title="Sales Team"
                      value={stats.totalSalesPersons}
                      icon={<People />}
                      color={iOSStyles.colors.systemGreen}
                      subtext={`${stats.topPerformers.length} active members`}
                      trend={{ direction: 'up', value: '+5%' }}
                      index={2}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatsCard
                      title="Most Visited"
                      value={stats.mostVisitedCustomer.name}
                      icon={<Business />}
                      color={iOSStyles.colors.systemOrange}
                      subtext={`${stats.mostVisitedCustomer.count} visits`}
                      index={3}
                    />
                  </Grid>
                </Grid>

                {/* Charts Row */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} md={8}>
                    <Paper sx={{ 
                      p: 3, 
                      height: '400px',
                      borderRadius: iOSStyles.borderRadius.large,
                      background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                      border: `1px solid ${iOSStyles.colors.systemGray5}`,
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <BarChart sx={{ color: iOSStyles.colors.systemBlue, mr: 1 }} />
                        <Typography variant="h6">Monthly Performance Trends</Typography>
                      </Box>
                      <ResponsiveContainer width="100%" height="85%">
                        <AreaChart data={monthlyTrends}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <RechartsTooltip 
                            formatter={(value, name) => {
                              if (name === 'expenses' || name === 'revenue') return [formatINR(value), name];
                              return [value, name];
                            }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="visits" 
                            stackId="1"
                            stroke={iOSStyles.colors.systemBlue} 
                            fill={iOSStyles.colors.systemBlue} 
                            fillOpacity={0.6}
                            name="Visits"
                          />
                          <Area 
                            type="monotone" 
                            dataKey="revenue" 
                            stackId="2"
                            stroke={iOSStyles.colors.systemGreen} 
                            fill={iOSStyles.colors.systemGreen} 
                            fillOpacity={0.6}
                            name="Revenue"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ 
                      p: 3, 
                      height: '400px',
                      borderRadius: iOSStyles.borderRadius.large,
                      background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                      border: `1px solid ${iOSStyles.colors.systemGray5}`,
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <PieChartIcon sx={{ color: iOSStyles.colors.systemGreen, mr: 1 }} />
                        <Typography variant="h6">Sales Funnel</Typography>
                      </Box>
                      <ResponsiveContainer width="100%" height="85%">
                        <RadialBarChart 
                          innerRadius="20%" 
                          outerRadius="90%" 
                          data={salesFunnelData} 
                          startAngle={180} 
                          endAngle={0}
                        >
                          <RadialBar 
                            minAngle={15} 
                            label={{ position: 'insideStart', fill: '#fff' }} 
                            background 
                            dataKey="value" 
                          />
                          <Legend />
                          <RechartsTooltip />
                        </RadialBarChart>
                      </ResponsiveContainer>
                    </Paper>
                  </Grid>
                </Grid>
              </>
            )}
          </motion.div>
        )}

        {/* Performance Tab */}
        {tabValue === 1 && (
          <motion.div
            key="performance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ 
                  p: 3,
                  borderRadius: iOSStyles.borderRadius.large,
                  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                  border: `1px solid ${iOSStyles.colors.systemGray5}`,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                }}>
                  <Typography variant="h6" gutterBottom>Team Performance</Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Sales Person</TableCell>
                          <TableCell align="right">Visits</TableCell>
                          <TableCell align="right">Conversion</TableCell>
                          <TableCell align="right">Revenue</TableCell>
                          <TableCell align="right">Performance</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {topPerformersData.map((person) => (
                          <TableRow key={person.id} hover>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ bgcolor: iOSStyles.colors.systemBlue }}>
                                  {person.name.charAt(0)}
                                </Avatar>
                                <Box>
                                  <Typography variant="subtitle2">{person.name}</Typography>
                                  <Typography variant="caption" sx={{ color: iOSStyles.colors.secondaryLabel }}>
                                    {person.email}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              <Typography fontWeight="bold">{person.visits}</Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Chip 
                                label={`${person.conversion}%`}
                                size="small"
                                sx={{
                                  backgroundColor: 
                                    person.conversion > 70 ? `${iOSStyles.colors.systemGreen}20` :
                                    person.conversion > 60 ? `${iOSStyles.colors.systemOrange}20` :
                                    `${iOSStyles.colors.systemRed}20`,
                                  color:
                                    person.conversion > 70 ? iOSStyles.colors.systemGreen :
                                    person.conversion > 60 ? iOSStyles.colors.systemOrange :
                                    iOSStyles.colors.systemRed,
                                  fontWeight: 600,
                                }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Typography fontWeight="bold">{formatINR(person.revenue)}</Typography>
                            </TableCell>
                            <TableCell align="right">
                              <LinearProgress 
                                variant="determinate" 
                                value={person.conversion}
                                sx={{ 
                                  height: 6, 
                                  borderRadius: 3,
                                  backgroundColor: iOSStyles.colors.systemGray5,
                                  '& .MuiLinearProgress-bar': {
                                    backgroundColor: 
                                      person.conversion > 70 ? iOSStyles.colors.systemGreen :
                                      person.conversion > 60 ? iOSStyles.colors.systemOrange :
                                      iOSStyles.colors.systemRed,
                                  },
                                }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <IconButton size="small">
                                <MoreVert />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            </Grid>
          </motion.div>
        )}

        {/* AI Insights Tab */}
        {tabValue === 4 && (
          <motion.div
            key="ai-insights"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Paper sx={{ 
              p: 3,
              borderRadius: iOSStyles.borderRadius.large,
              background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
              border: `1px solid ${iOSStyles.colors.systemGray5}`,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <AutoAwesome sx={{ color: iOSStyles.colors.systemPurple, fontSize: 24 }} />
                <Typography variant="h6">AI-Powered Team Insights</Typography>
              </Box>
              
              {stats.topPerformers.length > 0 ? (
                <AIInsights 
                  visitData={stats.topPerformers[0]?.latestVisit || {}}
                  userRole="manager"
                  showTitle={false}
                />
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <AutoAwesome sx={{ fontSize: 48, color: iOSStyles.colors.systemGray4, mb: 2 }} />
                  <Typography variant="body2" sx={{ color: iOSStyles.colors.secondaryLabel }}>
                    No recent visit data available for AI analysis.
                  </Typography>
                </Box>
              )}
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Stats Footer */}
      <Slide direction="up" in={true}>
        <Paper sx={{ 
          mt: 4,
          p: 3,
          borderRadius: iOSStyles.borderRadius.large,
          background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
          border: `1px solid ${iOSStyles.colors.systemGray5}`,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        }}>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: iOSStyles.colors.secondaryLabel, display: 'block' }}>
                  Avg. Deal Size
                </Typography>
                <Typography variant="h6" sx={{ color: iOSStyles.colors.label, fontWeight: 700 }}>
                  {formatINR(45000)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: iOSStyles.colors.secondaryLabel, display: 'block' }}>
                  Pipeline Value
                </Typography>
                <Typography variant="h6" sx={{ color: iOSStyles.colors.label, fontWeight: 700 }}>
                  {formatINR(1250000)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: iOSStyles.colors.secondaryLabel, display: 'block' }}>
                  Win Rate
                </Typography>
                <Typography variant="h6" sx={{ color: iOSStyles.colors.systemGreen, fontWeight: 700 }}>
                  64%
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: iOSStyles.colors.secondaryLabel, display: 'block' }}>
                  Avg. Sales Cycle
                </Typography>
                <Typography variant="h6" sx={{ color: iOSStyles.colors.label, fontWeight: 700 }}>
                  42 days
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Slide>

      {/* Filter Panel */}
      <AnimatePresence>
        {filterOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <Paper
              sx={{
                position: 'absolute',
                top: 120,
                right: isMobile ? 16 : 24,
                width: isMobile ? 'calc(100% - 32px)' : 300,
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
              <Box sx={{ p: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                  Filters
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    mb: 2,
                    borderRadius: iOSStyles.borderRadius.large,
                    backgroundColor: iOSStyles.colors.systemBlue,
                  }}
                >
                  Apply Filters
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{
                    borderRadius: iOSStyles.borderRadius.large,
                    borderColor: iOSStyles.colors.systemGray4,
                  }}
                  onClick={() => setFilterOpen(false)}
                >
                  Close
                </Button>
              </Box>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default ManagerDashboard;