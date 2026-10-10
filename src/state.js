import { fetchExchangeRates } from './api.js';

/**
 * Central State Management class holding application data and immutable modifiers.
 */
class State {
  constructor() {
    this.expenses = [];         // List of logged expense objects
    this.homeCurrency = 'USD';  // Current home currency for totals and conversion
    this.rates = {};            // Fetched exchange rates dictionary
    this.selectedCategory = 'All'; // Current filter category
    this.loading = false;       // Loading state flag
    this.error = null;          // Error message storage
  }

  /**
   * Asynchronously loads exchange rates and updates loading/error flags.
   */
  async loadRates(currency = this.homeCurrency) {
    this.loading = true;
    this.error = null;
    try {
      this.rates = await fetchExchangeRates(currency);
      this.homeCurrency = currency;
    } catch (_err) {
      this.error = 'Could not load live exchange rates. Please check your connection.';
    } finally {
      this.loading = false;
    }
  }

  /**
   * Adds a new expense immutably using the ES6 spread operator.
   */
  addExpense(expenseData) {
    const newExpense = {
      id: Date.now().toString(), // Unique ID based on timestamp
      ...expenseData,
      amount: parseFloat(expenseData.amount)
    };
    // Spread operator creates a brand new array instead of mutating the existing one
    this.expenses = [...this.expenses, newExpense];
  }

  /**
   * Deletes an expense by filtering out its ID immutably.
   */
  deleteExpense(id) {
    // Array.filter creates a new array excluding the matching item ID
    this.expenses = this.expenses.filter(expense => expense.id !== id);
  }

  /**
   * Updates an expense category immutably using map and spread operators.
   */
  updateExpenseCategory(id, newCategory) {
    this.expenses = this.expenses.map(expense => 
      expense.id === id ? { ...expense, category: newCategory } : expense
    );
  }

  setCategoryFilter(category) {
    this.selectedCategory = category;
  }
}

// Export a single shared instance of the state container
export const appState = new State();