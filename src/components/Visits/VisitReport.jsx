import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  TablePagination,
  TextField,
  Button,
  IconButton,
  Chip,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Badge,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  AutoAwesome,
  FilterList,
  Download,
  Visibility,
  DateRange as DateRangeIcon,
  Business,
  Person,
  Phone,
  Email,
  AttachMoney,
  Assignment,
  CalendarToday,
  TrendingUp,
  Description,
  Contacts,
  Receipt,
  CheckCircle,
  ExpandMore,
  LocationOn,
  Chat,
  Note,
  Assessment,
  Edit
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { getVisitsBySalesPerson, getAllVisits } from '../../services/visitService';
import { useAuth } from '../../context/AuthContext';
import { SALES_STAGES, SALES_TYPES } from '../../utils/constants';
import { exportToExcel } from '../../utils/exportToExcel';
import AIInsights from '../AI/AIInsights';
import AIActionItems from '../AI/AIActionItems';
// Helper function for INR formatting
const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount || 0);
};
// Helper to get stage label
const getStageLabel = (stageValue) => {
  const stage = SALES_STAGES.find(s => s.value === stageValue);
  return stage ? stage.label : stageValue || 'Unknown';
};
// Helper to get sales type label
const getSalesTypeLabel = (typeValue) => {
  const type = SALES_TYPES.find(t => t.value === typeValue);
  return type ? type.label : typeValue || 'Unknown';
};
const VisitReport = ({ isManager = false }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [visits, setVisits] = useState([]);
  const [filteredVisits, setFilteredVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  // Filters
  const [filters, setFilters] = useState({
    companyName: '',
    salesType: '',
    salesStage: '',
    startDate: null,
    endDate: null
  });
  useEffect(() => {
    console.log('User:', user);
    fetchVisits();
  }, [user]);
  useEffect(() => {
    applyFilters();
  }, [visits, filters]);
  const fetchVisits = async () => {
    if (!user) {
      console.log('No user found');
      setLoading(false);
      return;
    }
    console.log('Fetching visits for user:', user.uid, user.email);
    setLoading(true);
    setError(null);
    let result;
    if (isManager) {
      console.log('Fetching all visits (manager view)');
      result = await getAllVisits();
    } else {
      console.log('Fetching visits for sales person');
      result = await getVisitsBySalesPerson(user.uid);
    }
    console.log('Fetch result:', result);
    if (result.success) {
      setVisits(result.visits);
      setFilteredVisits(result.visits);
      console.log('Visits set:', result.visits.length, 'visits');
    } else {
      setError(result.error || 'Failed to fetch visits');
      console.error('Error fetching visits:', result.error);
    }
    setLoading(false);
  };
  const applyFilters = () => {
    let filtered = [...visits];
    if (filters.companyName) {
      filtered = filtered.filter(visit =>
        visit.companyName?.toLowerCase().includes(filters.companyName.toLowerCase())
      );
    }
    if (filters.salesType) {
      filtered = filtered.filter(visit => visit.salesType === filters.salesType);
    }
    if (filters.salesStage) {
      filtered = filtered.filter(visit => visit.salesStage === filters.salesStage);
    }
    if (filters.startDate) {
      filtered = filtered.filter(visit => {
        const visitDate = visit.createdAt?.toDate();
        return visitDate && visitDate >= filters.startDate;
      });
    }
    if (filters.endDate) {
      filtered = filtered.filter(visit => {
        const visitDate = visit.createdAt?.toDate();
        return visitDate && visitDate <= filters.endDate;
      });
    }
    setFilteredVisits(filtered);
    setPage(0);
  };
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };
  const clearFilters = () => {
    setFilters({
      companyName: '',
      salesType: '',
      salesStage: '',
      startDate: null,
      endDate: null
    });
  };
  const handleExport = () => {
    const data = filteredVisits.map(visit => {
      // Get expense details
      let travelExpense = 0;
      let foodExpense = 0;
      let accommodationExpense = 0;
      let miscellaneousExpense = 0;
      let totalExpense = 0;

      if (visit.expenses && typeof visit.expenses === 'object') {
        travelExpense = visit.expenses.travel || 0;
        foodExpense = visit.expenses.food || 0;
        accommodationExpense = visit.expenses.accommodation || 0;
        miscellaneousExpense = visit.expenses.miscellaneous || 0;
        totalExpense = visit.expenses.total || 0;
      } else if (typeof visit.expenses === 'number') {
        totalExpense = visit.expenses;
      }

      return {
        'Company Name': visit.companyName || 'N/A',
        'Date': visit.createdAt?.toDate?.().toLocaleDateString() || 'N/A',
        'Sales Person': visit.salesPersonEmail || 'N/A',
        'Sales Type': getSalesTypeLabel(visit.salesType),
        'Sales Stage': getStageLabel(visit.salesStage),
        'Lead Name': visit.leadName || 'N/A',
        'Estimated Budget (₹)': visit.estimatedBudget || 0,
        'Travel Expenses (₹)': travelExpense,
        'Food Expenses (₹)': foodExpense,
        'Accommodation Expenses (₹)': accommodationExpense,
        'Miscellaneous Expenses (₹)': miscellaneousExpense,
        'Total Expenses (₹)': totalExpense,
        'Objective': visit.objective || '',
        'Outcome': visit.outcome || '',
        'Discussion Details': visit.discussionDetails || '',
        'Additional Notes': visit.additionalNotes || ''
      };
    });
    exportToExcel(data, 'visits_report');
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const getStageColor = (stage) => {
    const colors = {
      'stage_0': 'default',
      'stage_1': 'primary',
      'stage_2': 'info',
      'stage_3': 'warning',
      'stage_4': 'secondary',
      'stage_5': 'success',
      'stage_6': 'error',
      'stage_7': 'success'
    };
    return colors[stage] || 'default';
  };
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  // Get stage progress
  const getStageProgress = (stageValue) => {
    const stageIndex = SALES_STAGES.findIndex(s => s.value === stageValue);
    return stageIndex >= 0 ? ((stageIndex + 1) / SALES_STAGES.length) * 100 : 0;
  };
  // Check if current user can edit this visit
  const canEditVisit = (visit) => {
    if (!user || !visit) return false;
    return visit.salesPersonId === user.uid;
  };
  // Handle edit visit
  const handleEditVisit = () => {
    if (selectedVisit && canEditVisit(selectedVisit)) {
      console.log("Editing visit", selectedVisit.id);
      setSelectedVisit(null);
      navigate(`/edit-visit/${selectedVisit.id}`);
    }
  };
  // Loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading visits...</Typography>
      </Box>
    );
  }
  // Error state
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Error loading visits: {error}
      </Alert>
    );
  }
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between', 
          mb: 3,
          gap: isMobile ? 2 : 0
        }}>
          <Typography variant={isMobile ? "h5" : "h4"}>
            {isManager ? 'All Visits Report' : 'My Visits Report'}
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            gap: 1,
            flexDirection: isMobile ? 'column' : 'row'
          }}>
            <Button
              startIcon={<FilterList />}
              onClick={() => setFilterOpen(true)}
              disabled={visits.length === 0}
              fullWidth={isMobile}
              size={isMobile ? "medium" : "small"}
            >
              Filters
            </Button>
            <Button
              startIcon={<Download />}
              variant="contained"
              onClick={handleExport}
              disabled={filteredVisits.length === 0}
              fullWidth={isMobile}
              size={isMobile ? "medium" : "small"}
            >
              Export
            </Button>
          </Box>
        </Box>
        {/* Filters Dialog - Mobile optimized */}
        <Dialog 
          open={filterOpen} 
          onClose={() => setFilterOpen(false)} 
          maxWidth="sm" 
          fullWidth
          fullScreen={isMobile}
        >
          <DialogTitle>Filter Visits</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Company Name"
                  value={filters.companyName}
                  onChange={(e) => handleFilterChange('companyName', e.target.value)}
                  size={isMobile ? "medium" : "small"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Sales Type</InputLabel>
                  <Select
                    value={filters.salesType}
                    label="Sales Type"
                    onChange={(e) => handleFilterChange('salesType', e.target.value)}
                    size={isMobile ? "medium" : "small"}
                  >
                    <MenuItem value="">All</MenuItem>
                    {SALES_TYPES.map(type => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Sales Stage</InputLabel>
                  <Select
                    value={filters.salesStage}
                    label="Sales Stage"
                    onChange={(e) => handleFilterChange('salesStage', e.target.value)}
                    size={isMobile ? "medium" : "small"}
                  >
                    <MenuItem value="">All</MenuItem>
                    {SALES_STAGES.map(stage => (
                      <MenuItem key={stage.value} value={stage.value}>
                        {stage.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Start Date"
                  value={filters.startDate}
                  onChange={(date) => handleFilterChange('startDate', date)}
                  slotProps={{ 
                    textField: { 
                      fullWidth: true,
                      size: isMobile ? "medium" : "small"
                    } 
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="End Date"
                  value={filters.endDate}
                  onChange={(date) => handleFilterChange('endDate', date)}
                  slotProps={{ 
                    textField: { 
                      fullWidth: true,
                      size: isMobile ? "medium" : "small"
                    } 
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={clearFilters}>Clear All</Button>
            <Button onClick={() => setFilterOpen(false)}>Close</Button>
            <Button onClick={applyFilters} variant="contained">Apply Filters</Button>
          </DialogActions>
        </Dialog>
        {/* Active Filters */}
        {Object.values(filters).some(val => val !== null && val !== '') && (
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Active Filters:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {filters.companyName && (
                <Chip
                  label={`Company: ${filters.companyName}`}
                  onDelete={() => handleFilterChange('companyName', '')}
                  size={isMobile ? "medium" : "small"}
                />
              )}
              {filters.salesType && (
                <Chip
                  label={`Type: ${SALES_TYPES.find(t => t.value === filters.salesType)?.label}`}
                  onDelete={() => handleFilterChange('salesType', '')}
                  size={isMobile ? "medium" : "small"}
                />
              )}
              {filters.salesStage && (
                <Chip
                  label={`Stage: ${SALES_STAGES.find(s => s.value === filters.salesStage)?.label}`}
                  onDelete={() => handleFilterChange('salesStage', '')}
                  size={isMobile ? "medium" : "small"}
                />
              )}
              {filters.startDate && (
                <Chip
                  label={`From: ${filters.startDate.toLocaleDateString()}`}
                  onDelete={() => handleFilterChange('startDate', null)}
                  size={isMobile ? "medium" : "small"}
                />
              )}
              {filters.endDate && (
                <Chip
                  label={`To: ${filters.endDate.toLocaleDateString()}`}
                  onDelete={() => handleFilterChange('endDate', null)}
                  size={isMobile ? "medium" : "small"}
                />
              )}
            </Box>
          </Paper>
        )}
        {/* Empty States */}
        {visits.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No visits found
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              {isManager
                ? 'No visits have been submitted by the sales team yet.'
                : 'You haven\'t submitted any visits yet. Click "New Visit" to get started.'}
            </Typography>
            {!isManager && (
              <Button variant="contained" href="/new-visit">
                Submit Your First Visit
              </Button>
            )}
          </Paper>
        ) : filteredVisits.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No matching visits
            </Typography>
            <Typography variant="body2" color="textSecondary">
              No visits match your current filters. Try adjusting your filters.
            </Typography>
            <Button onClick={clearFilters} sx={{ mt: 2 }}>
              Clear All Filters
            </Button>
          </Paper>
        ) : (
          <>
            {/* Visits Table - Mobile optimized */}
            <Paper sx={{ overflowX: 'auto' }}>
              <TableContainer>
                <Table size={isMobile ? "small" : "medium"}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Company</TableCell>
                      {isManager && <TableCell>Sales Person</TableCell>}
                      {!isMobile && <TableCell>Lead Name</TableCell>}
                      {!isMobile && <TableCell>Sales Type</TableCell>}
                      <TableCell>Stage</TableCell>
                      {!isMobile && <TableCell>Budget</TableCell>}
                      {!isMobile && <TableCell>Expenses</TableCell>}
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredVisits
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((visit) => {
                        // Calculate expenses for display
                        let displayExpenses = 0;
                        if (typeof visit.expenses === 'object' && visit.expenses !== null) {
                          displayExpenses = visit.expenses.total || 0;
                        } else if (typeof visit.expenses === 'number') {
                          displayExpenses = visit.expenses;
                        }

                        let displayBudget = 0;
                        if (typeof visit.estimatedBudget === 'number') {
                          displayBudget = visit.estimatedBudget;
                        }

                        return (
                          <TableRow key={visit.id} hover>
                            <TableCell>
                              {visit.createdAt?.toDate ? 
                                isMobile ? 
                                  visit.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) :
                                  visit.createdAt.toDate().toLocaleDateString() 
                                : 'N/A'}
                            </TableCell>
                            <TableCell>
                              <Typography variant={isMobile ? "body2" : "body1"}>
                                {visit.companyName || 'N/A'}
                              </Typography>
                              {isMobile && visit.leadName && (
                                <Typography variant="caption" color="textSecondary" display="block">
                                  {visit.leadName}
                                </Typography>
                              )}
                            </TableCell>
                            {isManager && (
                              <TableCell>
                                <Typography variant={isMobile ? "body2" : "body1"}>
                                  {visit.salesPersonEmail ? visit.salesPersonEmail.split('@')[0] : 'N/A'}
                                </Typography>
                              </TableCell>
                            )}
                            {!isMobile && (
                              <>
                                <TableCell>{visit.leadName || 'N/A'}</TableCell>
                                <TableCell>
                                  {getSalesTypeLabel(visit.salesType)}
                                </TableCell>
                              </>
                            )}
                            <TableCell>
                              <Chip
                                label={getStageLabel(visit.salesStage).split('–')[0].trim()}
                                color={getStageColor(visit.salesStage)}
                                size="small"
                              />
                            </TableCell>
                            {!isMobile && (
                              <>
                                <TableCell>
                                  {formatINR(displayBudget)}
                                </TableCell>
                                <TableCell>
                                  {formatINR(displayExpenses)}
                                </TableCell>
                              </>
                            )}
                            <TableCell>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setSelectedVisit(visit);
                                  setTabValue(0);
                                }}
                                color="primary"
                              >
                                <Visibility />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredVisits.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage={isMobile ? "Rows:" : "Rows per page:"}
              />
            </Paper>
          </>
        )}
        {/* Enhanced Visit Details Dialog - Mobile Responsive */}
        <Dialog
          open={!!selectedVisit}
          onClose={() => setSelectedVisit(null)}
          maxWidth="lg"
          fullWidth
          fullScreen={isMobile}
          PaperProps={{
            sx: {
              borderRadius: isMobile ? 0 : 2,
              maxHeight: isMobile ? '100vh' : '90vh'
            }
          }}
        >
          {selectedVisit && (
            <>
              <DialogTitle sx={{ 
                bgcolor: 'primary.main', 
                color: 'white',
                py: isMobile ? 3 : 2
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Business sx={{ fontSize: isMobile ? 24 : 28 }} />
                    <Box>
                      <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold">
                        {selectedVisit.companyName || 'Unnamed Company'}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.9 }}>
                        Visit Details • {selectedVisit.createdAt?.toDate?.().toLocaleDateString() || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                  {!isMobile && (
                    <Chip
                      label={getSalesTypeLabel(selectedVisit.salesType)}
                      color="secondary"
                      sx={{ color: 'white', fontWeight: 'bold' }}
                    />
                  )}
                </Box>
              </DialogTitle>
              <DialogContent sx={{ p: 0 }}>
                {/* Tabs for different sections - Mobile optimized */}
                <Tabs 
                  value={tabValue} 
                  onChange={handleTabChange}
                  variant={isMobile ? "scrollable" : "standard"}
                  scrollButtons="auto"
                  allowScrollButtonsMobile
                  sx={{ 
                    borderBottom: 1, 
                    borderColor: 'divider',
                    px: isMobile ? 1 : 3,
                    pt: 2
                  }}
                >
                  <Tab icon={isMobile ? <Description fontSize="small" /> : <Description />} label="Overview" />
                  <Tab icon={isMobile ? <Receipt fontSize="small" /> : <Receipt />} label="Expenses" />
                  <Tab icon={isMobile ? <Contacts fontSize="small" /> : <Contacts />} label="Contacts" />
                  <Tab icon={isMobile ? <Assignment fontSize="small" /> : <Assignment />} label="Actions" />
                  <Tab icon={isMobile ? <Assessment fontSize="small" /> : <Assessment />} label="Progress" />
                  <Tab icon={isMobile ? <AutoAwesome fontSize="small" /> : <AutoAwesome />} label="AI Insights" /> {/* Add this tab */}
                </Tabs>
                <Box sx={{ p: isMobile ? 2 : 3 }}>
                  {/* Overview Tab */}
                  {tabValue === 0 && (
                    <Grid container spacing={isMobile ? 2 : 3}>
                      {/* Left Column - Basic Info */}
                      <Grid item xs={12} md={6}>
                        <Card variant="outlined" sx={{ mb: 3 }}>
                          <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CalendarToday fontSize="small" />
                              Visit Information
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="textSecondary">
                                  <Person fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                                  Sales Person
                                </Typography>
                                <Typography variant="body1">
                                  {selectedVisit.salesPersonEmail || 'N/A'}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="textSecondary">
                                  <Business fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                                  Lead Name
                                </Typography>
                                <Typography variant="body1">
                                  {selectedVisit.leadName || 'N/A'}
                                </Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography variant="subtitle2" color="textSecondary">
                                  <TrendingUp fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                                  Sales Stage
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1, flexDirection: isMobile ? 'column' : 'row' }}>
                                  <Chip
                                    label={getStageLabel(selectedVisit.salesStage)}
                                    color={getStageColor(selectedVisit.salesStage)}
                                    size={isMobile ? "small" : "medium"}
                                    sx={{ mb: isMobile ? 1 : 0 }}
                                  />
                                  <LinearProgress 
                                    variant="determinate" 
                                    value={getStageProgress(selectedVisit.salesStage)}
                                    sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                                  />
                                </Box>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography variant="subtitle2" color="textSecondary">
                                  <AttachMoney fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                                  Estimated Budget
                                </Typography>
                                <Typography variant={isMobile ? "h6" : "h5"} color="primary">
                                  {formatINR(selectedVisit.estimatedBudget)}
                                </Typography>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                        {/* Discussion Details */}
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chat fontSize="small" />
                              Discussion Details
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <Accordion defaultExpanded={!isMobile}>
                              <AccordionSummary expandIcon={<ExpandMore />}>
                                <Typography variant="subtitle1">Objective/Agenda</Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Typography variant="body2" color="textSecondary" sx={{ whiteSpace: 'pre-wrap' }}>
                                  {selectedVisit.objective || 'No objective provided'}
                                </Typography>
                              </AccordionDetails>
                            </Accordion>

                            <Accordion>
                              <AccordionSummary expandIcon={<ExpandMore />}>
                                <Typography variant="subtitle1">Outcome</Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Typography variant="body2" color="textSecondary" sx={{ whiteSpace: 'pre-wrap' }}>
                                  {selectedVisit.outcome || 'No outcome recorded'}
                                </Typography>
                              </AccordionDetails>
                            </Accordion>

                            <Accordion>
                              <AccordionSummary expandIcon={<ExpandMore />}>
                                <Typography variant="subtitle1">Discussion Notes</Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Typography variant="body2" color="textSecondary" sx={{ whiteSpace: 'pre-wrap' }}>
                                  {selectedVisit.discussionDetails || 'No discussion details'}
                                </Typography>
                              </AccordionDetails>
                            </Accordion>

                            <Accordion>
                              <AccordionSummary expandIcon={<ExpandMore />}>
                                <Typography variant="subtitle1">Additional Notes</Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Typography variant="body2" color="textSecondary" sx={{ whiteSpace: 'pre-wrap' }}>
                                  {selectedVisit.additionalNotes || 'No additional notes'}
                                </Typography>
                              </AccordionDetails>
                            </Accordion>
                          </CardContent>
                        </Card>
                      </Grid>
                      {/* Right Column - Quick Stats */}
                      <Grid item xs={12} md={6}>
                        {/* Expense Summary */}
                        <Card variant="outlined" sx={{ mb: 3 }}>
                          <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Receipt fontSize="small" />
                              Expense Summary
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            {selectedVisit.expenses && typeof selectedVisit.expenses === 'object' ? (
                              <Grid container spacing={2}>
                                {[['Travel', selectedVisit.expenses.travel], 
                                  ['Food', selectedVisit.expenses.food], 
                                  ['Accommodation', selectedVisit.expenses.accommodation], 
                                  ['Misc', selectedVisit.expenses.miscellaneous]].map(([label, value], index) => (
                                  <Grid item xs={6} key={index}>
                                    <Paper sx={{ p: isMobile ? 1 : 2, textAlign: 'center', bgcolor: '#f5f5f5' }}>
                                      <Typography variant={isMobile ? "caption" : "body2"} color="textSecondary">{label}</Typography>
                                      <Typography variant={isMobile ? "body1" : "h6"}>{formatINR(value)}</Typography>
                                    </Paper>
                                  </Grid>
                                ))}
                                <Grid item xs={12}>
                                  <Paper sx={{ 
                                    p: isMobile ? 2 : 2, 
                                    textAlign: 'center', 
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    mt: 2
                                  }}>
                                    <Typography variant={isMobile ? "body1" : "body2"}>Total Expenses</Typography>
                                    <Typography variant={isMobile ? "h5" : "h4"}>{formatINR(selectedVisit.expenses.total)}</Typography>
                                  </Paper>
                                </Grid>
                              </Grid>
                            ) : (
                              <Typography color="textSecondary">No expense details available</Typography>
                            )}
                          </CardContent>
                        </Card>
                        {/* Action Items Summary */}
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Assignment fontSize="small" />
                              Action Items Summary
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            {selectedVisit.actionable?.length > 0 ? (
                              <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 1 : 0 }}>
                                  <Typography variant="body2">
                                    Total: {selectedVisit.actionable.length}
                                  </Typography>
                                  <Typography variant="body2" color="success.main">
                                    Completed: {selectedVisit.actionable.filter(a => a.completed).length}
                                  </Typography>
                                </Box>
                                <List dense>
                                  {selectedVisit.actionable.slice(0, isMobile ? 2 : 3).map((item, index) => (
                                    <ListItem key={index}>
                                      <ListItemAvatar>
                                        <Avatar sx={{ 
                                          bgcolor: item.completed ? 'success.main' : 'warning.main',
                                          width: isMobile ? 20 : 24, 
                                          height: isMobile ? 20 : 24,
                                          fontSize: isMobile ? '0.75rem' : '0.875rem'
                                        }}>
                                          {item.completed ? <CheckCircle fontSize="small" /> : index + 1}
                                        </Avatar>
                                      </ListItemAvatar>
                                      <ListItemText
                                        primary={
                                          <Typography variant={isMobile ? "body2" : "body1"}>
                                            {item.task.length > (isMobile ? 40 : 60) 
                                              ? `${item.task.substring(0, isMobile ? 40 : 60)}...` 
                                              : item.task}
                                          </Typography>
                                        }
                                        secondary={
                                          <Typography variant="caption">
                                            {item.completed ? 'Completed' : 'Pending'}
                                          </Typography>
                                        }
                                      />
                                    </ListItem>
                                  ))}
                                </List>
                                {selectedVisit.actionable.length > (isMobile ? 2 : 3) && (
                                  <Typography variant="body2" color="primary" align="center" sx={{ mt: 1 }}>
                                    + {selectedVisit.actionable.length - (isMobile ? 2 : 3)} more items
                                  </Typography>
                                )}
                              </Box>
                            ) : (
                              <Typography color="textSecondary">No action items</Typography>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  )}
                  {/* Expenses Tab */}
                  {tabValue === 1 && (
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Detailed Expense Breakdown
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        {selectedVisit.expenses && typeof selectedVisit.expenses === 'object' ? (
                          <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                              <Typography variant="subtitle1" gutterBottom>Expense Categories</Typography>
                              <List>
                                {[['Travel Expenses', selectedVisit.expenses.travel],
                                  ['Food & Beverages', selectedVisit.expenses.food],
                                  ['Accommodation', selectedVisit.expenses.accommodation],
                                  ['Miscellaneous', selectedVisit.expenses.miscellaneous]].map(([label, value], index) => (
                                  <ListItem key={index} sx={{ py: 1 }}>
                                    <ListItemText primary={label} />
                                    <Typography variant="body1" fontWeight="bold">
                                      {formatINR(value)}
                                    </Typography>
                                  </ListItem>
                                ))}
                              </List>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Paper sx={{ 
                                p: isMobile ? 3 : 4, 
                                textAlign: 'center',
                                bgcolor: 'primary.main',
                                color: 'white',
                                borderRadius: 2
                              }}>
                                <Typography variant={isMobile ? "h6" : "h5"}>Total Expenses</Typography>
                                <Typography variant={isMobile ? "h4" : "h2"} fontWeight="bold" sx={{ my: 2 }}>
                                  {formatINR(selectedVisit.expenses.total)}
                                </Typography>
                                <Typography variant="caption">
                                  All expenses are in INR
                                </Typography>
                              </Paper>
                            </Grid>
                          </Grid>
                        ) : (
                          <Typography color="textSecondary">No expense details available</Typography>
                        )}
                      </CardContent>
                    </Card>
                  )}
                  {/* Contacts Tab */}
                  {tabValue === 2 && (
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Contact Persons
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        {selectedVisit.contacts?.length > 0 ? (
                          <Grid container spacing={3}>
                            {selectedVisit.contacts.map((contact, index) => (
                              <Grid item xs={12} md={6} key={index}>
                                <Paper sx={{ p: 3, borderRadius: 2 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                    <Avatar sx={{ 
                                      bgcolor: 'primary.main', 
                                      width: isMobile ? 48 : 56, 
                                      height: isMobile ? 48 : 56 
                                    }}>
                                      {contact.name ? contact.name.charAt(0).toUpperCase() : '?'}
                                    </Avatar>
                                    <Box sx={{ flexGrow: 1 }}>
                                      <Typography variant={isMobile ? "subtitle1" : "h6"}>
                                        {contact.name || 'Unnamed Contact'}
                                      </Typography>
                                      <Typography variant="body2" color="textSecondary">
                                        {contact.designation || 'No designation'}
                                      </Typography>
                                      <Box sx={{ mt: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                          <Phone fontSize="small" />
                                          <Typography variant="body2">
                                            {contact.mobile || 'No phone number'}
                                          </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                          <Email fontSize="small" />
                                          <Typography variant="body2">
                                            {contact.email || 'No email'}
                                          </Typography>
                                        </Box>
                                      </Box>
                                    </Box>
                                  </Box>
                                </Paper>
                              </Grid>
                            ))}
                          </Grid>
                        ) : (
                          <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
                            No contacts recorded for this visit
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  )}
                  {/* Action Items Tab */}
                  {tabValue === 3 && (
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Action Items
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        {selectedVisit.actionable?.length > 0 ? (
                          <List>
                            {selectedVisit.actionable.map((item, index) => (
                              <Paper key={index} sx={{ mb: 2, p: 2 }}>
                                <Box sx={{ 
                                  display: 'flex', 
                                  alignItems: isMobile ? 'flex-start' : 'center', 
                                  gap: 2,
                                  flexDirection: isMobile ? 'column' : 'row'
                                }}>
                                  <Badge
                                    color={item.completed ? "success" : "warning"}
                                    badgeContent={item.completed ? "✓" : "!"}
                                    sx={{ '& .MuiBadge-badge': { 
                                      fontSize: isMobile ? 14 : 16, 
                                      height: isMobile ? 20 : 24, 
                                      minWidth: isMobile ? 20 : 24 
                                    } }}
                                  >
                                    <Avatar sx={{ 
                                      bgcolor: item.completed ? 'success.main' : 'warning.main',
                                      width: isMobile ? 36 : 40, 
                                      height: isMobile ? 36 : 40 
                                    }}>
                                      {index + 1}
                                    </Avatar>
                                  </Badge>
                                  <Box sx={{ flexGrow: 1, width: isMobile ? '100%' : 'auto' }}>
                                    <Typography variant={isMobile ? "body1" : "subtitle1"}>
                                      {item.task}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                      Status: {item.completed ? 'Completed' : 'Pending'}
                                    </Typography>
                                  </Box>
                                  <Chip
                                    label={item.completed ? 'Completed' : 'Pending'}
                                    color={item.completed ? 'success' : 'warning'}
                                    size={isMobile ? "small" : "medium"}
                                    sx={{ mt: isMobile ? 1 : 0 }}
                                  />
                                </Box>
                              </Paper>
                            ))}
                          </List>
                        ) : (
                          <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
                            No action items for this visit
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  )}
                  {/* Sales Progress Tab */}
                  {tabValue === 4 && (
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Sales Pipeline Progress
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        <Box sx={{ mb: 4 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">Current Stage</Typography>
                            <Typography variant="body2" fontWeight="bold">
                              {getStageLabel(selectedVisit.salesStage)}
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={getStageProgress(selectedVisit.salesStage)}
                            sx={{ height: 10, borderRadius: 5 }}
                          />
                          <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                            {Math.round(getStageProgress(selectedVisit.salesStage))}% complete
                          </Typography>
                        </Box>
                        <Stepper 
                          activeStep={SALES_STAGES.findIndex(s => s.value === selectedVisit.salesStage)} 
                          orientation={isMobile ? "vertical" : "horizontal"}
                          alternativeLabel={!isMobile}
                        >
                          {SALES_STAGES.slice(0, isMobile ? 8 : 5).map((stage) => (
                            <Step key={stage.value}>
                              <StepLabel>
                                {isMobile ? stage.label.split('–')[0] : stage.label.split('–')[0]}
                              </StepLabel>
                            </Step>
                          ))}
                        </Stepper>
                        <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
                          <Typography variant="subtitle1" gutterBottom>Deal Information</Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="textSecondary">Sales Type</Typography>
                              <Typography variant="body1">{getSalesTypeLabel(selectedVisit.salesType)}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="textSecondary">Estimated Budget</Typography>
                              <Typography variant="h6" color="primary">{formatINR(selectedVisit.estimatedBudget)}</Typography>
                            </Grid>
                          </Grid>
                        </Box>
                      </CardContent>
                    </Card>
                  )}
                  {/* AI Insights Tab */}
                    {tabValue === 5 && (
                      <Box sx={{ p: isMobile ? 1 : 2 }}>
                        <AIInsights 
                          visitData={selectedVisit} 
                          userRole={isManager ? 'manager' : 'sales'}
                          showTitle={false}
                        />

                        <Divider sx={{ my: 3 }} />

                        <AIActionItems 
                          visitData={selectedVisit}
                          userRole={isManager ? 'manager' : 'sales'}
                          showTitle={false}
                        />
                      </Box>
                  )}
                </Box>
              </DialogContent>
              <DialogActions sx={{ 
                p: 2, 
                borderTop: 1, 
                borderColor: 'divider',
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? 1 : 0
              }}>
                <Button 
                  onClick={() => setSelectedVisit(null)}
                  variant="outlined"
                  fullWidth={isMobile}
                >
                  Close
                </Button>
                {canEditVisit(selectedVisit) && (
                  <Button 
                    variant="contained"
                    onClick={handleEditVisit}
                    startIcon={<Edit />}
                    fullWidth={isMobile}
                  >
                    Edit Visit
                  </Button>
                )}
              </DialogActions>
            </>
          )}
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};
export default VisitReport;