export const APP_NAME = "SalesSynapse Pro";
export const FOOTER_TEXT = "Developed in CEO Office Lab by Harpinder Singh";
export const SUPPORT_EMAIL = "harpinder.singh@rvsolutions.in";

export const SALES_TYPES = [
  { value: 'contec', label: 'Contec' },
  { value: 'non-contec', label: 'Non-Contec' },
  { value: 'solutions', label: 'Solutions' }
];

export const SALES_STAGES = [
  { value: 'stage_0', label: 'Stage 0 – Data Listing' },
  { value: 'stage_1', label: 'Stage 1 – Business Understanding' },
  { value: 'stage_2', label: 'Stage 2 – Presentation Exchange (PPT / CP)' },
  { value: 'stage_3', label: 'Stage 3 – Initial Outreach / Invitation' },
  { value: 'stage_4', label: 'Stage 4 – Prospect Inquiry' },
  { value: 'stage_5', label: 'Stage 5 – NDA Execution' },
  { value: 'stage_6', label: 'Stage 6 – Management & Engineering Engagement' },
  { value: 'stage_7', label: 'Stage 7 – Qualified Lead (Quotation Shared)' }
];

// Visit Purposes - for iOS form
export const VISIT_PURPOSES = [
  'Initial Meeting',
  'Follow-up',
  'Product Demo',
  'Negotiation',
  'Contract Signing',
  'Customer Support',
  'Relationship Building',
  'Market Research',
  'Other'
];

// Customer Sentiments - for iOS form
export const CUSTOMER_SENTIMENTS = [
  'Positive',
  'Neutral',
  'Negative'
];

// Action Item Statuses
export const ACTION_ITEM_STATUSES = [
  'Pending',
  'In Progress',
  'Completed',
  'Cancelled'
];

export const FILTER_OPTIONS = {
  DATE_RANGE: [
    { value: 'today', label: 'Today' },
    { value: 'this_week', label: 'This Week' },
    { value: 'this_month', label: 'This Month' },
    { value: 'custom', label: 'Custom Range' }
  ]
};

// User Roles
export const USER_ROLES = {
  SALES: 'sales',
  MANAGER: 'manager',
  ADMIN: 'admin'
};

// Visit Status
export const VISIT_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  REVIEWED: 'reviewed',
  ARCHIVED: 'archived'
};

// Priority Levels
export const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

// Expense Categories
export const EXPENSE_CATEGORIES = [
  'Travel',
  'Accommodation',
  'Meals',
  'Entertainment',
  'Gifts',
  'Materials',
  'Other'
];

// Date Formats
export const DATE_FORMAT = 'dd/MM/yyyy';
export const DATE_TIME_FORMAT = 'dd/MM/yyyy HH:mm';

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// Chart Colors (iOS Style)
export const CHART_COLORS = {
  PRIMARY: '#007AFF',
  SUCCESS: '#34C759',
  WARNING: '#FF9500',
  DANGER: '#FF3B30',
  INFO: '#5AC8FA',
  PURPLE: '#AF52DE'
};
