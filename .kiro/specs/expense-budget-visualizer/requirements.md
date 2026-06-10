# Requirements Document

## Introduction

The Expense & Budget Visualizer is a client-side web application that enables users to record, categorize, and visualize their personal expenses. All data is persisted in the browser's Local Storage with no backend server required. The app supports light/dark themes, sortable transaction history, per-transaction budget limit warnings, and a pie chart breakdown of spending by category. It runs as a standalone web page built with HTML, CSS, and Vanilla JavaScript and must work in all modern browsers.

---

## Glossary

- **App**: The Expense & Budget Visualizer web application as a whole.
- **Transaction**: A single recorded expense entry consisting of a name, amount, category, optional budget limit, and timestamp.
- **Category**: A predefined label used to group transactions (Food, Transport, Fun).
- **Budget_Limit**: An optional per-transaction amount threshold above which a visual warning is shown.
- **Total_Balance**: The sum of all recorded transaction amounts currently stored.
- **Transaction_List**: The rendered ordered list of all stored transactions visible to the user.
- **Chart**: The pie chart that displays spending totals broken down by category.
- **Storage**: The browser's Local Storage API used to persist all application data.
- **Theme**: The active color scheme of the App — either `light` or `dark`.
- **Sort_Order**: The user-selected ordering applied to the Transaction_List (by date or amount, ascending or descending).

---

## Requirements

### Requirement 1: Add a Transaction

**User Story:** As a user, I want to add an expense transaction with a name, amount, and category, so that I can track what I have spent money on.

#### Acceptance Criteria

1. WHEN the user submits the Add Transaction form with a valid item name (1–100 characters), a positive numeric amount (greater than 0 and no greater than 999,999,999.99), and a selected category, THE App SHALL create a new Transaction containing those values plus a UTC timestamp and a unique numeric ID.
2. WHEN a new Transaction is created, THE App SHALL append the Transaction to the stored transaction data in Storage and reflect it in the Transaction_List and Chart without requiring a page reload.
3. IF the user submits the Add Transaction form with an empty item name, a non-numeric amount, a zero or negative amount, an amount exceeding 999,999,999.99, or no category selected, THEN THE App SHALL display an alert message instructing the user to fill in all mandatory fields correctly and SHALL NOT create a Transaction.
4. WHEN a Transaction is successfully added, THE App SHALL reset all four fields of the Add Transaction form (item name, amount, category, and budget limit) to their default empty state.

---

### Requirement 2: Optional Budget Limit Warning

**User Story:** As a user, I want to optionally set a budget limit on a transaction, so that transactions exceeding my threshold are visually highlighted.

#### Acceptance Criteria

1. WHERE the user provides a numeric Budget_Limit value greater than 0 when submitting the form, THE App SHALL store the Budget_Limit alongside the Transaction.
2. WHILE rendering the Transaction_List, THE App SHALL apply the `limit-exceeded` CSS class to any Transaction whose amount is strictly greater than its stored Budget_Limit.
3. WHERE no Budget_Limit is provided by the user, THE App SHALL store the Transaction with a null limit and SHALL NOT apply the `limit-exceeded` CSS class to that Transaction.
4. IF the user provides a Budget_Limit value that is zero or less, THEN THE App SHALL display an alert message informing the user that the budget limit must be a positive number and SHALL NOT create the Transaction.

---

### Requirement 3: Delete a Transaction

**User Story:** As a user, I want to delete a transaction from the list, so that I can remove entries I recorded in error.

#### Acceptance Criteria

1. WHEN the user activates the Delete control on a Transaction that is currently visible in the Transaction_List, THE App SHALL immediately remove that Transaction from Storage, remove it from the Transaction_List, recalculate and display the updated Total_Balance, and update the Chart to reflect the revised per-category totals.
2. THE App SHALL display the Total_Balance as the sum of all remaining Transaction amounts in Storage, formatted to two decimal places with a dollar sign prefix, after each deletion.

---

### Requirement 4: Display Total Balance

**User Story:** As a user, I want to see the total of all my recorded expenses, so that I know how much I have spent overall.

#### Acceptance Criteria

1. THE App SHALL calculate the Total_Balance as the sum of all Transaction amounts currently in Storage; IF Storage contains no transactions, THE App SHALL display a Total_Balance of `$0.00`.
2. WHEN the App loads, THE App SHALL calculate and display the Total_Balance from all Transactions currently in Storage.
3. WHEN a Transaction is added, THE App SHALL recalculate and display the updated Total_Balance formatted to two decimal places with a dollar sign prefix.
4. WHEN a Transaction is deleted, THE App SHALL recalculate and display the updated Total_Balance formatted to two decimal places with a dollar sign prefix.

---

### Requirement 5: Spending Chart by Category

