import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Button,
  TextField,
  Grid,
  Chip,
  IconButton,
  MenuItem,
  InputAdornment,
  Card,
  CardContent,
  Collapse,
  Divider,
} from '@mui/material';
import {
  Search,
  FilterList,
  Download,
  Refresh,
  ExpandMore,
  Person,
  Business,
  CalendarToday,
  LocationOn,
  Description,
  CheckCircle,
  PendingActions,
  AttachMoney,
} from '@mui/icons-material';
import { getAllVisits } from '../../services/visitService';
import { exportToExcel } from '../../utils/exportToExcel';
import { useAuth } from '../../context/AuthContext';
import { VISIT_PURPOSES, CUSTOMER_SENTIMENTS } from '../../utils/constants';
import useHaptic from '../../hooks/useHaptic';

// iOS-style Visit Card
const VisitCard = ({ visit, index }) => {
  const { impactLight } = useHaptic();
  const [expanded, setExpanded] = useState(false);

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'Positive':
        return 'success';
      case 'Neutral':
        return 'warning';
      case 'Negative':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Card
        sx={{
          mb: 2,
          borderRadius: 3,
          border: 1,
          borderColor: 'divider',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(-2px)',
          },
        }}
      >
        <CardContent>
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 2,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Business sx={{ color: 'primary.main', fontSize: 20 }} />
                <Typography variant="h6" fontWeight={600}>
                  {visit.customerCompany}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Person sx={{ color: 'text.secondary', fontSize: 16 }} />
                <Typography variant="body2" color="text.secondary">
                  {visit.customerName}
                </Typography>
              </Box>
            </Box>

            <Chip
              label={visit.customerSentiment}
              color={getSentimentColor(visit.customerSentiment)}
              size="small"
              sx={{ fontWeight: 600 }}
            />
          </Box>

          {/* Quick Info */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  {formatDate(visit.visitDate)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary" noWrap>
                  {visit.location}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Tags */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            <Chip
              label={visit.visitPurpose}
              size="small"
              variant="outlined"
              sx={{ fontSize: '11px' }}
            />
            {visit.expenses > 0 && (
              <Chip
                icon={<AttachMoney />}
                label={formatINR(visit.expenses)}
                size="small"
                variant="outlined"
                color="warning"
                sx={{ fontSize: '11px' }}
              />
            )}
          </Box>

          {/* Expand Button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              fullWidth
              variant="outlined"
              endIcon={
                <motion.div
                  animate={{ rotate: expanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ExpandMore />
                </motion.div>
              }
              onClick={() => {
                impactLight();
                setExpanded(!expanded);
              }}
              sx={{ borderRadius: 2 }}
            >
              {expanded ? 'Show Less' : 'Show Details'}
            </Button>
          </motion.div>

          {/* Expanded Content */}
          <Collapse in={expanded} timeout="auto">
            <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    Discussion Points
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {visit.discussionPoints}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    Action Items
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: 'pre-line' }}>
                    {visit.actionItems}
                  </Typography>
                </Grid>

                {visit.followUpDate && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      Follow-up Date
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {formatDate(visit.followUpDate)}
                    </Typography>
                  </Grid>
                )}

                {visit.expenseDetails && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      Expense Details
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {visit.expenseDetails}
                    </Typography>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    Submitted By
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {visit.repEmail}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const VisitReport = ({ isManager }) => {
  const { user } = useAuth();
  const { impactLight, impactMedium } = useHaptic();
  
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPurpose, setFilterPurpose] = useState('');
  const [filterSentiment, setFilterSentiment] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchVisits();
  }, [user, isManager]);

  const fetchVisits = async () => {
    setLoading(true);
    setError(null);

    const result = await getAllVisits(isManager ? null : user?.uid);

    if (result.success) {
      setVisits(result.visits);
    } else {
      setError(result.error || 'Failed to load visits');
    }

    setLoading(false);
  };

  const handleRefresh = () => {
    impactMedium();
    fetchVisits();
  };

  const handleExport = () => {
    impactMedium();
    if (filteredVisits.length === 0) {
      alert('No visits to export');
      return;
    }
    exportToExcel(filteredVisits, 'Visit_Reports');
  };

  // Filter visits
  const filteredVisits = visits.filter((visit) => {
    const matchesSearch =
      visit.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.customerCompany?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.location?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPurpose = !filterPurpose || visit.visitPurpose === filterPurpose;
    const matchesSentiment = !filterSentiment || visit.customerSentiment === filterSentiment;

    return matchesSearch && matchesPurpose && matchesSentiment;
  });

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="60vh">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <CircularProgress size={60} thickness={4} />
          <Typography sx={{ mt: 3, color: 'text.secondary', fontWeight: 500 }}>
            Loading visit reports...
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
          sx={{ mt: 2, borderRadius: 2 }}
          action={
            <Button color="inherit" size="small" onClick={handleRefresh}>
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
    <Box>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h4" fontWeight={700}>
                Visit Reports 📋
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {filteredVisits.length} {filteredVisits.length === 1 ? 'visit' : 'visits'} found
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <IconButton
                  onClick={handleRefresh}
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

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <IconButton
                  onClick={handleExport}
                  sx={{
                    bgcolor: 'background.paper',
                    boxShadow: 1,
                    border: 1,
                    borderColor: 'divider',
                    '&:hover': { bgcolor: 'success.main', color: 'white' },
                  }}
                >
                  <Download />
                </IconButton>
              </motion.div>
            </Box>
          </Box>
        </Box>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <Paper
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 3,
            border: 1,
            borderColor: 'divider',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search by customer, company, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'background.default',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant={showFilters ? 'contained' : 'outlined'}
                    startIcon={<FilterList />}
                    onClick={() => {
                      impactLight();
                      setShowFilters(!showFilters);
                    }}
                  >
                    Filters
                  </Button>
                </motion.div>
              </Box>
            </Grid>
          </Grid>

          {/* Filter Options */}
          <Collapse in={showFilters}>
            <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Visit Purpose"
                    value={filterPurpose}
                    onChange={(e) => setFilterPurpose(e.target.value)}
                    size="small"
                  >
                    <MenuItem value="">All Purposes</MenuItem>
                    {VISIT_PURPOSES.map((purpose) => (
                      <MenuItem key={purpose} value={purpose}>
                        {purpose}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Customer Sentiment"
                    value={filterSentiment}
                    onChange={(e) => setFilterSentiment(e.target.value)}
                    size="small"
                  >
                    <MenuItem value="">All Sentiments</MenuItem>
                    {CUSTOMER_SENTIMENTS.map((sentiment) => (
                      <MenuItem key={sentiment} value={sentiment}>
                        {sentiment}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>

              {(filterPurpose || filterSentiment || searchTerm) && (
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    size="small"
                    onClick={() => {
                      impactLight();
                      setSearchTerm('');
                      setFilterPurpose('');
                      setFilterSentiment('');
                    }}
                  >
                    Clear Filters
                  </Button>
                </Box>
              )}
            </Box>
          </Collapse>
        </Paper>
      </motion.div>

      {/* Visit Cards */}
      <AnimatePresence>
        {filteredVisits.length > 0 ? (
          filteredVisits.map((visit, index) => (
            <VisitCard key={visit.id} visit={visit} index={index} />
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Paper
              sx={{
                p: 6,
                textAlign: 'center',
                borderRadius: 3,
                border: 1,
                borderColor: 'divider',
              }}
            >
              <Description sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom fontWeight={600}>
                No Visits Found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {searchTerm || filterPurpose || filterSentiment
                  ? 'Try adjusting your filters'
                  : 'Start by submitting your first visit report'}
              </Typography>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default VisitReport;
