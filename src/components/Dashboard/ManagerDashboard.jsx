import React, { useEffect, useState } from 'react';
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
  Fade,
  Grow,
  Zoom,
  useTheme,
  IconButton,
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
  Refresh,
  MoreVert,
} from '@mui/icons-material';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart as RechartsBarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip as RechartsTooltip, Legend,
  LineChart, Line,
  AreaChart, Area
} from 'recharts';
import { getManagerDashboardStats } from '../../services/dashboardService';
import { SALES_STAGES, SALES_TYPES } from '../../utils/constants';
import AIInsights from '../AI/AIInsights';

const StatsCard = ({ title, value, icon, color, subtext, trend, index }) => (
  <Grow in={true} timeout={200 + (index * 100)}>
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" color="textSecondary" gutterBottom sx={{ 
              fontWeight: 500,
              fontSize: '14px',
              opacity: 0.8,
            }}>
              {title}
            </Typography>
            <Typography variant="h3" component="div" sx={{ 
              fontWeight: 700,
              fontSize: '32px',
              letterSpacing: '-0.02em',
              mb: 1,
            }}>
              {value}
            </Typography>
            {subtext && (
              <Typography variant="body2" color="textSecondary" sx={{ 
                fontSize: '13px',
                opacity: 0.7,
              }}>
                {subtext}
              </Typography>
            )}
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {trend.direction === 'up' ? (
                  <ArrowUpward sx={{ color: '#34C759', fontSize: 16 }} />
                ) : (
                  <ArrowDownward sx={{ color: '#FF3B30', fontSize: 16 }} />
                )}
                <Typography variant="body2" sx={{ 
                  color: trend.direction === 'up' ? '#34C759' : '#FF3B30',
                  ml: 0.5,
                  fontWeight: 600,
                  fontSize: '13px',
                }}>
                  {trend.value}
                </Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ 
            backgroundColor: color + '15',
            borderRadius: '12px',
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 4px 12px ${color}20`,
          }}>
            {React.cloneElement(icon, { 
              sx: { 
                color, 
                fontSize: 24 
              } 
            })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  </Grow>
);

const ManagerDashboard = () => {
  const theme = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setRefreshing(true);
    setError(null);
    
    const result = await getManagerDashboardStats();
    
    console.log('Manager dashboard fetch result:', result);
    
    if (result.success) {
      setStats(result.stats);
    } else {
      setError(result.error || 'Failed to load manager dashboard data');
    }
    
    setLoading(false);
    setRefreshing(false);
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

  const COLORS = ['#007AFF', '#34C759', '#FF9500', '#5856D6', '#FF3B30', '#AF52DE', '#5AC8FA'];
  const SALES_TYPE_COLORS = ['#007AFF', '#34C759', '#FF9500'];

  // Indian Rupee formatter
  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <Fade in={true}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Box sx={{
            width: 60,
            height: 60,
            border: '3px solid rgba(0, 122, 255, 0.2)',
            borderTopColor: '#007AFF',
            borderRadius: '50%',
            animation: 'ios-spin 0.8s linear infinite',
          }} />
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
              onClick={fetchDashboardStats}
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
          Error: {error}
        </Alert>
      </Fade>
    );
  }

  const isEmpty = stats.totalVisitsDone === 0;

  const statCards = [
    {
      title: 'Total Visits',
      value: stats.totalVisitsDone,
      icon: <TrendingUp />,
      color: '#007AFF',
      subtext: `${stats.uniqueCompanies} unique companies`,
    },
    {
      title: 'Total Expenses',
      value: formatINR(stats.totalExpenses),
      icon: <AttachMoney />,
      color: '#FF3B30',
      subtext: `Avg: ${formatINR(stats.avgExpensesPerVisit)}/visit`,
    },
    {
      title: 'Sales Team',
      value: stats.totalSalesPersons,
      icon: <People />,
      color: '#34C759',
      subtext: `${stats.topPerformers.length} active members`,
    },
    {
      title: 'Most Visited',
      value: stats.mostVisitedCustomer.name,
      icon: <Business />,
      color: '#FF9500',
      subtext: `${stats.mostVisitedCustomer.count} visits`,
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
              Manager Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '15px' }}>
              Comprehensive overview of sales team performance
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              icon={<CalendarToday />} 
              label={new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              variant="outlined"
              sx={{ 
                borderRadius: '10px',
                borderColor: 'rgba(0, 122, 255, 0.3)',
                color: '#007AFF',
                fontWeight: 500,
              }}
            />
            <IconButton 
              onClick={fetchDashboardStats}
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
              }}
            >
              {refreshing ? (
                <CircularProgress size={24} color="primary" />
              ) : (
                <Refresh sx={{ color: '#007AFF' }} />
              )}
            </IconButton>
          </Box>
        </Box>

        {isEmpty ? (
          <Zoom in={true}>
            <Paper sx={{ 
              p: 6, 
              textAlign: 'center',
              borderRadius: '20px',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}>
              <Business sx={{ 
                fontSize: 60, 
                color: 'rgba(0, 0, 0, 0.1)',
                mb: 2,
              }} />
              <Typography variant="h5" color="textSecondary" gutterBottom sx={{ fontWeight: 600 }}>
                No Data Available
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Start by having your sales team submit their first visits.
              </Typography>
            </Paper>
          </Zoom>
        ) : (
          <>
            {/* Key Metrics */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {statCards.map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={stat.title}>
                  <StatsCard {...stat} index={index} />
                </Grid>
              ))}
            </Grid>

            {/* Charts Row 1 */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Grow in={true} timeout={600}>
                  <Paper sx={{ 
                    p: 3, 
                    height: '400px',
                    borderRadius: '18px',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <BarChart sx={{ 
                        color: '#007AFF', 
                        mr: 1,
                        fontSize: 24,
                      }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Monthly Performance
                      </Typography>
                    </Box>
                    <ResponsiveContainer width="100%" height="85%">
                      <AreaChart data={stats.monthlyTrends}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.05)" />
                        <XAxis 
                          dataKey="month" 
                          stroke="#8E8E93"
                          fontSize={12}
                        />
                        <YAxis 
                          stroke="#8E8E93"
                          fontSize={12}
                        />
                        <RechartsTooltip 
                          contentStyle={{
                            borderRadius: '12px',
                            border: '1px solid rgba(0, 0, 0, 0.05)',
                            background: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(10px)',
                            fontSize: '13px',
                          }}
                          formatter={(value, name) => {
                            if (name === 'expenses') return [formatINR(value), 'Expenses'];
                            return [value, name];
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="visits" 
                          stackId="1"
                          stroke="#007AFF" 
                          fill="#007AFF" 
                          fillOpacity={0.2}
                          strokeWidth={2}
                          name="Visits"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="uniqueCompanies" 
                          stackId="2"
                          stroke="#34C759" 
                          fill="#34C759" 
                          fillOpacity={0.2}
                          strokeWidth={2}
                          name="Unique Companies"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grow>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Grow in={true} timeout={800}>
                  <Paper sx={{ 
                    p: 3, 
                    height: '400px',
                    borderRadius: '18px',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <PieChartIcon sx={{ 
                        color: '#34C759', 
                        mr: 1,
                        fontSize: 24,
                      }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Sales Stages
                      </Typography>
                    </Box>
                    {getStageData().length > 0 ? (
                      <ResponsiveContainer width="100%" height="85%">
                        <PieChart>
                          <Pie
                            data={getStageData()}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${value}`}
                            outerRadius={100}
                            innerRadius={40}
                            fill="#8884d8"
                            dataKey="value"
                            stroke="rgba(255, 255, 255, 0.8)"
                            strokeWidth={2}
                          >
                            {getStageData().map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={COLORS[index % COLORS.length]} 
                                strokeWidth={2}
                              />
                            ))}
                          </Pie>
                          <RechartsTooltip 
                            contentStyle={{
                              borderRadius: '12px',
                              border: '1px solid rgba(0, 0, 0, 0.05)',
                              background: 'rgba(255, 255, 255, 0.9)',
                              backdropFilter: 'blur(10px)',
                              fontSize: '13px',
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <Box display="flex" justifyContent="center" alignItems="center" height="85%">
                        <Typography color="textSecondary">No stage data available</Typography>
                      </Box>
                    )}
                  </Paper>
                </Grow>
              </Grid>
            </Grid>

            {/* Detailed Tables + AI Insights */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Fade in={true} timeout={1000}>
                  <Paper sx={{ 
                    p: 3,
                    borderRadius: '18px',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                  }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      Stage-wise Details
                    </Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ 
                              fontWeight: 600,
                              color: '#1C1C1E',
                              fontSize: '13px',
                            }}>
                              Stage
                            </TableCell>
                            <TableCell align="right" sx={{ 
                              fontWeight: 600,
                              color: '#1C1C1E',
                              fontSize: '13px',
                            }}>
                              Count
                            </TableCell>
                            <TableCell align="right" sx={{ 
                              fontWeight: 600,
                              color: '#1C1C1E',
                              fontSize: '13px',
                            }}>
                              Percentage
                            </TableCell>
                            <TableCell sx={{ 
                              fontWeight: 600,
                              color: '#1C1C1E',
                              fontSize: '13px',
                            }}>
                              Progress
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {SALES_STAGES.map((stage) => {
                            const count = stats.stageCounts[stage.value] || 0;
                            const percentage = stats.totalVisitsDone > 0 
                              ? ((count / stats.totalVisitsDone) * 100).toFixed(1)
                              : 0;
                            
                            return (
                              <TableRow 
                                key={stage.value}
                                hover
                                sx={{ 
                                  '&:last-child td, &:last-child th': { border: 0 },
                                  transition: 'background-color 0.2s ease',
                                }}
                              >
                                <TableCell>
                                  <Chip
                                    label={stage.label.split('–')[0].trim()}
                                    color="primary"
                                    size="small"
                                    variant="outlined"
                                    sx={{ 
                                      borderRadius: '8px',
                                      borderColor: 'rgba(0, 122, 255, 0.3)',
                                      fontWeight: 500,
                                    }}
                                  />
                                </TableCell>
                                <TableCell align="right">
                                  <Typography fontWeight="bold">{count}</Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography color="textSecondary">{percentage}%</Typography>
                                </TableCell>
                                <TableCell>
                                  <LinearProgress 
                                    variant="determinate" 
                                    value={percentage} 
                                    sx={{ 
                                      height: 8, 
                                      borderRadius: 4,
                                      backgroundColor: 'rgba(0, 122, 255, 0.1)',
                                      '& .MuiLinearProgress-bar': {
                                        borderRadius: 4,
                                        background: 'linear-gradient(90deg, #007AFF 0%, #5856D6 100%)',
                                      },
                                    }}
                                  />
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Fade>
              </Grid>

              <Grid item xs={12} md={6}>
                <Fade in={true} timeout={1200}>
                  <Paper sx={{ 
                    p: 3,
                    borderRadius: '18px',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                  }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      Sales Type Distribution
                    </Typography>
                    {getSalesTypeData().length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <RechartsBarChart data={getSalesTypeData()}>
                          <CartesianGrid 
                            strokeDasharray="3 3" 
                            stroke="rgba(0, 0, 0, 0.05)" 
                            vertical={false}
                          />
                          <XAxis 
                            dataKey="name" 
                            stroke="#8E8E93"
                            fontSize={12}
                          />
                          <YAxis 
                            stroke="#8E8E93"
                            fontSize={12}
                          />
                          <RechartsTooltip 
                            contentStyle={{
                              borderRadius: '12px',
                              border: '1px solid rgba(0, 0, 0, 0.05)',
                              background: 'rgba(255, 255, 255, 0.9)',
                              backdropFilter: 'blur(10px)',
                              fontSize: '13px',
                            }}
                          />
                          <Bar 
                            dataKey="value" 
                            radius={[8, 8, 0, 0]}
                            background={{ fill: 'rgba(0, 0, 0, 0.02)', radius: [8, 8, 0, 0] }}
                          >
                            {getSalesTypeData().map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={SALES_TYPE_COLORS[index % SALES_TYPE_COLORS.length]} 
                              />
                            ))}
                          </Bar>
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    ) : (
                      <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                        <Typography color="textSecondary">No sales type data available</Typography>
                      </Box>
                    )}
                  </Paper>
                </Fade>
              </Grid>

              {/* AI-Powered Team Insights */}
              <Grid item xs={12}>
                <Fade in={true} timeout={1400}>
                  <Paper sx={{ 
                    p: 3,
                    borderRadius: '18px',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                  }}>
                    <Typography variant="h6" gutterBottom sx={{ 
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}>
                      <Assessment sx={{ color: '#5856D6' }} />
                      AI-Powered Team Insights
                    </Typography>
                    {stats.topPerformers.length > 0 ? (
                      <AIInsights 
                        visitData={stats.topPerformers[0]?.latestVisit || {}}
                        userRole="manager"
                        showTitle={false}
                      />
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        No recent visit data available for AI analysis.
                      </Typography>
                    )}
                  </Paper>
                </Fade>
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    </Fade>
  );
};

export default ManagerDashboard;