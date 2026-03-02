import React, { useEffect, useState } from "react";
import {
  Grid, Typography, Box, CircularProgress, Alert, Avatar, 
  LinearProgress, Divider, useTheme, useMediaQuery
} from "@mui/material";
import {
  People, Business, TrendingUp, AttachMoney,
  BarChart, PieChart as PieChartIcon, CorporateFare, Assessment,
  ArrowUpward, ArrowDownward
} from "@mui/icons-material";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend,
  AreaChart, Area,
} from "recharts";
import { getManagerDashboardStats } from "../../services/dashboardService";
import { SALES_STAGES, SALES_TYPES } from "../../utils/constants";
import AIInsights from "../AI/AIInsights";
import { iosColors, iosBorderRadius } from "../../styles/iosTheme";
import { motion } from "framer-motion";

// iOS Style Stat Card
const IOSStatsCard = ({ title, value, icon, color, subtext, trend }) => (
  <motion.div whileTap={{ scale: 0.96 }} transition={{ type: "spring", stiffness: 400, damping: 17 }} style={{ height: '100%' }}>
    <Box sx={{ 
      p: 2.5, height: '100%', bgcolor: iosColors.backgroundSecondary, 
      borderRadius: `${iosBorderRadius.large}px`, display: 'flex', flexDirection: 'column',
      justifyContent: 'space-between', boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
    }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box>
          <Typography sx={{ fontSize: '15px', color: iosColors.secondaryLabel, fontWeight: 500, mb: 0.5 }}>{title}</Typography>
          <Typography sx={{ fontSize: '28px', fontWeight: 700, color: iosColors.label }}>{value}</Typography>
          {subtext && <Typography sx={{ fontSize: '13px', color: iosColors.tertiaryLabel }}>{subtext}</Typography>}
          
          {trend && (
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              {trend.direction === "up" ? <ArrowUpward sx={{ color: iosColors.systemGreen, fontSize: 14 }} /> : <ArrowDownward sx={{ color: iosColors.systemRed, fontSize: 14 }} />}
              <Typography sx={{ fontSize: '13px', color: trend.direction === "up" ? iosColors.systemGreen : iosColors.systemRed, ml: 0.5 }}>
                {trend.value}
              </Typography>
            </Box>
          )}
        </Box>
        <Box sx={{ bgcolor: `${color}15`, borderRadius: 2, p: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {React.cloneElement(icon, { sx: { color, fontSize: 24 } })}
        </Box>
      </Box>
    </Box>
  </motion.div>
);

const ManagerDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { fetchDashboardStats(); }, []);

  const fetchDashboardStats = async () => {
    setLoading(true); setError(null);
    const result = await getManagerDashboardStats();
    if (result.success) setStats(result.stats);
    else setError(result.error || "Failed to load manager dashboard data");
    setLoading(false);
  };

  const getStageData = () => {
    if (!stats?.stageCounts) return [];
    return Object.entries(stats.stageCounts)
      .filter(([_, count]) => count > 0)
      .map(([stage, count]) => ({
        name: SALES_STAGES.find((s) => s.value === stage)?.label.split("–")[0].trim() || stage,
        value: count, stage,
      }));
  };

  const COLORS = [iosColors.systemBlue, iosColors.systemGreen, iosColors.systemOrange, iosColors.systemPurple, iosColors.systemPink, iosColors.systemTeal];

  const formatINR = (amount) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount || 0);
  };

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh"><CircularProgress sx={{ color: iosColors.systemGray }} /></Box>;
  if (error) return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;

  const isEmpty = stats.totalVisitsDone === 0;

  // iOS Panel Wrapper
  const IOSPanel = ({ title, icon, children, noPadding = false }) => (
    <Box sx={{ mb: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography sx={{ ml: 2, mb: 1, fontSize: '13px', textTransform: 'uppercase', color: iosColors.secondaryLabel, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
        {icon && React.cloneElement(icon, { sx: { fontSize: 16 } })} {title}
      </Typography>
      <Box sx={{ 
        bgcolor: iosColors.backgroundSecondary, 
        borderRadius: `${iosBorderRadius.large}px`, 
        p: noPadding ? 0 : 3, 
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)', 
        flexGrow: 1 
      }}>
        {children}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ pb: 4 }}>
      {!isMobile && (
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, px: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, fontSize: '34px', letterSpacing: '-0.02em' }}>
            Manager Overview
          </Typography>
        </Box>
      )}

      {isEmpty ? (
        <Box sx={{ bgcolor: iosColors.backgroundSecondary, p: 6, textAlign: "center", borderRadius: `${iosBorderRadius.large}px` }}>
          <Business sx={{ fontSize: 60, color: iosColors.systemGray3, mb: 2 }} />
          <Typography sx={{ fontSize: '20px', fontWeight: 600, color: iosColors.label, mb: 1 }}>No Data Available</Typography>
          <Typography sx={{ color: iosColors.secondaryLabel }}>Start by having your sales team submit visits.</Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={6} md={3}><IOSStatsCard title="Total Visits" value={stats.totalVisitsDone} icon={<TrendingUp />} color={iosColors.systemBlue} subtext={`${stats.uniqueCompanies} unique companies`} /></Grid>
            <Grid item xs={6} md={3}><IOSStatsCard title="Expenses" value={formatINR(stats.totalExpenses)} icon={<AttachMoney />} color={iosColors.systemRed} subtext={`Avg: ${formatINR(stats.avgExpensesPerVisit)}/visit`} /></Grid>
            <Grid item xs={6} md={3}><IOSStatsCard title="Sales Team" value={stats.totalSalesPersons} icon={<People />} color={iosColors.systemGreen} subtext={`${stats.topPerformers.length} active`} /></Grid>
            <Grid item xs={6} md={3}><IOSStatsCard title="Top Client" value={stats.mostVisitedCustomer.name} icon={<Business />} color={iosColors.systemOrange} subtext={`${stats.mostVisitedCustomer.count} visits`} /></Grid>
          </Grid>

          <Grid container spacing={3}>
          <Grid item xs={12}>
            <IOSPanel title="Monthly Performance" icon={<BarChart />}>
              <Box sx={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke={iosColors.systemGray5} vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: iosColors.secondaryLabel, fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: iosColors.secondaryLabel, fontSize: 12}} width={40} />
                    <RechartsTooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Area
                      type="monotone"
                      dataKey="visits"
                      stroke={iosColors.systemBlue}
                      fill={iosColors.systemBlue}
                      fillOpacity={0.2}
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </IOSPanel>
          </Grid>

          {/* Sales Stages - Full Row */}
          <Grid item xs={12}>
            <IOSPanel title="Sales Stages" icon={<PieChartIcon />}>
              <Box sx={{ height: 380, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getStageData()}
                      cx="50%"
                      cy="42%"
                      innerRadius={85}
                      outerRadius={130}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {getStageData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>

                    <RechartsTooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                      }}
                    />

                    <Legend
                      iconType="circle"
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      wrapperStyle={{
                        fontSize: "14px",
                        paddingTop: "20px"
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </IOSPanel>
          </Grid>

            {/* List Panels Row */}
            <Grid item xs={12} md={6}>
              <IOSPanel title="Top Performers" icon={<Assessment />} noPadding={true}>
                <Box sx={{ py: 1 }}>
                  {stats.topPerformers.map((performer, index) => (
                    <Box key={performer.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, px: 3 }}>
                        <Avatar sx={{ bgcolor: COLORS[index % COLORS.length], width: 40, height: 40, mr: 2, fontSize: '16px' }}>
                          {performer.email.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography sx={{ fontWeight: 600, fontSize: '16px' }}>{performer.email.split("@")[0]}</Typography>
                          <Typography sx={{ fontSize: '13px', color: iosColors.secondaryLabel }}>{performer.companyCount} companies</Typography>
                        </Box>
                        <Typography sx={{ fontWeight: 600, color: iosColors.systemBlue }}>{performer.visitCount} visits</Typography>
                      </Box>
                      {index < stats.topPerformers.length - 1 && <Divider sx={{ ml: 9 }} />}
                    </Box>
                  ))}
                </Box>
              </IOSPanel>
            </Grid>

            <Grid item xs={12} md={6}>
              <IOSPanel title="Top Companies" icon={<CorporateFare />} noPadding={true}>
                <Box sx={{ py: 1 }}>
                  {stats.topCustomers.map((customer, index) => (
                    <Box key={customer.name}>
                      <Box sx={{ p: 2, px: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography sx={{ fontWeight: 600, fontSize: '16px' }}>{customer.name}</Typography>
                          <Typography sx={{ fontWeight: 600, color: iosColors.systemBlue }}>{customer.count} visits</Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={(customer.count / stats.mostVisitedCustomer.count) * 100} 
                          sx={{ height: 6, borderRadius: 3, bgcolor: iosColors.systemGray6, '& .MuiLinearProgress-bar': { bgcolor: iosColors.systemBlue } }}
                        />
                      </Box>
                      {index < stats.topCustomers.length - 1 && <Divider sx={{ ml: 3 }} />}
                    </Box>
                  ))}
                </Box>
              </IOSPanel>
            </Grid>

            <Grid item xs={12}>
               <IOSPanel title="AI Team Insights">
                 {stats.topPerformers.length > 0 ? (
                  <AIInsights visitData={stats.topPerformers[0]?.latestVisit || {}} userRole="manager" showTitle={false} />
                ) : (
                  <Typography sx={{ color: iosColors.secondaryLabel }}>No recent visit data available for AI analysis.</Typography>
                )}
               </IOSPanel>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default ManagerDashboard;
