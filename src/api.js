// Base URL for the free Open Exchange Rates REST API
const API_URL = 'https://open.er-api.com/v6/latest/';

/**
 * Fetches live exchange rates for a given base currency.
 * @param {string} baseCurrency - The currency code to fetch rates against (e.g. 'USD')
 * @returns {Promise<Object>} Object containing currency rate key-value pairs
 */
export async function fetchExchangeRates(baseCurrency = 'USD') {
  try {
    // Send asynchronous HTTP GET request to the REST API
    const response = await fetch(`${API_URL}${baseCurrency}`);
    
    // Check if HTTP response status is successful (200-299)
    if (!response.ok) {
      throw new Error(`Failed to fetch rates: ${response.statusText}`);
    }
    
    // Parse response body into JSON
    const data = await response.json();
    
    // Verify API payload indicates success
    if (data.result !== 'success') {
      throw new Error('API returned unsuccessful result');
    }
    
    // Return just the rates dictionary object
    return data.rates;
  } catch (error) {
    // Log error for debugging and rethrow so UI can handle loading/error states
    console.error('Exchange rate fetch error:', error);
    throw error;
  }
}