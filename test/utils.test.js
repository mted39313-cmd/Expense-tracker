import { convertCurrency, calculateTotal, filterExpenses } from '../src/utils.js';

describe('Utility Functions Unit Tests', () => {
  // Mock exchange rates dictionary for testing math logic offline
  const mockRates = {
    USD: 1,
    EUR: 0.85,
    KES: 130
  };

  test('convertCurrency converts correctly between currencies', () => {
    // 130 KES at rate 130 per USD converted to USD should equal 1.00
    const converted = convertCurrency(130, 'KES', 'USD', mockRates);
    expect(converted).toBe(1.00);
  });

  test('convertCurrency returns original amount if rates are missing (edge case)', () => {
    const amount = 50;
    // 'XXX' is an invalid currency code not present in mockRates
    expect(convertCurrency(amount, 'XXX', 'USD', mockRates)).toBe(50);
  });

  test('calculateTotal computes correct sum in home currency', () => {
    const expenses = [
      { amount: 100, currency: 'USD', category: 'Food' },
      { amount: 85, currency: 'EUR', category: 'Transport' }
    ];
    // EUR 85 converts to USD 100. Total = 100 + 100 = 200 USD.
    const total = calculateTotal(expenses, 'USD', mockRates);
    expect(total).toBe(200);
  });

  test('filterExpenses filters correctly by category', () => {
    const expenses = [
      { id: '1', category: 'Food', amount: 10 },
      { id: '2', category: 'Transport', amount: 20 },
      { id: '3', category: 'Food', amount: 30 }
    ];
    const foodExpenses = filterExpenses(expenses, 'Food');
    expect(foodExpenses.length).toBe(2);
    expect(foodExpenses[0].id).toBe('1');
  });

  test('filterExpenses returns all expenses when category is All', () => {
    const expenses = [
      { id: '1', category: 'Food' },
      { id: '2', category: 'Transport' }
    ];
    expect(filterExpenses(expenses, 'All').length).toBe(2);
  });
});