import { collection, query, where, getDocs, Timestamp, orderBy } from 'firebase/firestore';
import { db } from './firebase';

// Helper function to format amounts in Indian Rupees (₹)
const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const getSalesDashboardStats = async (userId) => {
  try {
    const now = new Date();
    
    const startOfWeek = new Date(now);
    startOfWeek.setHours(0, 0, 0, 0);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    console.log('Fetching sales dashboard stats for user:', userId);

    const weeklyVisitsQuery = query(
      collection(db, 'visits'),
      where('salesPersonId', '==', userId),
      where('createdAt', '>=', Timestamp.fromDate(startOfWeek)),
      where('createdAt', '<=', Timestamp.fromDate(endOfWeek))
    );
    
    const allVisitsQuery = query(
      collection(db, 'visits'),
      where('salesPersonId', '==', userId)
    );

    const [weeklySnapshot, allSnapshot] = await Promise.all([
      getDocs(weeklyVisitsQuery),
      getDocs(allVisitsQuery)
    ]);

    const weeklyVisits = weeklySnapshot.docs.map(doc => doc.data());
    const allVisits = allSnapshot.docs.map(doc => doc.data());

    console.log('Weekly visits found:', weeklyVisits.length);
    console.log('All visits found:', allVisits.length);

    const pendingActions = allVisits.reduce((total, visit) => {
      if (visit.actionable && Array.isArray(visit.actionable)) {
        const incompleteActions = visit.actionable.filter(action => !action.completed);
        return total + incompleteActions.length;
      }
      return total;
    }, 0);

    const totalExpenses = allVisits.reduce((sum, visit) => {
      const expenses = visit.expenses;
      if (!expenses) return sum;
      
      if (typeof expenses === 'object' && expenses !== null) {
        if (expenses.total !== undefined) {
          return sum + (parseFloat(expenses.total) || 0);
        }
        const calculatedTotal = (parseFloat(expenses.travel) || 0) +
                               (parseFloat(expenses.food) || 0) +
                               (parseFloat(expenses.accommodation) || 0) +
                               (parseFloat(expenses.miscellaneous) || 0);
        return sum + calculatedTotal;
      } else if (typeof expenses === 'number') {
        return sum + expenses;
      }
      return sum;
    }, 0);

    const stats = {
      totalMeetingsThisWeek: weeklyVisits.length,
      totalActionsPending: pendingActions,
      totalVisits: allVisits.length,
      totalExpenses: totalExpenses,
      formatCurrency: formatINR  // Added for consistent INR formatting
    };

    console.log('Sales dashboard stats calculated:', stats);
    
    return {
      success: true,
      stats
    };
  } catch (error) {
    console.error('Error in getSalesDashboardStats:', error);
    return { success: false, error: error.message };
  }
};

