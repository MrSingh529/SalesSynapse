export const getExpenseTotal = (expenses) => {
  if (!expenses) return 0;
  
  if (typeof expenses === 'object') {
    return expenses.total || 0;
  } else if (typeof expenses === 'number') {
    return expenses;
  }
  
  return 0;
};

export const formatCurrency = (amount) => {
  return `₹${parseFloat(amount || 0).toFixed(2)}`;
};