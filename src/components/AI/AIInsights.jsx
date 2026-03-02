import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Insights,
  Psychology,
  Lightbulb,
  TrendingUp,
  Warning,
  Schedule,
  Checklist,
  ExpandMore,
  ExpandLess,
  Refresh,
  AutoAwesome,
  RocketLaunch,
  Timelapse,
  Business,
  People
} from '@mui/icons-material';
import { generateVisitInsights, generateStrategyRecommendations } from '../../services/openAIService';
const AIInsights = ({ visitData, userRole = 'sales', showTitle = true, onInsightsGenerated }) => {
  const [insights, setInsights] = useState(null);
  const [strategy, setStrategy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(true);
  const [aiEnabled, setAiEnabled] = useState(true);
  useEffect(() => {
    const hasApiKey = process.env.REACT_APP_OPENAI_API_KEY && 
                     process.env.REACT_APP_OPENAI_API_KEY !== 'your_key_here';
    setAiEnabled(hasApiKey);

    if (hasApiKey && visitData && !insights) {
      generateInsights();
    }
  }, [visitData]);
  const generateInsights = async () => {
    if (!visitData || !aiEnabled) return;

    setLoading(true);
    setError(null);

    try {
      const [insightsData, strategyData] = await Promise.all([
        generateVisitInsights(visitData, userRole),
        generateStrategyRecommendations(visitData)
      ]);

      setInsights(insightsData);
      setStrategy(strategyData);

      if (onInsightsGenerated) {
        onInsightsGenerated(insightsData);
      }
    } catch (err) {
      console.error('Error generating AI insights:', err);
      setError('Unable to generate AI insights. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  const refreshInsights = () => {
    setInsights(null);
    setStrategy(null);
    generateInsights();
  };
  if (!aiEnabled) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        <Typography variant="body2">
          AI Insights feature requires OpenAI API key configuration.
          Add REACT_APP_OPENAI_API_KEY to your .env file.
        </Typography>
      </Alert>
    );
  }
  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
        <CircularProgress size={40} />
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
          AI is analyzing this visit report...
        </Typography>
        <Typography variant="caption" color="textSecondary">
          Generating insights and recommendations
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
          <Button color="inherit" size="small" onClick={generateInsights}>
            Retry
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }
  if (!insights) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#f8fafc' }}>
        <AutoAwesome sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          AI-Powered Insights
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Get AI-generated insights, recommendations, and next steps for this visit report.
        </Typography>
        <Button
          variant="contained"
          startIcon={<RocketLaunch />}
          onClick={generateInsights}
          size="large"
        >
          Generate AI Insights
        </Button>
      </Paper>
    );
  }
  return (
    <Box sx={{ mb: 3 }}>
      {showTitle && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AutoAwesome sx={{ color: 'primary.main' }} />
            <Typography variant="h6">
              AI Insights & Recommendations
            </Typography>
            <Chip
              label={userRole === 'manager' ? 'Manager View' : 'Sales View'}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Refresh insights">
              <IconButton size="small" onClick={refreshInsights}>
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
        {/* Summary Section */}
        <Card variant="outlined" sx={{ mb: 2, borderLeft: 4, borderLeftColor: 'primary.main' }}>
          <CardContent>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              AI Analysis Summary
            </Typography>
            <Typography variant="body2">
              {insights.summary || 'No summary available.'}
            </Typography>
          </CardContent>
        </Card>
        {/* Key Takeaways */}
        {insights.keyTakeaways && insights.keyTakeaways.length > 0 && (
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Lightbulb sx={{ color: '#ff9800' }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  Key Takeaways
                </Typography>
              </Box>
              <List dense>
                {insights.keyTakeaways.map((takeaway, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Insights fontSize="small" sx={{ color: '#3f51b5' }} />
                    </ListItemIcon>
                    <ListItemText primary={takeaway} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}
        {/* Next Steps */}
        {insights.nextSteps && insights.nextSteps.length > 0 && (
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <TrendingUp sx={{ color: '#4caf50' }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  Recommended Next Steps
                </Typography>
              </Box>
              <List dense>
                {insights.nextSteps.map((step, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Checklist fontSize="small" sx={{ color: '#4caf50' }} />
                    </ListItemIcon>
                    <ListItemText primary={step} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}
        {/* Strategy Recommendations */}
        {strategy && (
          <Box sx={{ mb: 2 }}>
            <Card variant="outlined" sx={{ mb: 2, bgcolor: '#f8fafc' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <RocketLaunch sx={{ color: 'primary.main' }} />
                  <Typography variant="subtitle1" fontWeight="bold">
                    Strategic Recommendations
                  </Typography>
                  <Chip
                    label="AI Strategy"
                    size="small"
                    color="primary"
                    sx={{ ml: 1 }}
                  />
                </Box>

                {/* Immediate Steps */}
                {strategy.immediateSteps && strategy.immediateSteps.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Schedule sx={{ color: '#f44336', fontSize: 20 }} />
                      <Typography variant="subtitle2" fontWeight="bold">
                        Immediate Next Steps (48 hours)
                      </Typography>
                    </Box>
                    <List dense>
                      {strategy.immediateSteps.map((step, index) => (
                        <ListItem key={index} sx={{ py: 0.5 }}>
                          <ListItemText primary={step} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
                {/* Medium Term Strategy */}
                {strategy.mediumTermStrategy && strategy.mediumTermStrategy.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Timelapse sx={{ color: '#ff9800', fontSize: 20 }} />
                      <Typography variant="subtitle2" fontWeight="bold">
                        Medium-Term Strategy (2 weeks)
                      </Typography>
                    </Box>
                    <List dense>
                      {strategy.mediumTermStrategy.map((strategyItem, index) => (
                        <ListItem key={index} sx={{ py: 0.5 }}>
                          <ListItemText primary={strategyItem} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
                {/* Long Term Relationship */}
                {strategy.longTermRelationship && strategy.longTermRelationship.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <People sx={{ color: '#9c27b0', fontSize: 20 }} />
                      <Typography variant="subtitle2" fontWeight="bold">
                        Long-Term Relationship Building
                      </Typography>
                    </Box>
                    <List dense>
                      {strategy.longTermRelationship.map((action, index) => (
                        <ListItem key={index} sx={{ py: 0.5 }}>
                          <ListItemText primary={action} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
                {/* Risk Factors */}
                {strategy.riskFactors && strategy.riskFactors.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Warning sx={{ color: '#f44336', fontSize: 20 }} />
                      <Typography variant="subtitle2" fontWeight="bold">
                        Risk Factors to Watch For
                      </Typography>
                    </Box>
                    <List dense>
                      {strategy.riskFactors.map((risk, index) => (
                        <ListItem key={index} sx={{ py: 0.5 }}>
                          <ListItemText 
                            primary={risk}
                            primaryTypographyProps={{ color: 'error.main' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
                {/* Upsell Opportunities */}
                {strategy.upsellOpportunities && strategy.upsellOpportunities.length > 0 && (
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Business sx={{ color: '#4caf50', fontSize: 20 }} />
                      <Typography variant="subtitle2" fontWeight="bold">
                        Upsell/Cross-Sell Opportunities
                      </Typography>
                    </Box>
                    <List dense>
                      {strategy.upsellOpportunities.map((opportunity, index) => (
                        <ListItem key={index} sx={{ py: 0.5 }}>
                          <ListItemText 
                            primary={opportunity}
                            primaryTypographyProps={{ color: 'success.main' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                <Typography variant="caption" color="textSecondary" sx={{ mt: 2, display: 'block' }}>
                  Generated on {new Date(strategy.generatedAt).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        )}
        {/* Risks & Opportunities */}
        {(insights.risks && insights.risks.length > 0) || (insights.opportunities && insights.opportunities.length > 0) ? (
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
                {/* Risks */}
                {insights.risks && insights.risks.length > 0 && (
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Warning sx={{ color: '#f44336' }} />
                      <Typography variant="subtitle1" fontWeight="bold">
                        Potential Risks
                      </Typography>
                    </Box>
                    <List dense>
                      {insights.risks.map((risk, index) => (
                        <ListItem key={index} sx={{ py: 0.5 }}>
                          <ListItemText 
                            primary={risk}
                            primaryTypographyProps={{ color: 'error.main' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
                {/* Opportunities */}
                {insights.opportunities && insights.opportunities.length > 0 && (
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Psychology sx={{ color: '#9c27b0' }} />
                      <Typography variant="subtitle1" fontWeight="bold">
                        Growth Opportunities
                      </Typography>
                    </Box>
                    <List dense>
                      {insights.opportunities.map((opportunity, index) => (
                        <ListItem key={index} sx={{ py: 0.5 }}>
                          <ListItemText 
                            primary={opportunity}
                            primaryTypographyProps={{ color: 'success.main' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        ) : null}
        {/* Footer */}
        <Typography variant="caption" color="textSecondary" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
          AI analysis generated on {new Date(insights.generatedAt).toLocaleString()}
        </Typography>
      </Collapse>
    </Box>
  );
};
export default AIInsights;