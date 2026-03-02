import React, { useState, useEffect } from 'react';
import {
  Box, Stepper, Step, StepLabel, Button, TextField, Select, MenuItem,
  FormControl, InputLabel, Grid, Typography, Paper, IconButton, Card,
  CardContent, Divider
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, AttachMoney, AutoAwesome } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { SALES_TYPES, SALES_STAGES } from '../../utils/constants';
import { generateActionableItems } from '../../services/openAIService';

const NewVisitForm = ({ onSubmit, loading, initialData, isEditMode }) => {
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
    contacts: [{ 
      name: '', designation: '', mobile: '', email: '', isPrimary: true 
    }],
    expenses: {
      travel: 0, food: 0, accommodation: 0, miscellaneous: 0
    }
  });

  // Populate form if initialData is provided (Edit Mode)
  useEffect(() => {
    if (initialData) {
      setFormData({
        companyName: initialData.companyName || '',
        // Handle Firestore Timestamp to JS Date conversion
        visitDate: initialData.visitDate?.toDate ? initialData.visitDate.toDate() : new Date(),
        objective: initialData.objective || '',
        outcome: initialData.outcome || '',
        leadName: initialData.leadName || '',
        estimatedBudget: initialData.estimatedBudget || '',
        salesType: initialData.salesType || '',
        salesStage: initialData.salesStage || '',
        discussionDetails: initialData.discussionDetails || '',
        actionable: initialData.actionable?.length > 0 ? initialData.actionable : [{ task: '', completed: false }],
        additionalNotes: initialData.additionalNotes || '',
        contacts: initialData.contacts?.length > 0 ? initialData.contacts : [{ name: '', designation: '', mobile: '', email: '', isPrimary: true }],
        expenses: initialData.expenses || { travel: 0, food: 0, accommodation: 0, miscellaneous: 0 }
      });
    }
  }, [initialData]);

  const steps = ['Visit Details', 'Sales Data', 'Notes & Actions', 'Contact Details & Expenses'];
  
  // Calculate total expenses
  const totalExpenses = Object.values(formData.expenses).reduce((sum, value) => {
    if (typeof value === 'number') return sum + value;
    return sum + (parseFloat(value) || 0);
  }, 0) - (formData.expenses.total || 0); // Subtract total if it exists so we don't double count
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
    setFormData(prev => ({ ...prev, [field]: value }));
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
  };
  const addContact = () => {
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
    if (formData.contacts.length > 1) {
      const updatedContacts = formData.contacts.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, contacts: updatedContacts }));
    }
  };
  const handleActionableChange = (index, value) => {
    const updatedActionable = [...formData.actionable];
    updatedActionable[index] = { task: value, completed: false };
    setFormData(prev => ({ ...prev, actionable: updatedActionable }));
  };
  const addActionable = () => {
    setFormData(prev => ({
      ...prev,
      actionable: [...prev.actionable, { task: '', completed: false }]
    }));
  };
  const removeActionable = (index) => {
    if (formData.actionable.length > 1) {
      const updatedActionable = formData.actionable.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, actionable: updatedActionable }));
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
        const updatedActionable = [...formData.actionable.filter(item => item.task.trim() !== ''), ...aiItems];
        setFormData(prev => ({ ...prev, actionable: updatedActionable }));
  
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
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Company Name"
            value={formData.companyName}
            onChange={(e) => handleChange('companyName', e.target.value)}
            required
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
                required: true
              }
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
              startAdornment: <AttachMoney sx={{ mr: 1, color: 'text.secondary' }} />
            }}
            required
          />
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
  // Step 2: Sales Data
  const renderStep2 = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth required>
          <InputLabel>Sales Type</InputLabel>
          <Select
            value={formData.salesType}
            label="Sales Type"
            onChange={(e) => handleChange('salesType', e.target.value)}
          >
            <MenuItem value="">Select Type</MenuItem>
            {SALES_TYPES.map(type => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl fullWidth required>
          <InputLabel>Sales Stage</InputLabel>
          <Select
            value={formData.salesStage}
            label="Sales Stage"
            onChange={(e) => handleChange('salesStage', e.target.value)}
          >
            <MenuItem value="">Select Stage</MenuItem>
            {SALES_STAGES.map(stage => (
              <MenuItem key={stage.value} value={stage.value}>
                {stage.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
  // Step 3: Notes & Actions (with AI button)
  const renderStep3 = () => (
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
        />
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Actionable Points
        </Typography>

        {/* AI Suggestions Button */}
        <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            startIcon={<AutoAwesome />}
            onClick={handleAISuggestions}
            variant="outlined"
            size="small"
            disabled={loading}
          >
            Get AI Suggestions
          </Button>
          <Typography variant="caption" color="textSecondary">
            Let AI suggest action items based on your visit details
          </Typography>
        </Box>

        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          {formData.actionable.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
              <TextField
                fullWidth
                label={`Actionable Point ${index + 1}`}
                value={item.task}
                onChange={(e) => handleActionableChange(index, e.target.value)}
                placeholder="Enter actionable item..."
              />
              <IconButton
                onClick={() => removeActionable(index)}
                disabled={formData.actionable.length === 1}
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button
            startIcon={<AddIcon />}
            onClick={addActionable}
            variant="outlined"
            fullWidth
            sx={{ mt: 1 }}
          >
            Add Actionable Point
          </Button>
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
        />
      </Grid>
    </Grid>
  );
  // Step 4: Contact Details & Expenses
  const renderStep4 = () => (
    <Grid container spacing={3}>
      {/* Contact Details Section */}
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Contact Details
        </Typography>
        {formData.contacts.map((contact, index) => (
          <Card key={index} variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1">
                  Contact {index + 1} {contact.isPrimary && '(Primary)'}
                </Typography>
                {formData.contacts.length > 1 && (
                  <IconButton 
                    onClick={() => removeContact(index)}
                    size="small"
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
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Designation"
                    value={contact.designation}
                    onChange={(e) => handleContactChange(index, 'designation', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Mobile"
                    type="tel"
                    value={contact.mobile}
                    onChange={(e) => handleContactChange(index, 'mobile', e.target.value)}
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
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}

        <Button
          startIcon={<AddIcon />}
          onClick={addContact}
          variant="outlined"
          sx={{ mt: 1 }}
        >
          Add Another Contact
        </Button>
      </Grid>

      <Grid item xs={12}>
        <Divider sx={{ my: 3 }} />
      </Grid>

      {/* Expenses Section */}
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Expenses (in ₹)
        </Typography>
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Travel"
                type="number"
                value={formData.expenses.travel}
                onChange={(e) => handleExpenseChange('travel', e.target.value)}
                InputProps={{
                  startAdornment: '₹'
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
                  startAdornment: '₹'
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
                  startAdornment: '₹'
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
                  startAdornment: '₹'
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
                backgroundColor: '#f5f5f5',
                borderRadius: 1
              }}>
                <Typography variant="h6">
                  Total Expenses:
                </Typography>
                <Typography variant="h5" color="primary">
                  ₹{totalExpenses.toFixed(2)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
  return (
    <Box>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          variant="outlined"
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={loading}
        >
          {activeStep === steps.length - 1 
            ? (isEditMode ? 'Update Visit' : 'Submit Visit') 
            : 'Next'}
        </Button>
      </Box>
    </Box>
  );
};
export default NewVisitForm;