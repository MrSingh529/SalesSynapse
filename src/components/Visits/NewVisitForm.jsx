import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Typography,
  Paper,
  IconButton,
  Card,
  CardContent,
  Divider,
  Chip,
  Fade,
  Slide,
  Zoom,
  Grow,
  Collapse,
  useTheme,
  useMediaQuery,
  Alert,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon,
  AttachMoney,
  AutoAwesome,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Error as ErrorIcon,
  Business,
  Person,
  Phone,
  Email,
  LocationOn,
  Description,
  Schedule,
  TrendingUp,
  ArrowForward,
  ArrowBack
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { SALES_TYPES, SALES_STAGES } from '../../utils/constants';
import { generateActionableItems } from '../../services/openAIService';
import { iOSStyles, iOSUtils } from '../../utils/iosAnimations';
import useIOSAnimations from '../../hooks/useIOSAnimations';
import { motion, AnimatePresence } from 'framer-motion';

const NewVisitForm = ({ onSubmit, loading }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    companyName: '',
    visitDate: new Date(),
    visitTime: new Date(),
    objective: '',
    outcome: '',
    leadName: '',
    estimatedBudget: '',
    
    salesType: '',
    salesStage: '',
    
    discussionDetails: '',
    actionable: [{ task: '', completed: false }],
    additionalNotes: '',
    
    contacts: [{ 
      name: '', 
      designation: '', 
      mobile: '', 
      email: '',
      isPrimary: true 
    }],
    expenses: {
      travel: 0,
      food: 0,
      accommodation: 0,
      miscellaneous: 0
    }
  });

  const [aiLoading, setAiLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [completedSteps, setCompletedSteps] = useState([]);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const { hapticFeedback, pressAnimation, shakeAnimation } = useIOSAnimations();
  const formRef = useRef(null);
  const stepRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const steps = [
    { label: 'Visit Details', icon: <Business /> },
    { label: 'Sales Data', icon: <TrendingUp /> },
    { label: 'Notes & Actions', icon: <Description /> },
    { label: 'Contacts & Expenses', icon: <Person /> }
  ];

  // Calculate total expenses
  const totalExpenses = Object.values(formData.expenses).reduce((sum, value) => {
    return sum + (parseFloat(value) || 0);
  }, 0);

  const validateStep = (step) => {
    const errors = {};
    
    switch (step) {
      case 0:
        if (!formData.companyName) errors.companyName = 'Company name is required';
        if (!formData.leadName) errors.leadName = 'Lead name is required';
        if (!formData.objective) errors.objective = 'Objective is required';
        if (!formData.estimatedBudget || parseFloat(formData.estimatedBudget) <= 0) {
          errors.estimatedBudget = 'Valid budget is required';
        }
        break;
      case 1:
        if (!formData.salesType) errors.salesType = 'Sales type is required';
        if (!formData.salesStage) errors.salesStage = 'Sales stage is required';
        break;
      case 2:
        if (formData.actionable.some(item => !item.task.trim())) {
          errors.actionable = 'All action items must have a description';
        }
        break;
      case 3:
        if (!formData.contacts[0]?.name || !formData.contacts[0]?.email) {
          errors.contacts = 'At least one contact with name and email is required';
        }
        break;
    }
    
    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      hapticFeedback('error');
      return false;
    }
    
    return true;
  };

  const handleNext = () => {
    if (!validateStep(activeStep)) {
      // Shake the step container
      if (stepRefs[activeStep].current) {
        shakeAnimation(stepRefs[activeStep].current);
      }
      return;
    }
    
    hapticFeedback('light');
    
    // Mark step as completed
    if (!completedSteps.includes(activeStep)) {
      setCompletedSteps([...completedSteps, activeStep]);
    }
    
    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    hapticFeedback('light');
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleExpenseChange = (category, value) => {
    setFormData(prev => ({
      ...prev,
      expenses: {
        ...prev.expenses,
        [category]: parseFloat(value) || 0
      }
    }));
  };

  const handleContactChange = (index, field, value) => {
    const updatedContacts = [...formData.contacts];
    updatedContacts[index] = { ...updatedContacts[index], [field]: value };
    setFormData(prev => ({ ...prev, contacts: updatedContacts }));
    
    if (formErrors.contacts) {
      setFormErrors(prev => ({ ...prev, contacts: null }));
    }
  };

  const addContact = () => {
    hapticFeedback('light');
    setFormData(prev => ({
      ...prev,
      contacts: [...prev.contacts, { 
        name: '', 
        designation: '', 
        mobile: '', 
        email: '',
        isPrimary: false 
      }]
    }));
  };

  const removeContact = (index) => {
    hapticFeedback('light');
    if (formData.contacts.length > 1) {
      const updatedContacts = formData.contacts.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, contacts: updatedContacts }));
    }
  };

  const handleActionableChange = (index, value) => {
    const updatedActionable = [...formData.actionable];
    updatedActionable[index] = { task: value, completed: false };
    setFormData(prev => ({ ...prev, actionable: updatedActionable }));
    
    if (formErrors.actionable) {
      setFormErrors(prev => ({ ...prev, actionable: null }));
    }
  };

  const addActionable = () => {
    hapticFeedback('light');
    setFormData(prev => ({
      ...prev,
      actionable: [...prev.actionable, { task: '', completed: false }]
    }));
  };

  const removeActionable = (index) => {
    hapticFeedback('light');
    if (formData.actionable.length > 1) {
      const updatedActionable = formData.actionable.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, actionable: updatedActionable }));
    }
  };

  const handleAISuggestions = async () => {
    if (!process.env.REACT_APP_OPENAI_API_KEY) {
      alert('OpenAI API key not configured. Please add REACT_APP_OPENAI_API_KEY to your .env file.');
      return;
    }
    
    if (!formData.companyName || !formData.objective) {
      alert('Please enter company name and meeting objective to get relevant AI suggestions.');
      return;
    }
    
    setAiLoading(true);
    hapticFeedback('light');
    
    try {
      const aiItems = await generateActionableItems(formData);
      
      if (aiItems && aiItems.length > 0) {
        const updatedActionable = [...formData.actionable.filter(item => item.task.trim() !== ''), ...aiItems];
        setFormData(prev => ({ ...prev, actionable: updatedActionable }));
        
        hapticFeedback('success');
        // Show success animation
      } else {
        hapticFeedback('error');
        alert('No actionable items were suggested by AI. Try adding more details to the objective.');
      }
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      hapticFeedback('error');
      alert('Unable to get AI suggestions. Please check your connection and try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!validateStep(activeStep)) return;
    
    const filteredActionable = formData.actionable.filter(item => item.task.trim() !== '');
    const filteredContacts = formData.contacts.filter(contact => 
      contact.name.trim() !== '' || contact.email.trim() !== ''
    );
    
    const submissionData = {
      ...formData,
      actionable: filteredActionable,
      contacts: filteredContacts,
      estimatedBudget: parseFloat(formData.estimatedBudget) || 0,
      totalExpenses: totalExpenses,
      visitDate: formData.visitDate instanceof Date ? formData.visitDate : new Date(formData.visitDate)
    };
    
    onSubmit(submissionData);
  };

  // Step 1: Visit Details
  const renderStep1 = () => (
    <motion.div
      ref={stepRefs[0]}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Company Name"
              value={formData.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
              required
              error={!!formErrors.companyName}
              helperText={formErrors.companyName}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Business sx={{ color: iOSStyles.colors.systemGray }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: iOSStyles.borderRadius.medium,
                  backgroundColor: iOSStyles.colors.systemGray6,
                  '&:hover': {
                    backgroundColor: iOSStyles.colors.systemGray5,
                  },
                  '&.Mui-focused': {
                    backgroundColor: iOSStyles.colors.systemBackground,
                    boxShadow: `0 0 0 4px ${iOSStyles.colors.systemBlue}20`,
                  },
                },
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Visit Date"
              value={formData.visitDate}
              onChange={(date) => handleChange('visitDate', date)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                  InputProps: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Schedule sx={{ color: iOSStyles.colors.systemGray }} />
                      </InputAdornment>
                    ),
                  },
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      borderRadius: iOSStyles.borderRadius.medium,
                      backgroundColor: iOSStyles.colors.systemGray6,
                    },
                  },
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TimePicker
              label="Visit Time"
              value={formData.visitTime}
              onChange={(time) => handleChange('visitTime', time)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  InputProps: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Schedule sx={{ color: iOSStyles.colors.systemGray }} />
                      </InputAdornment>
                    ),
                  },
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      borderRadius: iOSStyles.borderRadius.medium,
                      backgroundColor: iOSStyles.colors.systemGray6,
                    },
                  },
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Lead Name"
              value={formData.leadName}
              onChange={(e) => handleChange('leadName', e.target.value)}
              required
              error={!!formErrors.leadName}
              helperText={formErrors.leadName}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: iOSStyles.colors.systemGray }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: iOSStyles.borderRadius.medium,
                  backgroundColor: iOSStyles.colors.systemGray6,
                },
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Meeting Objective/Agenda"
              multiline
              rows={3}
              value={formData.objective}
              onChange={(e) => handleChange('objective', e.target.value)}
              required
              error={!!formErrors.objective}
              helperText={formErrors.objective}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: iOSStyles.borderRadius.medium,
                  backgroundColor: iOSStyles.colors.systemGray6,
                },
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Outcome"
              multiline
              rows={2}
              value={formData.outcome}
              onChange={(e) => handleChange('outcome', e.target.value)}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: iOSStyles.borderRadius.medium,
                  backgroundColor: iOSStyles.colors.systemGray6,
                },
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Budget Estimation (in ₹)"
              type="number"
              value={formData.estimatedBudget}
              onChange={(e) => handleChange('estimatedBudget', e.target.value)}
              required
              error={!!formErrors.estimatedBudget}
              helperText={formErrors.estimatedBudget}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoney sx={{ color: iOSStyles.colors.systemGray }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: iOSStyles.borderRadius.medium,
                  backgroundColor: iOSStyles.colors.systemGray6,
                },
              }}
            />
          </Grid>
        </Grid>
      </LocalizationProvider>
    </motion.div>
  );

  // Step 2: Sales Data
  const renderStep2 = () => (
    <motion.div
      ref={stepRefs[1]}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ color: iOSStyles.colors.secondaryLabel, mb: 2 }}>
            Sales Information
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required error={!!formErrors.salesType}>
            <InputLabel>Sales Type</InputLabel>
            <Select
              value={formData.salesType}
              label="Sales Type"
              onChange={(e) => handleChange('salesType', e.target.value)}
              sx={{
                borderRadius: iOSStyles.borderRadius.medium,
                backgroundColor: iOSStyles.colors.systemGray6,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: formErrors.salesType ? iOSStyles.colors.systemRed : iOSStyles.colors.systemGray4,
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: formErrors.salesType ? iOSStyles.colors.systemRed : iOSStyles.colors.systemGray3,
                },
              }}
            >
              <MenuItem value="">Select Type</MenuItem>
              {SALES_TYPES.map(type => (
                <MenuItem key={type.value} value={type.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {type.icon}
                    {type.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
            {formErrors.salesType && (
              <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                {formErrors.salesType}
              </Typography>
            )}
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required error={!!formErrors.salesStage}>
            <InputLabel>Sales Stage</InputLabel>
            <Select
              value={formData.salesStage}
              label="Sales Stage"
              onChange={(e) => handleChange('salesStage', e.target.value)}
              sx={{
                borderRadius: iOSStyles.borderRadius.medium,
                backgroundColor: iOSStyles.colors.systemGray6,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: formErrors.salesStage ? iOSStyles.colors.systemRed : iOSStyles.colors.systemGray4,
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: formErrors.salesStage ? iOSStyles.colors.systemRed : iOSStyles.colors.systemGray3,
                },
              }}
            >
              <MenuItem value="">Select Stage</MenuItem>
              {SALES_STAGES.map(stage => (
                <MenuItem key={stage.value} value={stage.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {stage.icon}
                    {stage.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
            {formErrors.salesStage && (
              <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                {formErrors.salesStage}
              </Typography>
            )}
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <Paper sx={{ 
            p: 3, 
            mt: 2,
            borderRadius: iOSStyles.borderRadius.medium,
            backgroundColor: `${iOSStyles.colors.systemBlue}10`,
            border: `1px solid ${iOSStyles.colors.systemBlue}30`,
          }}>
            <Typography variant="body2" sx={{ color: iOSStyles.colors.systemBlue, fontWeight: 500 }}>
              💡 Tip: Select the appropriate sales stage to track your progress accurately in the pipeline.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </motion.div>
  );

  // Step 3: Notes & Actions
  const renderStep3 = () => (
    <motion.div
      ref={stepRefs[2]}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Discussion Details"
            multiline
            rows={4}
            value={formData.discussionDetails}
            onChange={(e) => handleChange('discussionDetails', e.target.value)}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: iOSStyles.borderRadius.medium,
                backgroundColor: iOSStyles.colors.systemGray6,
              },
            }}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Card variant="outlined" sx={{ 
            borderRadius: iOSStyles.borderRadius.large,
            borderColor: formErrors.actionable ? iOSStyles.colors.systemRed : iOSStyles.colors.systemGray5,
            backgroundColor: iOSStyles.colors.systemGray6,
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  Actionable Points
                </Typography>
                
                <Button
                  startIcon={<AutoAwesome />}
                  onClick={handleAISuggestions}
                  variant="outlined"
                  size="small"
                  disabled={aiLoading || loading}
                  sx={{
                    borderRadius: iOSStyles.borderRadius.medium,
                    borderColor: iOSStyles.colors.systemPurple,
                    color: iOSStyles.colors.systemPurple,
                    '&:hover': {
                      backgroundColor: `${iOSStyles.colors.systemPurple}10`,
                      borderColor: iOSStyles.colors.systemPurple,
                    },
                  }}
                >
                  {aiLoading ? 'Generating...' : 'AI Suggestions'}
                </Button>
              </Box>
              
              {formErrors.actionable && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: iOSStyles.borderRadius.medium }}>
                  {formErrors.actionable}
                </Alert>
              )}
              
              <AnimatePresence>
                {formData.actionable.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          backgroundColor: `${iOSStyles.colors.systemBlue}20`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: iOSStyles.colors.systemBlue,
                          fontWeight: 600,
                          fontSize: '14px',
                        }}
                      >
                        {index + 1}
                      </Box>
                      
                      <TextField
                        fullWidth
                        label={`Actionable Point ${index + 1}`}
                        value={item.task}
                        onChange={(e) => handleActionableChange(index, e.target.value)}
                        placeholder="Enter actionable item..."
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: iOSStyles.borderRadius.medium,
                            backgroundColor: iOSStyles.colors.systemBackground,
                          },
                        }}
                      />
                      
                      <IconButton
                        onClick={() => removeActionable(index)}
                        disabled={formData.actionable.length === 1}
                        size="small"
                        sx={{
                          backgroundColor: `${iOSStyles.colors.systemRed}20`,
                          color: iOSStyles.colors.systemRed,
                          '&:hover': {
                            backgroundColor: `${iOSStyles.colors.systemRed}30`,
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              <Button
                startIcon={<AddIcon />}
                onClick={addActionable}
                variant="outlined"
                fullWidth
                sx={{
                  mt: 2,
                  borderRadius: iOSStyles.borderRadius.medium,
                  borderColor: iOSStyles.colors.systemGray4,
                  color: iOSStyles.colors.label,
                  '&:hover': {
                    borderColor: iOSStyles.colors.systemGray3,
                    backgroundColor: iOSStyles.colors.systemGray6,
                  },
                }}
              >
                Add Actionable Point
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Additional Notes"
            multiline
            rows={3}
            value={formData.additionalNotes}
            onChange={(e) => handleChange('additionalNotes', e.target.value)}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: iOSStyles.borderRadius.medium,
                backgroundColor: iOSStyles.colors.systemGray6,
              },
            }}
          />
        </Grid>
      </Grid>
    </motion.div>
  );

  // Step 4: Contact Details & Expenses
  const renderStep4 = () => (
    <motion.div
      ref={stepRefs[3]}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Grid container spacing={3}>
        {/* Contact Details Section */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Person />
            Contact Details
          </Typography>
          
          {formErrors.contacts && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: iOSStyles.borderRadius.medium }}>
              {formErrors.contacts}
            </Alert>
          )}
          
          <AnimatePresence>
            {formData.contacts.map((contact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Card variant="outlined" sx={{ 
                  mb: 2,
                  borderRadius: iOSStyles.borderRadius.large,
                  backgroundColor: iOSStyles.colors.systemGray6,
                  borderColor: contact.isPrimary ? `${iOSStyles.colors.systemBlue}40` : iOSStyles.colors.systemGray5,
                  position: 'relative',
                }}>
                  {contact.isPrimary && (
                    <Chip
                      label="Primary"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: -10,
                        right: 16,
                        backgroundColor: iOSStyles.colors.systemBlue,
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '10px',
                      }}
                    />
                  )}
                  
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle1">
                        Contact {index + 1}
                      </Typography>
                      {formData.contacts.length > 1 && (
                        <IconButton 
                          onClick={() => removeContact(index)}
                          size="small"
                          sx={{
                            backgroundColor: `${iOSStyles.colors.systemRed}20`,
                            color: iOSStyles.colors.systemRed,
                            '&:hover': {
                              backgroundColor: `${iOSStyles.colors.systemRed}30`,
                            },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Box>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Name *"
                          value={contact.name}
                          onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                          required={contact.isPrimary}
                          variant="outlined"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Person sx={{ color: iOSStyles.colors.systemGray }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: iOSStyles.borderRadius.medium,
                              backgroundColor: iOSStyles.colors.systemBackground,
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Designation"
                          value={contact.designation}
                          onChange={(e) => handleContactChange(index, 'designation', e.target.value)}
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: iOSStyles.borderRadius.medium,
                              backgroundColor: iOSStyles.colors.systemBackground,
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Mobile"
                          type="tel"
                          value={contact.mobile}
                          onChange={(e) => handleContactChange(index, 'mobile', e.target.value)}
                          variant="outlined"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Phone sx={{ color: iOSStyles.colors.systemGray }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: iOSStyles.borderRadius.medium,
                              backgroundColor: iOSStyles.colors.systemBackground,
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Email"
                          type="email"
                          value={contact.email}
                          onChange={(e) => handleContactChange(index, 'email', e.target.value)}
                          required={contact.isPrimary}
                          variant="outlined"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Email sx={{ color: iOSStyles.colors.systemGray }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: iOSStyles.borderRadius.medium,
                              backgroundColor: iOSStyles.colors.systemBackground,
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          
          <Button
            startIcon={<AddIcon />}
            onClick={addContact}
            variant="outlined"
            sx={{
              mt: 1,
              borderRadius: iOSStyles.borderRadius.medium,
              borderColor: iOSStyles.colors.systemGray4,
              color: iOSStyles.colors.label,
              '&:hover': {
                borderColor: iOSStyles.colors.systemGray3,
                backgroundColor: iOSStyles.colors.systemGray6,
              },
            }}
          >
            Add Another Contact
          </Button>
        </Grid>
        
        <Grid item xs={12}>
          <Divider sx={{ my: 3 }} />
        </Grid>
        
        {/* Expenses Section */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AttachMoney />
            Expenses (in ₹)
          </Typography>
          
          <Paper variant="outlined" sx={{ 
            p: 3,
            borderRadius: iOSStyles.borderRadius.large,
            backgroundColor: iOSStyles.colors.systemGray6,
            borderColor: iOSStyles.colors.systemGray5,
          }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Travel"
                  type="number"
                  value={formData.expenses.travel}
                  onChange={(e) => handleExpenseChange('travel', e.target.value)}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: iOSStyles.borderRadius.medium,
                      backgroundColor: iOSStyles.colors.systemBackground,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Food"
                  type="number"
                  value={formData.expenses.food}
                  onChange={(e) => handleExpenseChange('food', e.target.value)}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: iOSStyles.borderRadius.medium,
                      backgroundColor: iOSStyles.colors.systemBackground,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Accommodation"
                  type="number"
                  value={formData.expenses.accommodation}
                  onChange={(e) => handleExpenseChange('accommodation', e.target.value)}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: iOSStyles.borderRadius.medium,
                      backgroundColor: iOSStyles.colors.systemBackground,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Miscellaneous"
                  type="number"
                  value={formData.expenses.miscellaneous}
                  onChange={(e) => handleExpenseChange('miscellaneous', e.target.value)}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: iOSStyles.borderRadius.medium,
                      backgroundColor: iOSStyles.colors.systemBackground,
                    },
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  p: 2,
                  backgroundColor: iOSStyles.colors.systemBlue + '10',
                  borderRadius: iOSStyles.borderRadius.medium,
                  border: `1px solid ${iOSStyles.colors.systemBlue}30`,
                }}>
                  <Typography variant="h6">
                    Total Expenses:
                  </Typography>
                  <Typography variant="h5" sx={{ color: iOSStyles.colors.systemBlue, fontWeight: 800 }}>
                    ₹{totalExpenses.toFixed(2)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </motion.div>
  );

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return renderStep1();
      case 1:
        return renderStep2();
      case 2:
        return renderStep3();
      case 3:
        return renderStep4();
      default:
        return null;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box ref={formRef}>
        {/* iOS-style Stepper */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: iOSStyles.borderRadius.large,
            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
            border: `1px solid ${iOSStyles.colors.systemGray5}`,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden',
          }}
        >
          <Stepper 
            activeStep={activeStep} 
            alternativeLabel={!isMobile}
            orientation={isMobile ? "vertical" : "horizontal"}
            sx={{
              '& .MuiStepLabel-root': {
                '& .MuiStepLabel-label': {
                  fontSize: isMobile ? '14px' : '15px',
                  fontWeight: 500,
                  '&.Mui-active': {
                    fontWeight: 600,
                    color: iOSStyles.colors.systemBlue,
                  },
                  '&.Mui-completed': {
                    color: iOSStyles.colors.systemGreen,
                  },
                },
              },
              '& .MuiStepIcon-root': {
                color: iOSStyles.colors.systemGray4,
                '&.Mui-active': {
                  color: iOSStyles.colors.systemBlue,
                },
                '&.Mui-completed': {
                  color: iOSStyles.colors.systemGreen,
                },
              },
            }}
          >
            {steps.map((step, index) => (
              <Step key={step.label} completed={completedSteps.includes(index)}>
                <StepLabel
                  optional={
                    isMobile && index === activeStep && (
                      <Typography variant="caption" sx={{ color: iOSStyles.colors.secondaryLabel }}>
                        Current step
                      </Typography>
                    )
                  }
                  StepIconComponent={(props) => (
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 
                          props.active ? `${iOSStyles.colors.systemBlue}20` :
                          props.completed ? `${iOSStyles.colors.systemGreen}20` :
                          `${iOSStyles.colors.systemGray}20`,
                        color: 
                          props.active ? iOSStyles.colors.systemBlue :
                          props.completed ? iOSStyles.colors.systemGreen :
                          iOSStyles.colors.systemGray,
                        fontWeight: 600,
                        fontSize: '16px',
                      }}
                    >
                      {props.completed ? (
                        <CheckCircle sx={{ fontSize: 20 }} />
                      ) : (
                        step.icon
                      )}
                    </Box>
                  )}
                >
                  {step.label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <Box sx={{ mb: 4 }}>
            {renderStepContent()}
          </Box>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            disabled={activeStep === 0 || loading}
            startIcon={<ArrowBack />}
            sx={{
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
          >
            Back
          </Button>
          
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={loading}
            endIcon={activeStep === steps.length - 1 ? null : <ArrowForward />}
            sx={{
              borderRadius: iOSStyles.borderRadius.large,
              backgroundColor: iOSStyles.colors.systemBlue,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '15px',
              px: 4,
              '&:hover': {
                backgroundColor: '#0056CC',
                boxShadow: '0 6px 24px rgba(0, 122, 255, 0.4)',
              },
              '&:active': {
                transform: 'scale(0.98)',
              },
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : activeStep === steps.length - 1 ? (
              'Submit Visit'
            ) : (
              'Next'
            )}
          </Button>
        </Box>

        {/* Progress Indicator */}
        <Box sx={{ mt: 3 }}>
          <LinearProgress
            variant="determinate"
            value={((activeStep + 1) / steps.length) * 100}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: iOSStyles.colors.systemGray5,
              '& .MuiLinearProgress-bar': {
                backgroundColor: iOSStyles.colors.systemBlue,
                borderRadius: 3,
              },
            }}
          />
          <Typography variant="caption" sx={{ color: iOSStyles.colors.secondaryLabel, display: 'block', textAlign: 'center', mt: 1 }}>
            Step {activeStep + 1} of {steps.length}
          </Typography>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default NewVisitForm;