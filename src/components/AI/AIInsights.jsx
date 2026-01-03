import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Divider,
} from '@mui/material';
import {
  Lightbulb,
  Psychology,
  TrendingUp,
  Warning,
} from '@mui/icons-material';
import { generateAIInsights } from '../../services/openAIService';

const AIInsights = ({ visitData, userRole, showTitle = true }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInsights();
  }, [visitData]);

  const fetchInsights = async () => {
    if (!visitData) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const result = await generateAIInsights(visitData, userRole);

    if (result.success) {
      setInsights(result.insights);
    } else {
      setError(result.error || 'Failed to generate insights');
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 3 }}>
        <CircularProgress size={40} />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Generating AI insights...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="info" sx={{ borderRadius: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!insights) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, rgba(175, 82, 222, 0.05) 0%, rgba(90, 200, 250, 0.05) 100%)',
          border: 1,
          borderColor: 'divider',
        }}
      >
        {showTitle && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #AF52DE 0%, #5AC8FA 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
              }}
            >
              <Psychology sx={{ color: 'white', fontSize: 22 }} />
            </Box>
            <Typography variant="h6" fontWeight={600}>
              AI Insights
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <Chip
            icon={<Lightbulb />}
            label="AI-Powered"
            size="small"
            sx={{
              background: 'linear-gradient(135deg, #AF52DE 0%, #C77BE8 100%)',
              color: 'white',
              fontWeight: 600,
            }}
          />
          <Chip
            label="Real-time Analysis"
            size="small"
            variant="outlined"
            sx={{ fontWeight: 500 }}
          />
        </Box>

        <Typography variant="body2" sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
          {insights}
        </Typography>
      </Paper>
    </motion.div>
  );
};

export default AIInsights;
