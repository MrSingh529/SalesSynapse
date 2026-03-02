import React, { useEffect, useState } from "react";
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
} from "@mui/material";
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
} from "@mui/icons-material";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";

import { getManagerDashboardStats } from "../../services/dashboardService";

import { SALES_STAGES, SALES_TYPES } from "../../utils/constants";

import AIInsights from "../AI/AIInsights"; // Added AI Insights component

const StatsCard = ({ title, value, icon, color, subtext, trend }) => (
  <Card sx={{ height: "100%" }}>
    <CardContent>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Box>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            {title}
          </Typography>

          <Typography variant="h4" component="div">
            {value}
          </Typography>

          {subtext && (
            <Typography variant="body2" color="textSecondary">
              {subtext}
            </Typography>
          )}

          {trend && (
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              {trend.direction === "up" ? (
                <ArrowUpward sx={{ color: "#4caf50", fontSize: 16 }} />
              ) : (
                <ArrowDownward sx={{ color: "#f44336", fontSize: 16 }} />
              )}

              <Typography
                variant="body2"
                sx={{
                  color: trend.direction === "up" ? "#4caf50" : "#f44336",

                  ml: 0.5,
                }}
              >
                {trend.value}
              </Typography>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            backgroundColor: `${color}15`,

            borderRadius: "50%",

            p: 1.5,

            display: "flex",

            alignItems: "center",

            justifyContent: "center",
          }}
        >
          {React.cloneElement(icon, {
            sx: { color, fontSize: 28 },
          })}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const ManagerDashboard = () => {
  const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);

    setError(null);

    const result = await getManagerDashboardStats();

    console.log("Manager dashboard fetch result:", result);

    if (result.success) {
      setStats(result.stats);
    } else {
      setError(result.error || "Failed to load manager dashboard data");
    }

    setLoading(false);
  };

  const getStageData = () => {
    if (!stats?.stageCounts) return [];

    return Object.entries(stats.stageCounts)

      .filter(([_, count]) => count > 0)

      .map(([stage, count]) => ({
        name:
          SALES_STAGES.find((s) => s.value === stage)?.label.split("–")[0] ||
          stage,

        value: count,

        stage,
      }));
  };

  const getSalesTypeData = () => {
    if (!stats?.salesTypeCounts) return [];

    return Object.entries(stats.salesTypeCounts)

      .filter(([_, count]) => count > 0)

      .map(([type, count]) => ({
        name: SALES_TYPES.find((t) => t.value === type)?.label || type,

        value: count,

        type,
      }));
  };

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#FFC658",
  ];

  const SALES_TYPE_COLORS = ["#3f51b5", "#4caf50", "#ff9800"];

  // Indian Rupee formatter

  const formatINR = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",

      currency: "INR",

      minimumFractionDigits: 0,

      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
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
          <button
            onClick={fetchDashboardStats}
            style={{
              background: "none",
              border: "none",
              color: "inherit",
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        }
      >
        Error: {error}
      </Alert>
    );
  }

  const isEmpty = stats.totalVisitsDone === 0;

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Manager Dashboard
        </Typography>

        <Chip
          icon={<CalendarToday />}
          label={new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          variant="outlined"
        />
      </Box>

      {isEmpty ? (
        <Paper sx={{ p: 6, textAlign: "center" }}>
          <Business sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />

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
                color="#3f51b5"
                subtext={`${stats.uniqueCompanies} unique companies`}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                title="Total Expenses"
                value={formatINR(stats.totalExpenses)}
                icon={<AttachMoney />}
                color="#f44336"
                subtext={`Avg: ${formatINR(stats.avgExpensesPerVisit)}/visit`}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                title="Sales Team"
                value={stats.totalSalesPersons}
                icon={<People />}
                color="#4caf50"
                subtext={`${stats.topPerformers.length} active members`}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                title="Most Visited"
                value={stats.mostVisitedCustomer.name}
                icon={<Business />}
                color="#ff9800"
                subtext={`${stats.mostVisitedCustomer.count} visits`}
              />
            </Grid>
          </Grid>

          {/* Charts Row 1 */}

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: "400px" }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <BarChart sx={{ color: "#3f51b5", mr: 1 }} />

                  <Typography variant="h6">Monthly Performance</Typography>
                </Box>

                <ResponsiveContainer width="100%" height="85%">
                  <AreaChart data={stats.monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

                    <XAxis dataKey="month" />

                    <YAxis />

                    <RechartsTooltip
                      formatter={(value, name) => {
                        if (name === "expenses")
                          return [formatINR(value), "Expenses"];

                        return [value, name];
                      }}
                    />

                    <Area
                      type="monotone"
                      dataKey="visits"
                      stackId="1"
                      stroke="#3f51b5"
                      fill="#3f51b5"
                      fillOpacity={0.6}
                      name="Visits"
                    />

                    <Area
                      type="monotone"
                      dataKey="uniqueCompanies"
                      stackId="2"
                      stroke="#4caf50"
                      fill="#4caf50"
                      fillOpacity={0.6}
                      name="Unique Companies"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: "400px" }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <PieChartIcon sx={{ color: "#4caf50", mr: 1 }} />

                  <Typography variant="h6">Sales Stages</Typography>
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
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {getStageData().map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>

                      <RechartsTooltip />

                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="85%"
                  >
                    <Typography color="textSecondary">
                      No stage data available
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>

          {/* Charts Row 2 */}

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: "350px" }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Assessment sx={{ color: "#ff9800", mr: 1 }} />

                  <Typography variant="h6">Top Performers</Typography>
                </Box>

                <List>
                  {stats.topPerformers.map((performer, index) => (
                    <React.Fragment key={performer.id}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar
                            sx={{ bgcolor: COLORS[index % COLORS.length] }}
                          >
                            {performer.email.charAt(0).toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>

                        <ListItemText
                          primary={
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Typography variant="subtitle2">
                                {performer.email.split("@")[0]}
                              </Typography>

                              <Typography variant="body2" fontWeight="bold">
                                {performer.visitCount} visits
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="caption" display="block">
                                {performer.companyCount} companies
                              </Typography>

                              <Typography variant="caption" display="block">
                                {formatINR(performer.totalExpenses)} expenses
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>

                      {index < stats.topPerformers.length - 1 && (
                        <Divider variant="inset" component="li" />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: "350px" }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <CorporateFare sx={{ color: "#9c27b0", mr: 1 }} />

                  <Typography variant="h6">Top Companies</Typography>
                </Box>

                <List>
                  {stats.topCustomers.map((customer, index) => (
                    <React.Fragment key={customer.name}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              bgcolor: COLORS[(index + 2) % COLORS.length],
                            }}
                          >
                            {customer.name.charAt(0).toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>

                        <ListItemText
                          primary={
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Typography variant="subtitle2">
                                {customer.name}
                              </Typography>

                              <Typography variant="body2" fontWeight="bold">
                                {customer.count} visits
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <LinearProgress
                              variant="determinate"
                              value={
                                (customer.count /
                                  stats.mostVisitedCustomer.count) *
                                100
                              }
                              sx={{ mt: 1, height: 6, borderRadius: 3 }}
                            />
                          }
                        />
                      </ListItem>

                      {index < stats.topCustomers.length - 1 && (
                        <Divider variant="inset" component="li" />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: "350px" }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <ShowChart sx={{ color: "#00bcd4", mr: 1 }} />

                  <Typography variant="h6">Budget Analysis</Typography>
                </Box>

                <Box sx={{ p: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Paper
                        sx={{ p: 2, textAlign: "center", bgcolor: "#e8f5e9" }}
                      >
                        <Typography variant="h5" color="#4caf50">
                          {formatINR(stats.budgetStats.avgBudget)}
                        </Typography>

                        <Typography variant="caption">
                          Avg. Deal Size
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={6}>
                      <Paper
                        sx={{ p: 2, textAlign: "center", bgcolor: "#fff3e0" }}
                      >
                        <Typography variant="h5" color="#ff9800">
                          {stats.budgetStats.dealsWithBudget}
                        </Typography>

                        <Typography variant="caption">
                          Deals with Budget
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" gutterBottom>
                          Total Pipeline Value
                        </Typography>

                        <Typography variant="h6" color="primary">
                          {formatINR(stats.budgetStats.totalBudget)}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" gutterBottom>
                          Range
                        </Typography>

                        <Typography variant="body2">
                          {formatINR(stats.budgetStats.minBudget)} -{" "}
                          {formatINR(stats.budgetStats.maxBudget)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Detailed Tables + AI Insights */}

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Stage-wise Details
                </Typography>

                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Stage</TableCell>

                        <TableCell align="right">Count</TableCell>

                        <TableCell align="right">Percentage</TableCell>

                        <TableCell>Progress</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {SALES_STAGES.map((stage) => {
                        const count = stats.stageCounts[stage.value] || 0;

                        const percentage =
                          stats.totalVisitsDone > 0
                            ? ((count / stats.totalVisitsDone) * 100).toFixed(1)
                            : 0;

                        return (
                          <TableRow key={stage.value}>
                            <TableCell>
                              <Chip
                                label={stage.label.split("–")[0].trim()}
                                color="primary"
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>

                            <TableCell align="right">
                              <Typography fontWeight="bold">{count}</Typography>
                            </TableCell>

                            <TableCell align="right">
                              <Typography color="textSecondary">
                                {percentage}%
                              </Typography>
                            </TableCell>

                            <TableCell>
                              <LinearProgress
                                variant="determinate"
                                value={percentage}
                                sx={{ height: 8, borderRadius: 4 }}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Sales Type Distribution
                </Typography>

                {getSalesTypeData().length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getSalesTypeData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

                      <XAxis dataKey="name" />

                      <YAxis />

                      <RechartsTooltip />

                      <Bar
                        dataKey="value"
                        fill="#3f51b5"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height={300}
                  >
                    <Typography color="textSecondary">
                      No sales type data available
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>

            {/* AI-Powered Team Insights */}

            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
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
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default ManagerDashboard;