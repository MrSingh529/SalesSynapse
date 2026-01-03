import React from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Chip,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { CheckCircle, PendingActions } from '@mui/icons-material';

const AIActionItems = ({ actionItems, onToggle }) => {
  const items = actionItems?.split('\n').filter((item) => item.trim()) || [];

  return (
    <Box>
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Box
            sx={{
              p: 2,
              mb: 1,
              borderRadius: 2,
              bgcolor: 'background.paper',
              border: 1,
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <Checkbox
              icon={<PendingActions />}
              checkedIcon={<CheckCircle />}
              onChange={() => onToggle && onToggle(index)}
            />
            <Typography variant="body2" sx={{ flex: 1 }}>
              {item.replace(/^[-•]\s*/, '')}
            </Typography>
          </Box>
        </motion.div>
      ))}
    </Box>
  );
};

export default AIActionItems;
