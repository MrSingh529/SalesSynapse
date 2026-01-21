import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Collapse,
  Badge,
  LinearProgress,
  Grid
} from '@mui/material';
import {
  Checklist,
  AddTask,
  AutoAwesome,
  Refresh,
  Schedule,
  PriorityHigh,
  LowPriority,
  TrendingUp,
  Description,
  People,
  Build,
  AttachMoney,
  ExpandMore,
  ExpandLess,
  CheckCircle,
  RadioButtonUnchecked
} from '@mui/icons-material';
import { generateActionableItems } from '../../services/openAIService';
const AIActionItems = ({ visitData, userRole = 'sales', onItemsGenerated, showTitle = true }) => {
  const [aiActions, setAiActions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [aiEnabled, setAiEnabled] = useState(true);
  useEffect(() => {
    const hasApiKey = process.env.REACT_APP_OPENAI_API_KEY;
    setAiEnabled(!!hasApiKey);

    if (hasApiKey && visitData) {
      generateAIItems();
    }
  }, [visitData]);
  const generateAIItems = async () => {
    if (!visitData || !aiEnabled) return;

    setLoading(true);
    setError(null);

    try {
      const items = await generateActionableItems(visitData, userRole);
      setAiActions(items);

      if (onItemsGenerated) {
        onItemsGenerated(items);
      }
    } catch (err) {
      console.error('Error generating AI action items:', err);
      setError('Unable to generate AI action items. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  const refreshItems = () => {
    setAiActions([]);
    setSelectedItems([]);
    generateAIItems();
  };
  const toggleItemSelection = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };
  const addSelectedToVisit = () => {
    const selected = aiActions.filter(item => selectedItems.includes(item.id));
    console.log('Selected AI items:', selected);
    alert(`${selected.length} items selected. Implement integration with visit form.`);
  };
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <PriorityHigh sx={{ color: '#f44336' }} />;
      case 'medium':
        return <TrendingUp sx={{ color: '#ff9800' }} />;
      case 'low':
        return <LowPriority sx={{ color: '#4caf50' }} />;
      default:
        return <Schedule sx={{ color: '#757575' }} />;
    }
  };
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'follow-up': return <Schedule />;
      case 'documentation': return <Description />;
      case 'relationship-building': return <People />;
      case 'technical': return <Build />;
      case 'commercial': return <AttachMoney />;
      default: return <Checklist />;
    }
  };
  const getCategoryColor = (category) => {
    switch (category) {
      case 'follow-up': return '#3f51b5';
      case 'documentation': return '#4caf50';
      case 'relationship-building': return '#9c27b0';
      case 'technical': return '#ff9800';
      case 'commercial': return '#f44336';
      default: return '#757575';
    }
  };
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#757575';
    }
  };
  if (!aiEnabled) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        <Typography variant="body2">
          AI Action Items feature requires OpenAI API key configuration.
        </Typography>
      </Alert>
    );
  }
  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
        <CircularProgress size={30} />
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          AI is generating action items...
        </Typography>
      </Box>
    );
  }
  if (error) {
    return (
      <Alert 
        severity="warning" 
        sx={{ mt: 2 }}
        action={
          <Button color="inherit" size="small" onClick={generateAIItems}>
            Retry
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }
  if (aiActions.length === 0) {
    return (
      <Card sx={{ bgcolor: '#f8fafc' }}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <AutoAwesome sx={{ fontSize: 48, color: 'primary.main', mb: 2, opacity: 0.7 }} />
          <Typography variant="h6" gutterBottom>
            AI-Generated Action Items
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Get AI suggestions for specific, actionable items based on this visit.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AutoAwesome />}
            onClick={generateAIItems}
            size="large"
          >
            Generate AI Action Items
          </Button>
        </CardContent>
      </Card>
    );
  }
  const completedCount = aiActions.filter(item => selectedItems.includes(item.id)).length;
  const highPriorityCount = aiActions.filter(item => item.priority === 'high').length;
  return (
    <Box>
      {showTitle && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AutoAwesome sx={{ color: 'primary.main' }} />
            <Typography variant="h6">
              AI-Generated Action Items
            </Typography>
            <Chip
              label={`${aiActions.length} suggestions`}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Tooltip title="Refresh AI suggestions">
              <IconButton size="small" onClick={refreshItems}>
                <Refresh />
              </IconButton>
            </Tooltip>
            <IconButton size="small" onClick={() => setExpanded(!expanded)}>
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
        </Box>
      )}
      <Collapse in={expanded}>
        <Paper variant="outlined" sx={{ mb: 2 }}>
          <Box sx={{ p: 2, bgcolor: '#f8fafc', borderBottom: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="subtitle2">
                  {completedCount} of {aiActions.length} selected
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={(completedCount / aiActions.length) * 100}
                  sx={{ mt: 1, height: 6, borderRadius: 3, width: 200 }}
                />
              </Box>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddTask />}
                onClick={addSelectedToVisit}
                disabled={selectedItems.length === 0}
              >
                Add Selected ({selectedItems.length})
              </Button>
            </Box>
          </Box>
          <List>
            {aiActions.map((item, index) => (
              <ListItem
                key={item.id}
                sx={{
                  borderBottom: index < aiActions.length - 1 ? 1 : 0,
                  borderColor: 'divider',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => toggleItemSelection(item.id)}
                    color={selectedItems.includes(item.id) ? 'primary' : 'default'}
                  >
                    {selectedItems.includes(item.id) ? <CheckCircle /> : <RadioButtonUnchecked />}
                  </IconButton>
                }
              >
                <ListItemIcon sx={{ minWidth: 48 }}>
                  <Tooltip title={item.priority || 'Medium priority'}>
                    <Box>
                      {getPriorityIcon(item.priority)}
                    </Box>
                  </Tooltip>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="body1" sx={{ flexGrow: 1 }}>
                        {item.task}
                      </Typography>
                      <Chip
                        label={item.priority}
                        size="small"
                        sx={{
                          bgcolor: getPriorityColor(item.priority) + '20',
                          color: getPriorityColor(item.priority),
                          fontWeight: 'bold'
                        }}
                      />
                      <Chip
                        icon={getCategoryIcon(item.category)}
                        label={item.category}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderColor: getCategoryColor(item.category),
                          color: getCategoryColor(item.category)
                        }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Schedule fontSize="small" sx={{ color: 'text.secondary' }} />
                        <Typography variant="caption" color="textSecondary">
                          {item.estimatedTime || 'Timeline not specified'}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="textSecondary">
                        AI Suggestion
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
        {/* Summary Stats */}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" color="primary">
                {highPriorityCount}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                High Priority Items
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" color="success.main">
                {aiActions.filter(item => item.category === 'follow-up').length}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Follow-up Tasks
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" color="warning.main">
                {aiActions.filter(item => item.category === 'technical').length}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Technical Tasks
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" color="secondary">
                {aiActions.filter(item => item.category === 'relationship-building').length}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Relationship Building
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Collapse>
    </Box>
  );
};
export default AIActionItems;