let expenses = []; // Array to store expense objects
let totalAmount = 0;

// Get DOM elements
const categorySelect = document.getElementById('category-select');
const amountInput = document.getElementById('amount-input');
const dateInput = document.getElementById('date-input');
const addBtn = document.getElementById('add-btn');
const expenseTableBody = document.getElementById('expense-table-body');
const totalAmountCell = document.getElementById('total-amount');
const clearAllBtn = document.getElementById('clear-all-btn');

// --- Helper Functions ---

// Function to save expenses to localStorage
function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Function to load expenses from localStorage
function loadExpenses() {
    const storedExpenses = localStorage.getItem('expenses');
    if (storedExpenses) {
        expenses = JSON.parse(storedExpenses);
        // Ensure amount is a number after loading from stringified JSON
        expenses.forEach(expense => {
            expense.amount = Number(expense.amount);
        });
        renderExpenses(); // Render loaded expenses
    }
}

// Function to render all expenses in the table
function renderExpenses() {
    // Clear existing table rows
    expenseTableBody.innerHTML = '';
    totalAmount = 0;

    // Loop through expenses array and create table rows
    expenses.forEach((expense, index) => {
        const newRow = expenseTableBody.insertRow();

        const categoryCell = newRow.insertCell();
        const amountCell = newRow.insertCell();
        const dateCell = newRow.insertCell();
        const deleteCell = newRow.insertCell();

        // Add data-label for responsive table headers
        categoryCell.setAttribute('data-label', 'Category:');
        amountCell.setAttribute('data-label', 'Amount:');
        dateCell.setAttribute('data-label', 'Date:');
        deleteCell.setAttribute('data-label', 'Action:');

        categoryCell.textContent = expense.category;
        amountCell.textContent = `₹${expense.amount.toFixed(2)}`; // Format amount
        dateCell.textContent = expense.date; // Use the stored date

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');

        // Add event listener for delete button
        deleteBtn.addEventListener('click', function() {
            // Remove the expense from the array
            expenses.splice(index, 1);
            saveExpenses(); // Save updated expenses
            renderExpenses(); // Re-render the table to reflect changes and update total
        });

        deleteCell.appendChild(deleteBtn);

        totalAmount += expense.amount; // Recalculate total
    });

    totalAmountCell.textContent = `₹${totalAmount.toFixed(2)}`; // Update total display
}

// --- Event Listeners ---

// Add Expense button click handler
addBtn.addEventListener('click', function() {
    const category = categorySelect.value;
    const amount = Number(amountInput.value);
    const date = dateInput.value;

    // Basic validation
    if (category === '') {
        alert('Please select a category!');
        return;
    }
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount!');
        return;
    }
    if (date === '') {
        alert('Please select a date!');
        return;
    }

    // Add new expense to the array
    expenses.push({ category, amount, date });
    saveExpenses(); // Save to localStorage

    // Re-render the table to show the new expense and updated total
    renderExpenses();

    // Clear input fields after adding
    amountInput.value = '';
    dateInput.value = '';
    categorySelect.value = 'College Fee'; // Reset to default category
});

// Clear All Expenses button click handler
clearAllBtn.addEventListener('click', function() {
    if (confirm('Are you sure you want to clear all expenses? This cannot be undone.')) {
        expenses = []; // Empty the expenses array
        saveExpenses(); // Clear localStorage
        renderExpenses(); // Re-render the table (which will now be empty)
    }
});

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', loadExpenses); // Load expenses when the DOM is ready
