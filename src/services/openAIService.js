import OpenAI from 'openai';

// Initialize OpenAI client
let openai;
try {
  openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });
} catch (error) {
  console.error('Failed to initialize OpenAI:', error);
  openai = null;
}

/**
 * Generate structured AI insights for a visit report
 */
export const generateVisitInsights = async (visitData, userRole = 'sales') => {
  if (!openai || !process.env.REACT_APP_OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  try {
    const {
      companyName,
      objective,
      outcome,
      discussionDetails,
      salesStage,
      salesType,
      estimatedBudget,
    } = visitData;

    const prompt = `
      Analyze this sales visit and provide structured insights for the ${userRole}:
      
      Company: ${companyName || 'Not specified'}
      Visit Objective: ${objective || 'Not specified'}
      Outcome: ${outcome || 'Not specified'}
      Key Discussion Points: ${discussionDetails || 'Not specified'}
      Current Sales Stage: ${salesStage || 'Not specified'}
      Sales Type: ${salesType || 'Not specified'}
      Estimated Deal Size: ₹${estimatedBudget?.toLocaleString() || 'Not specified'}
      
      Provide a JSON response with this structure:
      {
        "summary": "Brief overall summary",
        "keyTakeaways": ["takeaway1", "takeaway2", "takeaway3"],
        "nextSteps": ["step1", "step2", "step3"],
        "risks": ["risk1", "risk2"],
        "opportunities": ["opportunity1", "opportunity2"]
      }
      
      Return ONLY the JSON object, no other text.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a sales strategy expert. Provide structured, actionable insights in JSON format.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const content = response.choices[0]?.message?.content;

    try {
      const parsedInsights = JSON.parse(content);
      return {
        ...parsedInsights,
        generatedAt: new Date().toISOString(),
        forRole: userRole,
      };
    } catch (e) {
      // Fallback if JSON parsing fails
      return {
        summary: content,
        keyTakeaways: [],
        nextSteps: [],
        risks: [],
        opportunities: [],
        generatedAt: new Date().toISOString(),
        forRole: userRole,
      };
    }
  } catch (error) {
    console.error('Error generating AI insights:', error);
    throw new Error('Failed to generate AI insights');
  }
};

/**
 * Generate AI insights (backward compatibility wrapper for AIInsights component)
 */
export const generateAIInsights = async (visitData, userRole = 'sales') => {
  if (!openai || !process.env.REACT_APP_OPENAI_API_KEY) {
    return {
      success: false,
      error: 'AI insights are currently unavailable. Please configure your OpenAI API key.',
    };
  }

  try {
    const {
      customerName,
      customerCompany,
      visitPurpose,
      discussionPoints,
      customerSentiment,
      actionItems,
      expenses,
    } = visitData;

    const prompt = `
Analyze this sales visit and provide actionable insights for a ${userRole}:

Customer: ${customerName || 'Not specified'}
Company: ${customerCompany || 'Not specified'}
Visit Purpose: ${visitPurpose || 'Not specified'}
Discussion: ${discussionPoints || 'Not specified'}
Customer Sentiment: ${customerSentiment || 'Not specified'}
Action Items: ${actionItems || 'Not specified'}
Expenses: ₹${expenses || 0}

Provide a brief, actionable summary with:
1. Key insights from the meeting
2. Recommendations for next steps
3. Potential opportunities or risks

Keep it concise (max 150 words) and focused on practical advice.
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a sales strategy expert. Provide concise, actionable insights for sales professionals.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const insights = response.choices[0]?.message?.content || 'No insights generated';

    return {
      success: true,
      insights,
    };
  } catch (error) {
    console.error('Error generating AI insights:', error);
    return {
      success: false,
      error: 'Failed to generate AI insights. Please try again later.',
    };
  }
};

/**
 * Generate structured strategy recommendations
 */
export const generateStrategyRecommendations = async (visitData) => {
  if (!openai || !process.env.REACT_APP_OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  try {
    const { companyName, salesStage, estimatedBudget, salesType } = visitData;

    const prompt = `
      As a sales strategy expert, provide structured recommendations for advancing this deal:
      
      Company: ${companyName || 'Client'}
      Sales Type: ${salesType || 'Not specified'}
      Current Stage: ${salesStage || 'Not specified'}
      Estimated Budget: ₹${estimatedBudget?.toLocaleString() || 'Not specified'}
      
      Provide a JSON response with this structure:
      {
        "immediateSteps": ["step1", "step2", "step3"],
        "mediumTermStrategy": ["strategy1", "strategy2"],
        "longTermRelationship": ["action1", "action2"],
        "riskFactors": ["risk1", "risk2", "risk3"],
        "upsellOpportunities": ["opportunity1", "opportunity2"]
      }
      
      Return ONLY the JSON object, no other text.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Provide strategic sales recommendations in structured JSON format.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 600,
    });

    const content = response.choices[0]?.message?.content;

    try {
      const parsedStrategy = JSON.parse(content);
      return {
        ...parsedStrategy,
        generatedAt: new Date().toISOString(),
      };
    } catch (e) {
      // Fallback
      return {
        immediateSteps: ['Follow up within 48 hours', 'Prepare tailored materials'],
        mediumTermStrategy: ['Deepen stakeholder engagement', 'Refine proposal'],
        longTermRelationship: ['Establish regular check-ins', 'Provide value-added content'],
        riskFactors: ['Budget constraints', 'Competition', 'Decision delays'],
        upsellOpportunities: ['Additional services', 'Extended support'],
        generatedAt: new Date().toISOString(),
      };
    }
  } catch (error) {
    console.error('Error generating strategy recommendations:', error);
    throw new Error('Failed to generate strategy recommendations');
  }
};

/**
 * Generate actionable items from visit report
 */
export const generateActionableItems = async (visitData, userRole = 'sales') => {
  if (!openai || !process.env.REACT_APP_OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  try {
    const { companyName, objective, outcome, discussionDetails, salesStage } = visitData;

    const prompt = `
      Based on this sales visit, generate specific, actionable items for the ${userRole}:
      Company: ${companyName || 'Client'}
      Objective: ${objective || 'General meeting'}
      Outcome: ${outcome || 'No specific outcome'}
      Discussion: ${discussionDetails || 'General discussion'}
      Current Sales Stage: ${salesStage || 'Not specified'}
      
      Return as a JSON array of objects, each with fields:
      - "task": string (the action item)
      - "priority": "high"/"medium"/"low"
      - "estimatedTime": string (e.g., "2 days", "1 week")
      - "category": "follow-up"/"documentation"/"relationship-building"/"technical"/"commercial"
      
      Return ONLY the JSON array, no other text.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Generate specific, actionable sales tasks in JSON format.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content;

    try {
      const items = JSON.parse(content);
      return items.map((item) => ({
        ...item,
        completed: false,
        id: Date.now() + Math.random(),
      }));
    } catch (e) {
      // Fallback
      return [
        {
          task: `Follow up with ${companyName || 'client'} regarding discussion`,
          priority: 'high',
          estimatedTime: '2 days',
          category: 'follow-up',
          completed: false,
          id: Date.now() + 1,
        },
        {
          task: 'Document meeting minutes and key decisions',
          priority: 'medium',
          estimatedTime: '1 day',
          category: 'documentation',
          completed: false,
          id: Date.now() + 2,
        },
        {
          task: 'Prepare next steps presentation',
          priority: 'medium',
          estimatedTime: '3 days',
          category: 'documentation',
          completed: false,
          id: Date.now() + 3,
        },
      ];
    }
  } catch (error) {
    console.error('Error generating actionable items:', error);
    throw new Error('Failed to generate actionable items');
  }
};

// Export helper functions for testing
export const testOpenAIConnection = async () => {
  if (!openai || !process.env.REACT_APP_OPENAI_API_KEY) {
    return { connected: false, message: 'OpenAI API key not configured' };
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'user', content: "Say 'Connected successfully' if you can read this." },
      ],
      max_tokens: 10,
    });

    return {
      connected: true,
      message: response.choices[0]?.message?.content || 'Connected',
    };
  } catch (error) {
    return { connected: false, message: error.message };
  }
};
