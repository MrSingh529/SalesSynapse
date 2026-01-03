import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  AttachMoney,
  AutoAwesome,
  Business,
  CalendarToday,
  Person,
  Phone,
  Email as EmailIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { SALES_TYPES, SALES_STAGES } from '../../utils/constants';
import { generateActionableItems } from '../../services/openAIService';

const NewVisitForm = ({ onSubmit, loading }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Step 1: Visit Details
    companyName: '',
    visitDate: new Date(),
    objective: '',
    outcome: '',
    leadName: '',
    estimatedBudget: '',

    // Step 2: Sales Data
    salesType: '',
    salesStage: '',

    // Step 3: Notes & Actions
    discussionDetails: '',
    actionable: [{ task: '', completed: false }],
    additionalNotes: '',

    // Step 4: Contact Details & Expenses
    contacts: [
      {
        name: '',
        designation: '',
        mobile: '',
        email: '',
        isPrimary: true,
      },
    ],
    expenses: {
      travel: 0,
      food: 0,
      accommodation: 0,
      miscellaneous: 0,
    },
  });

  const steps = ['Visit Details', 'Sales Data', 'Notes & Actions', 'Contact Details & Expenses'];

  // Calculate total expenses
  const totalExpenses = Object.values(formData.expenses).reduce((sum, value) => {
    return sum + (parseFloat(value) || 0);
  }, 0);

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleExpenseChange = (category, value) => {
    setFormData((prev) => ({
      ...prev,
      expenses: {
        ...prev.expenses,
        [category]: parseFloat(value) || 0,
      },
    }));
  };

  const handleContactChange = (index, field, value) => {
    const updatedContacts = [...formData.contacts];
    updatedContacts[index] = { ...updatedContacts[index], [field]: value };
    setFormData((prev) => ({ ...prev, contacts: updatedContacts }));
  };

  const addContact = () => {
    setFormData((prev) => ({
      ...prev,
      contacts: [
        ...prev.contacts,
        {
          name: '',
          designation: '',
          mobile: '',
          email: '',
          isPrimary: false,
        },
      ],
    }));
  };

  const removeContact = (index) => {
    if (formData.contacts.length > 1) {
      const updatedContacts = formData.contacts.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, contacts: updatedContacts }));
    }
  };

  const handleActionableChange = (index, value) => {
    const updatedActionable = [...formData.actionable];
    updatedActionable[index] = { task: value, completed: false };
    setFormData((prev) => ({ ...prev, actionable: updatedActionable }));
  };

  const addActionable = () => {
    setFormData((prev) => ({
      ...prev,
      actionable: [...prev.actionable, { task: '', completed: false }],
    }));
  };

  const removeActionable = (index) => {
    if (formData.actionable.length > 1) {
      const updatedActionable = formData.actionable.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, actionable: updatedActionable }));
    }
  };

  // AI Suggestions Handler
  const handleAISuggestions = async () => {
    if (!process.env.REACT_APP_OPENAI_API_KEY) {
      alert('OpenAI API key not configured. Please add REACT_APP_OPENAI_API_KEY to your .env file.');
      return;
    }

    if (!formData.companyName || !formData.objective) {
      alert('Please enter company name and meeting objective to get relevant AI suggestions.');
      return;
    }

    try {
      const aiItems = await generateActionableItems(formData);

      if (aiItems && aiItems.length > 0) {
        const updatedActionable = [
          ...formData.actionable.filter((item) => item.task.trim() !== ''),
          ...aiItems,
        ];
        setFormData((prev) => ({ ...prev, actionable: updatedActionable }));

        alert(`Added ${aiItems.length} AI-generated action items! Review and edit them as needed.`);
      } else {
        alert('No actionable items were suggested by AI. Try adding more details to the objective.');
      }
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      alert('Unable to get AI suggestions. Please check your connection and try again.');
    }
  };

  const handleSubmit = () => {
    const filteredActionable = formData.actionable.filter((item) => item.task.trim() !== '');
    const filteredContacts = formData.contacts.filter(
      (contact) => contact.name.trim() !== '' || contact.email.trim() !== ''
    );

    const submissionData = {
      ...formData,
      actionable: filteredActionable,
      contacts: filteredContacts,
      estimatedBudget: parseFloat(formData.estimatedBudget) || 0,
      totalExpenses: totalExpenses,
      visitDate:
        formData.visitDate instanceof Date ? formData.visitDate : new Date(formData.visitDate),
    };

    onSubmit(submissionData);
  };

  // Step 1: Visit Details
  const renderStep1 = () => (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Company Name"
              value={formData.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
              required
              InputProps={{
                startAdornment: <Business sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
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
                    startAdornment: <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />,
                  },
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  },
                },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Lead Name"
              value={formData.leadName}
              onChange={(e) => handleChange('leadName', e.target.value)}
              required
              InputProps={{
                startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Outcome"
              multiline
              rows={3}
              value={formData.outcome}
              onChange={(e) => handleChange('outcome', e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
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
              InputProps={{
                startAdornment: <AttachMoney sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Grid>
        </Grid>
      </motion.div>
    </LocalizationProvider>
  );

  // Step 2: Sales Data
  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormControl
            fullWidth
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          >
            <InputLabel>Sales Type</InputLabel>
            <Select
              value={formData.salesType}
              label="Sales Type"
              onChange={(e) => handleChange('salesType', e.target.value)}
            >
              <MenuItem value="">Select Type</MenuItem>
              {SALES_TYPES.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl
            fullWidth
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          >
            <InputLabel>Sales Stage</InputLabel>
            <Select
              value={formData.salesStage}
              label="Sales Stage"
              onChange={(e) => handleChange('salesStage', e.target.value)}
            >
              <MenuItem value="">Select Stage</MenuItem>
              {SALES_STAGES.map((stage) => (
                <MenuItem key={stage.value} value={stage.value}>
                  {stage.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </motion.div>
  );

  // Step 3: Notes & Actions (with AI button)
  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Discussion Details (Optional)"
            multiline
            rows={4}
            value={formData.discussionDetails}
            onChange={(e) => handleChange('discussionDetails', e.target.value)}
            placeholder="Any additional discussion points..."
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Actionable Points
            </Typography>
            <Chip label={`${formData.actionable.length} items`} color="primary" size="small" />
          </Box>

          {/* AI Suggestions Button */}
          <Paper
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 2,
              background: 'linear-gradient(135deg, rgba(175, 82, 222, 0.05) 0%, rgba(90, 200, 250, 0.05) 100%)',
              border: 1,
              borderColor: 'divider',
            }}
          >
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  startIcon={<AutoAwesome />}
                  onClick={handleAISuggestions}
                  variant="contained"
                  size="medium"
                  disabled={loading}
                  sx={{
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #AF52DE 0%, #5AC8FA 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #9F42CE 0%, #4AB8EA 100%)',
                    },
                  }}
                >
                  Get AI Suggestions
                </Button>
              </motion.div>
              <Typography variant="caption" color="text.secondary">
                Let AI suggest action items based on your visit details
              </Typography>
            </Box>
          </Paper>

          <Paper
            variant="outlined"
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 2,
            }}
          >
            {formData.actionable.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                  <TextField
                    fullWidth
                    label={`Actionable Point ${index + 1}`}
                    value={item.task}
                    onChange={(e) => handleActionableChange(index, e.target.value)}
                    placeholder="Enter actionable item..."
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <IconButton
                      onClick={() => removeActionable(index)}
                      disabled={formData.actionable.length === 1}
                      size="small"
                      sx={{
                        bgcolor: 'error.lighter',
                        '&:hover': { bgcolor: 'error.light' },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </motion.div>
                </Box>
              </motion.div>
            ))}
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button
                startIcon={<AddIcon />}
                onClick={addActionable}
                variant="outlined"
                fullWidth
                sx={{ mt: 1, borderRadius: 2 }}
              >
                Add Actionable Point
              </Button>
            </motion.div>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Additional Notes"
            multiline
            rows={3}
            value={formData.additionalNotes}
            onChange={(e) => handleChange('additionalNotes', e.target.value)}
            placeholder="Any other notes..."
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Grid container spacing={3}>
        {/* Contact Details Section */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Contact Details
            </Typography>
            <Chip label={`${formData.contacts.length} contacts`} color="primary" size="small" />
          </Box>

          {formData.contacts.map((contact, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="outlined" sx={{ mb: 2, borderRadius: 2 }}>
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2,
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Contact {index + 1} {contact.isPrimary && <Chip label="Primary" size="small" color="success" sx={{ ml: 1 }} />}
                    </Typography>
                    {formData.contacts.length > 1 && (
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <IconButton onClick={() => removeContact(index)} size="small">
                          <DeleteIcon />
                        </IconButton>
                      </motion.div>
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
                        InputProps={{
                          startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
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
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
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
                        InputProps={{
                          startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />,
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
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
                        InputProps={{
                          startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Button
              startIcon={<AddIcon />}
              onClick={addContact}
              variant="outlined"
              sx={{ mt: 1, borderRadius: 2 }}
            >
              Add Another Contact
            </Button>
          </motion.div>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 3 }} />
        </Grid>

        {/* Expenses Section */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Expenses (in ₹)
          </Typography>
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: 2,
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Travel"
                  type="number"
                  value={formData.expenses.travel}
                  onChange={(e) => handleExpenseChange('travel', e.target.value)}
                  InputProps={{
                    startAdornment: '₹',
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
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
                  InputProps={{
                    startAdornment: '₹',
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
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
                  InputProps={{
                    startAdornment: '₹',
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
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
                  InputProps={{
                    startAdornment: '₹',
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <motion.div whileHover={{ scale: 1.01 }} transition={{ type: 'spring', stiffness: 300 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 3,
                      background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
                      color: 'white',
                      borderRadius: 2,
                      boxShadow: '0 4px 12px rgba(0, 122, 255, 0.3)',
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Total Expenses:
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      ₹{totalExpenses.toFixed(2)}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </motion.div>
  );

  return (
    <Box>
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
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && renderStep1()}
      {activeStep === 1 && renderStep2()}
      {activeStep === 2 && renderStep3()}
      {activeStep === 3 && renderStep4()}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, gap: 2 }}>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
            size="large"
            sx={{ borderRadius: 2, minWidth: 120 }}
          >
            Back
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={loading}
            size="large"
            sx={{
              borderRadius: 2,
              minWidth: 120,
              background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #0066DD 0%, #4AB8EA 100%)',
              },
            }}
          >
            {activeStep === steps.length - 1 ? 'Submit Visit' : 'Next'}
          </Button>
        </motion.div>
      </Box>
    </Box>
  );
};

export default NewVisitForm;
