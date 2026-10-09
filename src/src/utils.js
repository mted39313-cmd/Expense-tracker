/**
 * Converts a monetary amount from one currency to another using live rates.
 * @param {number} amount - The expense amount in original currency
 * @param {string} fromCurrency - The original currency code
 * @param {string} toCurrency - The target home currency code
 * @param {Object} rates - Dictionary of exchange rates
 * @returns {number} Rounded converted amount
 */
export function convertCurrency(amount, fromCurrency, toCurrency, rates) {
  // Return original amount as fallback if rates data or currency keys are missing
  if (!rates || !rates[fromCurrency] || !rates[toCurrency]) {
    return amount;
  }
  
  // API rates are USD-based by default; convert source amount to USD first
  const amountInUSD = amount / rates[fromCurrency];
  // Convert USD amount to target home currency
  const converted = amountInUSD * rates[toCurrency];
  
  // Return amount rounded to 2 decimal places as a number
  return Number(converted.toFixed(2));
}

/**
 * Calculates the total sum of all expenses converted to the user's home currency.
 * @param {Array} expenses - Array of expense objects
 * @param {string} homeCurrency - The target home currency code
 * @param {Object} rates - Dictionary of exchange rates
 * @returns {number} Total sum in home currency
 */

export function calculateTotal(expenses, homeCurrency, rates) {
  if (!expenses || expenses.length === 0) return 0;
  
  // Use Array.reduce() to accumulate converted expense amounts
  return expenses.reduce((sum, expense) => {
    const converted = convertCurrency(expense.amount, expense.currency, homeCurrency, rates);
    return sum + converted;
  }, 0);
}

/**
 * Filters the expenses array by a selected category.
 * @param {Array} expenses - Array of expense objects
 * @param {string} category - Category name or 'All'
 * @returns {Array} Filtered array of expenses
 */
export function filterExpenses(expenses, category) {
  if (!category || category === 'All') return expenses;
  // Use Array.filter() to match category
  return expenses.filter(expense => expense.category === category);
}