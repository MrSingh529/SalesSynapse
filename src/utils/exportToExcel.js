import * as XLSX from 'xlsx';

export const exportToExcel = (data, filename) => {
  // Create worksheet directly from the data
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Visits');
  
  // Set column widths
  const wscols = [
    { wch: 20 }, // Company Name
    { wch: 12 }, // Date
    { wch: 25 }, // Sales Person
    { wch: 15 }, // Sales Type
    { wch: 30 }, // Sales Stage
    { wch: 20 }, // Lead Name
    { wch: 20 }, // Estimated Budget (₹)
    { wch: 18 }, // Travel Expenses (₹)
    { wch: 18 }, // Food Expenses (₹)
    { wch: 22 }, // Accommodation Expenses (₹)
    { wch: 25 }, // Miscellaneous Expenses (₹)
    { wch: 18 }, // Total Expenses (₹)
    { wch: 40 }, // Objective
    { wch: 40 }, // Outcome
    { wch: 40 }, // Discussion Details
    { wch: 40 }  // Additional Notes
  ];
  
  worksheet['!cols'] = wscols;
  
  // Add filters to header row
  worksheet['!autofilter'] = { ref: "A1:P1" };
  
  XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
};