**User Story:** As a user, I want to see a pie chart of my spending broken down by category, so that I can understand where my money is going.

#### Acceptance Criteria

1. THE App SHALL render a pie chart showing the summed transaction amounts for each Category (Food, Transport, Fun) that has a total greater than zero, omitting any Category with a total of zero from the chart.
2. WHEN any Transaction is added or deleted, THE App SHALL update the Chart to reflect the current category totals.
3. THE Chart SHALL display a legend positioned at the bottom of the chart area.
4. IF the Theme is `dark`, THEN THE Chart legend labels SHALL use the light text color defined by the active Theme.
5. IF the Theme is `light`, THEN THE Chart legend labels SHALL use the dark text color defined by the active Theme.
6. IF no Transactions exist, THEN THE App SHALL display a placeholder message in the chart area indicating that there is no spending data to display.

---

### Requirement 6: Sort Transaction History

**User Story:** As a user, I want to sort my transaction list by date or amount, so that I can review my expenses in the order most useful to me.

#### Acceptance Criteria

1. THE App SHALL provide Sort_Order options: newest-first (date descending), oldest-first (date ascending), highest-amount (amount descending), and lowest-amount (amount ascending).
2. WHEN the user changes the Sort_Order selection, THE App SHALL re-render the Transaction_List in the chosen order within 300 ms, using stable sort (preserving original insertion order for transactions with equal sort values), without modifying the underlying stored data.
3. THE App SHALL default the Sort_Order to newest-first on every load, regardless of any previously used sort order.

---

### Requirement 7: Persist Data Across Sessions

**User Story:** As a user, I want my transactions and preferences to be saved in the browser, so that my data is still available when I reopen the app.

#### Acceptance Criteria

1. WHEN a Transaction is added or deleted, THE App SHALL write the complete updated transaction array to Storage under a designated key.
2. WHEN the App initialises, THE App SHALL read the transaction array from Storage, render all stored Transactions in the Transaction_List, display the correct Total_Balance, and update the Chart to reflect current category totals.
3. IF no transaction data exists in Storage at initialisation, THEN THE App SHALL initialise with an empty transaction array and display a Total_Balance of `$0.00`.
4. IF the transaction data retrieved from Storage at initialisation cannot be parsed as valid JSON, THEN THE App SHALL discard the corrupt data, initialise with an empty transaction array, and display a Total_Balance of `$0.00`.

---

### Requirement 8: Light / Dark Theme Toggle

**User Story:** As a user, I want to toggle between light and dark mode, so that I can use the app comfortably in different lighting conditions.

#### Acceptance Criteria

1. WHEN the user activates the theme toggle control, THE App SHALL switch the Theme between `light` and `dark`.
2. WHEN the Theme changes, THE App SHALL update the `data-theme` attribute on the root HTML element to the new Theme value and re-render the Chart so that legend label color matches the main text color defined for the active Theme.
3. WHEN the Theme is changed, THE App SHALL persist the new Theme value to Storage.
4. WHEN the Theme is `light`, THE App SHALL display the toggle button label as "🌙 Dark Mode"; WHEN the Theme is `dark`, THE App SHALL display the toggle button label as "☀️ Light Mode".
5. WHEN the App initialises, THE App SHALL read the Theme from browser's persistent local storage, update the `data-theme` attribute on the root HTML element to the stored value, and re-render the Chart legend to match; IF no Theme is stored or IF the Storage read operation fails, THEN THE App SHALL default to `light` Theme.

---

### Requirement 9: Responsive Layout

**User Story:** As a user, I want the app to be usable on both desktop and mobile screens, so that I can record expenses from any device.

#### Acceptance Criteria

1. WHILE the viewport width is greater than 768px, THE App SHALL display the Add Transaction form and the Chart side-by-side in a two-column grid layout.
2. WHILE the viewport width is 768px or less, THE App SHALL stack the Add Transaction form and the Chart vertically in a single-column layout, each panel spanning the full available width with no horizontal scrollbar visible.

---

### Requirement 10: Browser Compatibility

**User Story:** As a developer, I want the app to work across all major modern browsers, so that users are not restricted to a specific browser.

#### Acceptance Criteria

1. THE App SHALL function correctly in the current stable versions of Chrome, Firefox, Edge, and Safari using only standard HTML, CSS, and Vanilla JavaScript APIs, with no browser-specific prefixes or non-standard extensions.
2. THE App SHALL use the browser Local Storage API as the sole data persistence mechanism, with no backend server or external database required.
3. IF the browser's Local Storage API is unavailable (e.g., private browsing mode or storage blocked by browser settings), THEN THE App SHALL display a warning message informing the user that data cannot be saved and SHALL operate in a session-only mode where transactions are held in memory for the current session only.