export const getManagerDashboardStats = async () => {
  try {
    console.log('Fetching manager dashboard stats');
    
    const visitsQuery = query(
      collection(db, 'visits'),
      orderBy('createdAt', 'desc')
    );
    
    const visitsSnapshot = await getDocs(visitsQuery);
    const visits = visitsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date()
    }));

    console.log('Manager - Total visits:', visits.length);

    if (visits.length === 0) {
      return {
        success: true,
        stats: getEmptyStats()
      };
    }

    // Get unique sales persons data
    const salesPersonData = {};
    const uniqueSalesPersons = new Set();
    
    visits.forEach(visit => {
      if (visit.salesPersonId && visit.salesPersonEmail) {
        uniqueSalesPersons.add(visit.salesPersonId);
        
        if (!salesPersonData[visit.salesPersonId]) {
          salesPersonData[visit.salesPersonId] = {
            id: visit.salesPersonId,
            email: visit.salesPersonEmail,
            visitCount: 0,
            totalExpenses: 0,
            companies: new Set(),
            stages: {}
          };
        }
        
        const spData = salesPersonData[visit.salesPersonId];
        spData.visitCount++;
        
        // Expenses
        const expenses = visit.expenses;
        if (expenses) {
          if (typeof expenses === 'object' && expenses !== null) {
            spData.totalExpenses += expenses.total || 0;
          } else if (typeof expenses === 'number') {
            spData.totalExpenses += expenses;
          }
        }
        
        // Companies
        if (visit.companyName) {
          spData.companies.add(visit.companyName);
        }
        
        // Stages
        const stage = visit.salesStage || 'Unknown';
        spData.stages[stage] = (spData.stages[stage] || 0) + 1;
      }
    });

    // Calculate all stats
    const totalVisits = visits.length;
    
    const totalExpenses = visits.reduce((sum, visit) => {
      const expenses = visit.expenses;
      if (!expenses) return sum;
      
      if (typeof expenses === 'object' && expenses !== null) {
        return sum + (parseFloat(expenses.total) || 0);
      } else if (typeof expenses === 'number') {
        return sum + expenses;
      }
      return sum;
    }, 0);

    const avgExpensesPerVisit = totalVisits > 0 ? totalExpenses / totalVisits : 0;

    const stageCounts = visits.reduce((acc, visit) => {
      const stage = visit.salesStage || 'Unknown';
      acc[stage] = (acc[stage] || 0) + 1;
      return acc;
    }, {});

    const customerCounts = visits.reduce((acc, visit) => {
      const company = visit.companyName || 'Unknown';
      if (company && company !== 'Unknown') {
        acc[company] = (acc[company] || 0) + 1;
      }
      return acc;
    }, {});

    const customerArray = Object.entries(customerCounts).map(([name, count]) => ({ name, count }));
    const sortedCustomers = customerArray.sort((a, b) => b.count - a.count);
    const mostVisitedCustomer = sortedCustomers[0] || { name: 'None', count: 0 };
    const topCustomers = sortedCustomers.slice(0, 5);

    const monthlyData = getMonthlyTrends(visits);
    
    const salesPersonArray = Object.values(salesPersonData).map(sp => ({
      ...sp,
      companyCount: sp.companies.size,
      companies: Array.from(sp.companies)
    }));
    
    const topPerformers = salesPersonArray
      .sort((a, b) => b.visitCount - a.visitCount)
      .slice(0, 5);

    const salesTypeCounts = visits.reduce((acc, visit) => {
      const type = visit.salesType || 'Unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const budgetStats = visits.reduce((acc, visit) => {
      const budget = parseFloat(visit.estimatedBudget) || 0;
      if (budget > 0) {
        acc.total += budget;
        acc.count++;
        if (budget > acc.max) acc.max = budget;
        if (budget < acc.min || acc.min === 0) acc.min = budget;
      }
      return acc;
    }, { total: 0, count: 0, max: 0, min: 0 });

    const avgBudget = budgetStats.count > 0 ? budgetStats.total / budgetStats.count : 0;

    const stats = {
      totalVisitsDone: totalVisits,
      totalExpenses: totalExpenses,
      avgExpensesPerVisit: avgExpensesPerVisit,
      totalSalesPersons: uniqueSalesPersons.size,
      
      mostVisitedCustomer: mostVisitedCustomer,
      topCustomers: topCustomers,
      uniqueCompanies: Object.keys(customerCounts).length,
      
      stageCounts,
      salesTypeCounts,
      
      topPerformers: topPerformers,
      monthlyTrends: monthlyData,
      
      budgetStats: {
        totalBudget: budgetStats.total,
        avgBudget: avgBudget,
        maxBudget: budgetStats.max,
        minBudget: budgetStats.min,
        dealsWithBudget: budgetStats.count
      },
      
      allVisits: visits,
      salesPersonPerformance: salesPersonArray,

      formatCurrency: formatINR
    };

    console.log('Manager dashboard stats calculated:', stats);
    
    return {
      success: true,
      stats
    };
  } catch (error) {
    console.error('Error in getManagerDashboardStats:', error);
    return { success: false, error: error.message };
  }
};

// Helper functions
function getEmptyStats() {
  return {
    totalVisitsDone: 0,
    totalExpenses: 0,
    avgExpensesPerVisit: 0,
    totalSalesPersons: 0,
    mostVisitedCustomer: { name: 'None', count: 0 },
    topCustomers: [],
    uniqueCompanies: 0,
    stageCounts: {},
    salesTypeCounts: {},
    topPerformers: [],
    monthlyTrends: getEmptyMonthlyTrends(),
    budgetStats: {
      totalBudget: 0,
      avgBudget: 0,
      maxBudget: 0,
      minBudget: 0,
      dealsWithBudget: 0
    },
    allVisits: [],
    salesPersonPerformance: [],
    formatCurrency: formatINR
  };
}

function getMonthlyTrends(visits) {
  const monthlyData = {};
  const now = new Date();
  const months = [];
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = date.toLocaleString('default', { month: 'short' });
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    months.push({ 
      month: monthName, 
      key: monthKey,
      date, 
      visits: 0,
      expenses: 0,
      companies: new Set()
    });
  }
  
  visits.forEach(visit => {
    const visitDate = visit.createdAt;
    const visitMonth = visitDate.getMonth();
    const visitYear = visitDate.getFullYear();
    const monthKey = `${visitYear}-${visitMonth}`;
    
    months.forEach(month => {
      if (month.key === monthKey) {
        month.visits++;
        
        const expenses = visit.expenses;
        if (expenses) {
          if (typeof expenses === 'object' && expenses !== null) {
            month.expenses += expenses.total || 0;
          } else if (typeof expenses === 'number') {
            month.expenses += expenses;
          }
        }
        
        if (visit.companyName) {
          month.companies.add(visit.companyName);
        }
      }
    });
  });
  
  return months.map(m => ({ 
    month: m.month, 
    visits: m.visits,
    expenses: m.expenses,
    uniqueCompanies: m.companies.size
  }));
}

function getEmptyMonthlyTrends() {
  const now = new Date();
  const months = [];
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = date.toLocaleString('default', { month: 'short' });
    months.push({ 
      month: monthName, 
      visits: 0,
      expenses: 0,
      uniqueCompanies: 0
    });
  }
  
  return months;
}