import { appState } from './state.js';
import { renderApp } from './ui.js';

// Central event handler definitions linking UI triggers to state changes and re-rendering
const handlers = {
  onRetry: async () => {
    await appState.loadRates(appState.homeCurrency);
    updateUI();
  },
  onHomeCurrencyChange: async (newCurrency) => {
    await appState.loadRates(newCurrency);
    updateUI();
  },
  onFilterChange: (category) => {
    appState.setCategoryFilter(category);
    updateUI();
  },
  onAddExpense: (expenseData) => {
    appState.addExpense(expenseData);
    updateUI();
  },
  onDeleteExpense: (id) => {
    appState.deleteExpense(id);
    updateUI();
  }
};

/**
 * Triggers a fresh UI render pass using current state and handlers.
 */
function updateUI() {
  renderApp(appState, handlers);
}

/**
 * Application entry point: fetches initial rates and renders first view.
 */
async function init() {
  await appState.loadRates('USD');
  updateUI();
}

// Run initialization on script load
init();