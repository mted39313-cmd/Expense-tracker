import { convertCurrency, calculateTotal, filterExpenses } from './utils.js';

/**
 * Renders the entire single-page application UI based on current state.
 * @param {Object} state - Current application state instance
 * @param {Object} handlers - Dictionary of UI event callback functions
 */
export function renderApp(state, handlers) {
  const appContainer = document.getElementById('app');
  
  // 1. Render Loading State view if fetch is in progress
  if (state.loading) {
    appContainer.innerHTML = `<div class="status-message">Loading live exchange rates...</div>`;
    return;
  }

  
  // 2. Render Error State view with a retry action if fetch failed
  if (state.error) {
    appContainer.innerHTML = `
      <div class="status-message error">
        <p>${state.error}</p>
        <button id="retry-btn">Retry</button>
      </div>
    `;
    document.getElementById('retry-btn').addEventListener('click', handlers.onRetry);
    return;
  }


  // Compute filtered expenses and total spending for dashboard display
  const filtered = filterExpenses(state.expenses, state.selectedCategory);
  const total = calculateTotal(state.expenses, state.homeCurrency, state.rates);

  // 3. Render Main App Layout Template via innerHTML
  appContainer.innerHTML = `
    <header class="app-header">
      <h1>Expense Tracker</h1>
      <div class="settings-bar">
        <label for="home-currency-select">Home Currency:</label>
        <select id="home-currency-select">
          ${['USD', 'EUR', 'GBP', 'KES', 'CAD', 'JPY'].map(curr => `
            <option value="${curr}" ${state.homeCurrency === curr ? 'selected' : ''}>${curr}</option>
          `).join('')}
        </select>
      </div>
    </header>


    <section class="form-section">
      <form id="expense-form">
        <input type="text" id="description" placeholder="Description (e.g. Coffee)" required />
        <input type="number" id="amount" placeholder="Amount" step="0.01" required />
        <select id="currency">
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="KES">KES</option>
        </select>
        <select id="category">
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Shopping">Shopping</option>
          <option value="Bills">Bills</option>
        </select>
        <button type="submit">Add Expense</button>
      </form>
    </section>

    <section class="dashboard-section">
      <div class="total-card">
        <h3>Total Spending</h3>
        <p class="total-amount">${state.homeCurrency} ${total.toFixed(2)}</p>
      </div>
      <div class="filter-bar">
        <label>Filter Category:</label>
        <select id="category-filter">
          <option value="All" ${state.selectedCategory === 'All' ? 'selected' : ''}>All</option>
          <option value="Food" ${state.selectedCategory === 'Food' ? 'selected' : ''}>Food</option>
          <option value="Transport" ${state.selectedCategory === 'Transport' ? 'selected' : ''}>Transport</option>
          <option value="Shopping" ${state.selectedCategory === 'Shopping' ? 'selected' : ''}>Shopping</option>
          <option value="Bills" ${state.selectedCategory === 'Bills' ? 'selected' : ''}>Bills</option>
        </select>
      </div>
    </section>

    <section class="list-section">
      <h2>Logged Expenses</h2>
      <ul id="expense-list">
        ${filtered.length === 0 ? '<li class="empty">No expenses logged yet.</li>' : ''}
        ${filtered.map(exp => {
          const converted = convertCurrency(exp.amount, exp.currency, state.homeCurrency, state.rates);
          return `
            <li class="expense-item" data-id="${exp.id}">
              <div class="exp-details">
                <strong>${exp.description}</strong>
                <span class="badge">${exp.category}</span>
              </div>
              <div class="exp-amounts">
                <span class="orig">${exp.currency}${exp.amount.toFixed(2)}</span>
                <span class="conv">≈ ${state.homeCurrency}${converted.toFixed(2)}</span>
                <button class="delete-btn" data-id="${exp.id}">×</button>
              </div>
            </li>
          `;
        }).join('')}
      </ul>
    </section>
  `;

  // Attach interactive DOM event listeners after rendering HTML
  attachEventListeners(handlers);
}

/**
 * Binds browser DOM events to handler callback functions.
 */
function attachEventListeners(handlers) {
  // Home currency dropdown change handler
  document.getElementById('home-currency-select').addEventListener('change', (e) => {
    handlers.onHomeCurrencyChange(e.target.value);
  });

  // Category filter dropdown change handler
  document.getElementById('category-filter').addEventListener('change', (e) => {
    handlers.onFilterChange(e.target.value);
  });

  // Expense form submission handler
  document.getElementById('expense-form').addEventListener('submit', (e) => {
    e.preventDefault();
    handlers.onAddExpense({
      description: document.getElementById('description').value,
      amount: document.getElementById('amount').value,
      currency: document.getElementById('currency').value,
      category: document.getElementById('category').value
    });
    e.target.reset();
  });

  // Expense item delete button click handlers
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      handlers.onDeleteExpense(e.target.dataset.id);
    });
  });
}