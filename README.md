# Expense Tracker with Live Currency Conversion

A single-page web application designed for travelers, international freelancers, and online shoppers to log multi-currency expenses and instantly view totals in a chosen home currency using live exchange rates.


## Live Demo
[View Live Site on GitHub Pages](https://mted39313-cmd.github.io/Expense-tracker/)

## Features
- Multi-currency expense logging (USD, EUR, GBP, KES, etc.)
- Live exchange rate integration via `open.er-api.com`
- Automatic running total conversion and category filtering
- Robust loading and error handling states
- Immutable state updates using ES6 spread operators

## Tech Stack
- **REST API**: Open Exchange Rates API (`https://open.er-api.com/v6/latest/USD`)
- **Modules**: ES6 JavaScript Modules (`import`/`export`)
- **Testing**: Jest
- **Static Analysis**: ESLint

## How to Run Locally

1. Clone the repository:
   ```bash
   git clone [https://github.com/mted39313-cmd/Expense-tracker](https://github.com/mted39313-cmd/Expense-tracker)
   cd expense-tracker