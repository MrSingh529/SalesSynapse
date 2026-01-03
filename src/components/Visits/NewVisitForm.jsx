import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  TextField,
  Button,
  Grid,
  MenuItem,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Chip,
  IconButton,
  InputAdornment,
  Divider,
  Alert,
} from '@mui/material';
import {
  Business,
  Person,
  Description,
  AttachMoney,
  NavigateNext,
  NavigateBefore,
  CheckCircle,
  LocationOn,
  Phone,
  Email,
  CalendarToday,
} from '@mui/icons-material';
import { VISIT_PURPOSES, CUSTOMER_SENTIMENTS, ACTION_ITEM_STATUSES } from '../../utils/constants';
import useHaptic from '../../hooks/useHaptic';

const steps = ['Customer Info', 'Visit Details', 'Action Items'];

const NewVisitForm = ({ onSubmit, loading }) => {
  const { impactLight, impactMedium } = useHaptic();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    customerName: '',
    customerCompany: '',
    customerEmail: '',
    customerPhone: '',
    location: '',
    visitDate: new Date().toISOString().split('T')[0],
    visitPurpose: '',
    discussionPoints: '',
    customerSentiment: '',
    actionItems: '',
    followUpDate: '',
    expenses: '',
    expenseDetails: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 0) {
      if (!formData.customerName.trim()) newErrors.customerName = 'Customer name is required';
      if (!formData.customerCompany.trim()) newErrors.customerCompany = 'Company is required';
      if (!formData.location.trim()) newErrors.location = 'Location is required';
    }

    if (step === 1) {
      if (!formData.visitDate) newErrors.visitDate = 'Visit date is required';
      if (!formData.visitPurpose) newErrors.visitPurpose = 'Visit purpose is required';
      if (!formData.discussionPoints.trim()) newErrors.discussionPoints = 'Discussion points are required';
      if (!formData.customerSentiment) newErrors.customerSentiment = 'Customer sentiment is required';
    }

    if (step === 2) {
      if (!formData.actionItems.trim()) newErrors.actionItems = 'Action items are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      impactLight();
      setActiveStep((prev) => prev + 1);
    } else {
      impactMedium();
    }
  };

  const handleBack = () => {
    impactLight();
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(activeStep)) {
      impactMedium();
      onSubmit(formData);
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {/* iOS-style Stepper */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Stepper
          activeStep={activeStep}
          sx={{
            mb: 4,
            '& .MuiStepLabel-root .Mui-completed': {
              color: 'success.main',
            },
            '& .MuiStepLabel-root .Mui-active': {
              color: 'primary.main',
            },
          }}
        >
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                StepIconComponent={() => (
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor:
                        activeStep > index
                          ? 'success.main'
                          : activeStep === index
                          ? 'primary.main'
                          : 'grey.300',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '14px',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {activeStep > index ? <CheckCircle sx={{ fontSize: 20 }} /> : index + 1}
                  </Box>
                )}
              >
                <Typography
                  variant="caption"
                  sx={{
                    display: { xs: 'none', sm: 'block' },
                    fontWeight: activeStep === index ? 600 : 400,
                  }}
                >
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </motion.div>

      {/* Progress Bar */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            Step {activeStep + 1} of {steps.length}
          </Typography>
          <Typography variant="body2" color="primary.main" fontWeight={600}>
            {Math.round(((activeStep + 1) / steps.length) * 100)}% Complete
          </Typography>
        </Box>
        <Box
          sx={{
            height: 6,
            borderRadius: 3,
            bgcolor: 'grey.200',
            overflow: 'hidden',
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #007AFF 0%, #5AC8FA 100%)',
            }}
          />
        </Box>
      </Box>

      <AnimatePresence mode="wait">
        {/* Step 1: Customer Info */}
        {activeStep === 0 && (
          <motion.div
            key="step1"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: 'rgba(0, 122, 255, 0.03)',
                border: 1,
                borderColor: 'primary.light',
                mb: 3,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Business sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="h6" fontWeight={600}>
                  Customer Information
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Enter the basic details of the customer you met
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Customer Name"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  error={!!errors.customerName}
                  helperText={errors.customerName}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Company Name"
                  name="customerCompany"
                  value={formData.customerCompany}
                  onChange={handleChange}
                  error={!!errors.customerCompany}
                  helperText={errors.customerCompany}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Business color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleChange}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Meeting Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  error={!!errors.location}
                  helperText={errors.location}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="e.g., Customer Office, Coffee Shop, Virtual Meeting"
                />
              </Grid>
            </Grid>
          </motion.div>
        )}

        {/* Step 2: Visit Details */}
        {activeStep === 1 && (
          <motion.div
            key="step2"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: 'rgba(52, 199, 89, 0.03)',
                border: 1,
                borderColor: 'success.light',
                mb: 3,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Description sx={{ color: 'success.main', mr: 1 }} />
                <Typography variant="h6" fontWeight={600}>
                  Visit Details
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Provide details about your meeting and discussion
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Visit Date"
                  name="visitDate"
                  type="date"
                  value={formData.visitDate}
                  onChange={handleChange}
                  error={!!errors.visitDate}
                  helperText={errors.visitDate}
                  disabled={loading}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  select
                  fullWidth
                  label="Visit Purpose"
                  name="visitPurpose"
                  value={formData.visitPurpose}
                  onChange={handleChange}
                  error={!!errors.visitPurpose}
                  helperText={errors.visitPurpose}
                  disabled={loading}
                >
                  {VISIT_PURPOSES.map((purpose) => (
                    <MenuItem key={purpose} value={purpose}>
                      {purpose}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={4}
                  label="Discussion Points"
                  name="discussionPoints"
                  value={formData.discussionPoints}
                  onChange={handleChange}
                  error={!!errors.discussionPoints}
                  helperText={errors.discussionPoints || 'Describe what was discussed during the meeting'}
                  disabled={loading}
                  placeholder="Key topics discussed, customer concerns, product demonstrations..."
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  select
                  fullWidth
                  label="Customer Sentiment"
                  name="customerSentiment"
                  value={formData.customerSentiment}
                  onChange={handleChange}
                  error={!!errors.customerSentiment}
                  helperText={errors.customerSentiment || 'How did the customer respond?'}
                  disabled={loading}
                >
                  {CUSTOMER_SENTIMENTS.map((sentiment) => (
                    <MenuItem key={sentiment} value={sentiment}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor:
                              sentiment === 'Positive'
                                ? 'success.main'
                                : sentiment === 'Neutral'
                                ? 'warning.main'
                                : 'error.main',
                          }}
                        />
                        {sentiment}
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </motion.div>
        )}

        {/* Step 3: Action Items */}
        {activeStep === 2 && (
          <motion.div
            key="step3"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: 'rgba(255, 149, 0, 0.03)',
                border: 1,
                borderColor: 'warning.light',
                mb: 3,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircle sx={{ color: 'warning.main', mr: 1 }} />
                <Typography variant="h6" fontWeight={600}>
                  Action Items & Follow-up
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Define next steps and track expenses
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={4}
                  label="Action Items"
                  name="actionItems"
                  value={formData.actionItems}
                  onChange={handleChange}
                  error={!!errors.actionItems}
                  helperText={errors.actionItems || 'List all follow-up tasks (one per line)'}
                  disabled={loading}
                  placeholder="- Send product brochure&#10;- Schedule demo call&#10;- Follow up on pricing"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Follow-up Date"
                  name="followUpDate"
                  type="date"
                  value={formData.followUpDate}
                  onChange={handleChange}
                  disabled={loading}
                  InputLabelProps={{ shrink: true }}
                  helperText="When should you follow up?"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Expenses (₹)"
                  name="expenses"
                  type="number"
                  value={formData.expenses}
                  onChange={handleChange}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoney color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  helperText="Travel, meals, etc."
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Expense Details"
                  name="expenseDetails"
                  value={formData.expenseDetails}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Breakdown of expenses incurred"
                />
              </Grid>
            </Grid>
          </motion.div>
        )}
      </AnimatePresence>

      <Divider sx={{ my: 3 }} />

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            disabled={activeStep === 0 || loading}
            startIcon={<NavigateBefore />}
            sx={{ px: 3 }}
          >
            Back
          </Button>
        </motion.div>

        {activeStep === steps.length - 1 ? (
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              endIcon={<CheckCircle />}
              sx={{
                px: 4,
                background: 'linear-gradient(135deg, #34C759 0%, #66D77C 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #2DA44E 0%, #34C759 100%)',
                },
              }}
            >
              {loading ? 'Submitting...' : 'Submit Visit'}
            </Button>
          </motion.div>
        ) : (
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading}
              endIcon={<NavigateNext />}
              sx={{ px: 3 }}
            >
              Next
            </Button>
          </motion.div>
        )}
      </Box>
    </Box>
  );
};

export default NewVisitForm;
