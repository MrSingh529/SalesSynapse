import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  IconButton,
  Divider,
  LinearProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  AutoAwesome,
  AttachMoney,
} from "@mui/icons-material";

import { SALES_TYPES, SALES_STAGES } from "../../utils/constants";
import { generateActionableItems } from "../../services/openAIService";

import {
  IOSTextField,
  IOSSelect,
  IOSDatePicker,
  IOSFormSection,
} from "../Common/IOSFormComponents"; // <-- adjust if needed
import { iosColors, iosBorderRadius } from "../../styles/iosTheme";

const steps = [
  { title: "Visit Details", short: "Visit" },
  { title: "Sales Data", short: "Sales" },
  { title: "Notes & Actions", short: "Notes" },
  { title: "Contacts & Expenses", short: "More" },
];

const NewVisitForm = ({ onSubmit, loading, initialData, isEditMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [activeStep, setActiveStep] = useState(0);

  const [formData, setFormData] = useState({
    companyName: "",
    visitDate: new Date(),
    objective: "",
    outcome: "",
    leadName: "",
    estimatedBudget: "",

    salesType: "",
    salesStage: "",

    discussionDetails: "",
    actionable: [{ task: "", completed: false }],
    additionalNotes: "",

    contacts: [{ name: "", designation: "", mobile: "", email: "", isPrimary: true }],
    expenses: { travel: 0, food: 0, accommodation: 0, miscellaneous: 0 },
  });

  useEffect(() => {
    if (!initialData) return;

    setFormData({
      companyName: initialData.companyName || "",
      visitDate: initialData.visitDate?.toDate
        ? initialData.visitDate.toDate()
        : initialData.visitDate instanceof Date
          ? initialData.visitDate
          : new Date(),
      objective: initialData.objective || "",
      outcome: initialData.outcome || "",
      leadName: initialData.leadName || "",
      estimatedBudget: initialData.estimatedBudget ?? "",

      salesType: initialData.salesType || "",
      salesStage: initialData.salesStage || "",

      discussionDetails: initialData.discussionDetails || "",
      actionable:
        initialData.actionable?.length > 0
          ? initialData.actionable
          : [{ task: "", completed: false }],
      additionalNotes: initialData.additionalNotes || "",

      contacts:
        initialData.contacts?.length > 0
          ? initialData.contacts
          : [{ name: "", designation: "", mobile: "", email: "", isPrimary: true }],

      expenses: initialData.expenses || { travel: 0, food: 0, accommodation: 0, miscellaneous: 0 },
    });
  }, [initialData]);

  const totalExpenses = useMemo(() => {
    const entries = Object.entries(formData.expenses || {});
    return entries.reduce((sum, [k, v]) => {
      if (k === "total") return sum;
      const n = typeof v === "number" ? v : parseFloat(v) || 0;
      return sum + n;
    }, 0);
  }, [formData.expenses]);

  const progressValue = useMemo(() => {
    if (steps.length <= 1) return 0;
    return Math.round((activeStep / (steps.length - 1)) * 100);
  }, [activeStep]);

  const handleNext = () => {
    if (activeStep === steps.length - 1) handleSubmit();
    else setActiveStep((s) => s + 1);
  };

  const handleBack = () => setActiveStep((s) => Math.max(0, s - 1));

  const handleChange = (field, value) => setFormData((p) => ({ ...p, [field]: value }));

  const handleExpenseChange = (category, value) => {
    setFormData((p) => ({
      ...p,
      expenses: { ...p.expenses, [category]: parseFloat(value) || 0 },
    }));
  };

  const handleContactChange = (index, field, value) => {
    const updated = [...formData.contacts];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((p) => ({ ...p, contacts: updated }));
  };

  const addContact = () => {
    setFormData((p) => ({
      ...p,
      contacts: [
        ...p.contacts,
        { name: "", designation: "", mobile: "", email: "", isPrimary: false },
      ],
    }));
  };

  const removeContact = (index) => {
    if (formData.contacts.length <= 1) return;
    setFormData((p) => ({ ...p, contacts: p.contacts.filter((_, i) => i !== index) }));
  };

  const handleActionableChange = (index, value) => {
    const updated = [...formData.actionable];
    updated[index] = { task: value, completed: false };
    setFormData((p) => ({ ...p, actionable: updated }));
  };

  const addActionable = () => {
    setFormData((p) => ({ ...p, actionable: [...p.actionable, { task: "", completed: false }] }));
  };

  const removeActionable = (index) => {
    if (formData.actionable.length <= 1) return;
    setFormData((p) => ({ ...p, actionable: p.actionable.filter((_, i) => i !== index) }));
  };

  const handleAISuggestions = async () => {
    if (!process.env.REACT_APP_OPENAI_API_KEY) {
      alert("OpenAI API key not configured. Add REACT_APP_OPENAI_API_KEY to .env.");
      return;
    }
    if (!formData.companyName || !formData.objective) {
      alert("Please enter company name and meeting objective first.");
      return;
    }

    try {
      const aiItems = await generateActionableItems(formData);
      if (aiItems?.length) {
        const kept = formData.actionable.filter((i) => i.task.trim() !== "");
        setFormData((p) => ({ ...p, actionable: [...kept, ...aiItems] }));
        alert(`Added ${aiItems.length} AI-generated action items.`);
      } else {
        alert("No actionable items suggested. Add more detail to the objective.");
      }
    } catch (err) {
      console.error(err);
      alert("Unable to get AI suggestions. Please try again.");
    }
  };

  const handleSubmit = () => {
    const actionable = formData.actionable.filter((i) => i.task.trim() !== "");
    const contacts = formData.contacts.filter(
      (c) => c.name.trim() !== "" || c.email.trim() !== ""
    );

    onSubmit({
      ...formData,
      actionable,
      contacts,
      estimatedBudget: parseFloat(formData.estimatedBudget) || 0,
      totalExpenses,
      visitDate: formData.visitDate instanceof Date ? formData.visitDate : new Date(formData.visitDate),
    });
  };

  const iosCard = {
    bgcolor: iosColors.backgroundSecondary,
    borderRadius: `${iosBorderRadius.large}px`,
    border: `1px solid ${iosColors.separator}`,
  };

  const renderSegmentedSteps = () => (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          ...iosCard,
          p: 0.75,
          bgcolor: iosColors.systemGray6,
          border: `1px solid ${iosColors.systemGray5}`,
          display: "flex",
          gap: 0.75,
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {steps.map((s, idx) => {
          const active = idx === activeStep;
          return (
            <Button
              key={s.title}
              onClick={() => setActiveStep(idx)}
              variant={active ? "contained" : "text"}
              disableElevation
              sx={{
                whiteSpace: "nowrap",
                minWidth: "max-content",
                borderRadius: `${iosBorderRadius.button}px`,
                px: 1.5,
                py: 0.9,
                fontSize: 13,
                fontWeight: 600,
                color: active ? "#fff" : iosColors.secondaryLabel,
                bgcolor: active ? iosColors.systemBlue : "transparent",
                "&:hover": { bgcolor: active ? iosColors.systemBlueDark : "rgba(0,0,0,0.04)" },
              }}
            >
              {isMobile ? s.short : s.title}
            </Button>
          );
        })}
      </Box>

      <LinearProgress
        variant="determinate"
        value={progressValue}
        sx={{
          mt: 1.25,
          height: 6,
          borderRadius: 9999,
          bgcolor: iosColors.systemGray5,
          "& .MuiLinearProgress-bar": { bgcolor: iosColors.systemBlue, borderRadius: 9999 },
        }}
      />
    </Box>
  );

  const renderStep1 = () => (
    <IOSFormSection title="Visit Details" subtitle="What happened in the meeting?">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <IOSTextField
            label="Company Name"
            value={formData.companyName}
            onChange={(e) => handleChange("companyName", e.target.value)}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <IOSDatePicker
            label="Visit Date"
            value={formData.visitDate}
            onChange={(date) => handleChange("visitDate", date)}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <IOSTextField
            label="Lead Name"
            value={formData.leadName}
            onChange={(e) => handleChange("leadName", e.target.value)}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <IOSTextField
            label="Meeting Objective / Agenda"
            value={formData.objective}
            onChange={(e) => handleChange("objective", e.target.value)}
            multiline
            rows={3}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <IOSTextField
            label="Outcome"
            value={formData.outcome}
            onChange={(e) => handleChange("outcome", e.target.value)}
            multiline
            rows={3}
          />
        </Grid>

        <Grid item xs={12}>
          <IOSTextField
            label="Budget Estimation (₹)"
            type="number"
            value={formData.estimatedBudget}
            onChange={(e) => handleChange("estimatedBudget", e.target.value)}
            startIcon={<AttachMoney sx={{ fontSize: 20 }} />}
            required
          />
        </Grid>
      </Grid>
    </IOSFormSection>
  );

  const renderStep2 = () => (
    <IOSFormSection title="Sales Data" subtitle="Pipeline classification for this visit.">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <IOSSelect
            label="Sales Type"
            value={formData.salesType}
            onChange={(e) => handleChange("salesType", e.target.value)}
            required
            options={[
              { value: "", label: "Select Type" },
              ...SALES_TYPES.map((t) => ({ value: t.value, label: t.label })),
            ]}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <IOSSelect
            label="Sales Stage"
            value={formData.salesStage}
            onChange={(e) => handleChange("salesStage", e.target.value)}
            required
            options={[
              { value: "", label: "Select Stage" },
              ...SALES_STAGES.map((s) => ({ value: s.value, label: s.label })),
            ]}
          />
        </Grid>
      </Grid>
    </IOSFormSection>
  );

  const renderStep3 = () => (
    <IOSFormSection title="Notes & Actions" subtitle="Capture context + next steps.">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <IOSTextField
            label="Discussion Details (Optional)"
            value={formData.discussionDetails}
            onChange={(e) => handleChange("discussionDetails", e.target.value)}
            multiline
            rows={4}
            placeholder="Any additional discussion points..."
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ ...iosCard, p: 2.5 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                mb: 2,
              }}
            >
              <Typography sx={{ fontSize: 17, fontWeight: 700, color: iosColors.label }}>
                Actionable Points
              </Typography>

              <Button
                startIcon={<AutoAwesome />}
                onClick={handleAISuggestions}
                variant="outlined"
                size="small"
                disabled={loading}
                sx={{ borderRadius: `${iosBorderRadius.button}px` }}
              >
                AI Suggestions
              </Button>
            </Box>

            {formData.actionable.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  gap: 1.5,
                  alignItems: "center",
                  mb: index === formData.actionable.length - 1 ? 0 : 1.5,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <IOSTextField
                    label={`Actionable ${index + 1}`}
                    value={item.task}
                    onChange={(e) => handleActionableChange(index, e.target.value)}
                    placeholder="Enter actionable item..."
                  />
                </Box>
                <IconButton
                  onClick={() => removeActionable(index)}
                  disabled={formData.actionable.length === 1}
                  size="small"
                  sx={{ color: iosColors.systemRed }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}

            <Button
              startIcon={<AddIcon />}
              onClick={addActionable}
              variant="outlined"
              fullWidth
              sx={{ mt: 2, borderRadius: `${iosBorderRadius.button}px` }}
            >
              Add Actionable Point
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <IOSTextField
            label="Additional Notes"
            value={formData.additionalNotes}
            onChange={(e) => handleChange("additionalNotes", e.target.value)}
            multiline
            rows={3}
            placeholder="Any other notes..."
          />
        </Grid>
      </Grid>
    </IOSFormSection>
  );

  const renderStep4 = () => (
    <>
      <IOSFormSection title="Contact Details" subtitle="Add one or more contacts from the meeting.">
        <Grid container spacing={2}>
          {formData.contacts.map((contact, index) => (
            <Grid item xs={12} key={index}>
              <Box sx={{ ...iosCard, p: 2.5 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
                    Contact {index + 1} {contact.isPrimary ? "(Primary)" : ""}
                  </Typography>

                  {formData.contacts.length > 1 && (
                    <IconButton
                      onClick={() => removeContact(index)}
                      size="small"
                      sx={{ color: iosColors.systemRed }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <IOSTextField
                      label="Name"
                      value={contact.name}
                      onChange={(e) => handleContactChange(index, "name", e.target.value)}
                      required={contact.isPrimary}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <IOSTextField
                      label="Designation"
                      value={contact.designation}
                      onChange={(e) => handleContactChange(index, "designation", e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <IOSTextField
                      label="Mobile"
                      type="tel"
                      value={contact.mobile}
                      onChange={(e) => handleContactChange(index, "mobile", e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <IOSTextField
                      label="Email"
                      type="email"
                      value={contact.email}
                      onChange={(e) => handleContactChange(index, "email", e.target.value)}
                      required={contact.isPrimary}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          ))}

          <Grid item xs={12}>
            <Button
              startIcon={<AddIcon />}
              onClick={addContact}
              variant="outlined"
              sx={{ borderRadius: `${iosBorderRadius.button}px` }}
            >
              Add Another Contact
            </Button>
          </Grid>
        </Grid>
      </IOSFormSection>

      <Box sx={{ my: 2 }}>
        <Divider />
      </Box>

      <IOSFormSection title="Expenses" subtitle="Enter expenses for this visit (₹).">
        <Box sx={{ ...iosCard, p: 2.5 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <IOSTextField
                label="Travel"
                type="number"
                value={formData.expenses.travel}
                onChange={(e) => handleExpenseChange("travel", e.target.value)}
                startIcon={<Typography sx={{ fontWeight: 700, color: iosColors.secondaryLabel }}>₹</Typography>}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <IOSTextField
                label="Food"
                type="number"
                value={formData.expenses.food}
                onChange={(e) => handleExpenseChange("food", e.target.value)}
                startIcon={<Typography sx={{ fontWeight: 700, color: iosColors.secondaryLabel }}>₹</Typography>}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <IOSTextField
                label="Accommodation"
                type="number"
                value={formData.expenses.accommodation}
                onChange={(e) => handleExpenseChange("accommodation", e.target.value)}
                startIcon={<Typography sx={{ fontWeight: 700, color: iosColors.secondaryLabel }}>₹</Typography>}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <IOSTextField
                label="Miscellaneous"
                type="number"
                value={formData.expenses.miscellaneous}
                onChange={(e) => handleExpenseChange("miscellaneous", e.target.value)}
                startIcon={<Typography sx={{ fontWeight: 700, color: iosColors.secondaryLabel }}>₹</Typography>}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box
                sx={{
                  bgcolor: iosColors.systemGray6,
                  border: `1px solid ${iosColors.systemGray5}`,
                  borderRadius: `${iosBorderRadius.medium}px`,
                  p: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ fontSize: 16, fontWeight: 700, color: iosColors.label }}>
                  Total Expenses
                </Typography>
                <Typography sx={{ fontSize: 18, fontWeight: 800, color: iosColors.systemBlue }}>
                  ₹{totalExpenses.toFixed(0)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </IOSFormSection>
    </>
  );

  return (
    <Box sx={{ pb: 2 }}>
      {renderSegmentedSteps()}

      {activeStep === 0 && renderStep1()}
      {activeStep === 1 && renderStep2()}
      {activeStep === 2 && renderStep3()}
      {activeStep === 3 && renderStep4()}

      <Box
        sx={{
          mt: 3,
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
          position: isMobile ? "sticky" : "static",
          bottom: isMobile ? 12 : "auto",
          bgcolor: isMobile ? "transparent" : "transparent",
        }}
      >
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          variant="outlined"
          sx={{ borderRadius: `${iosBorderRadius.button}px`, minWidth: 120 }}
        >
          Back
        </Button>

        <Button
          variant="contained"
          onClick={handleNext}
          disabled={loading}
          sx={{
            borderRadius: `${iosBorderRadius.button}px`,
            minWidth: 160,
          }}
        >
          {activeStep === steps.length - 1
            ? isEditMode
              ? "Update Visit"
              : "Submit Visit"
            : "Next"}
        </Button>
      </Box>
    </Box>
  );
};

export default NewVisitForm;
