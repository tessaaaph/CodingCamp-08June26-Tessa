let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let currentTheme = localStorage.getItem('theme') || 'light';
let myChart = null;

const expenseForm = document.getElementById('expenseForm');
const itemNameInput = document.getElementById('itemName');
const amountInput = document.getElementById('amount');
const categorySelect = document.getElementById('category');
const budgetLimitInput = document.getElementById('budgetLimit');
const transactionList = document.getElementById('transactionList');
const totalBalanceDisplay = document.getElementById('totalBalance');
const sortBySelect = document.getElementById('sortBy');
const themeToggleBtn = document.getElementById('themeToggle');

document.documentElement.setAttribute('data-theme', currentTheme);

expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = itemNameInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const category = categorySelect.value;
    const limit = budgetLimitInput.value ? parseFloat(budgetLimitInput.value) : null;

    if (!name || isNaN(amount) || !category) {
        alert('Please fill in all mandatory data fields correctly.');
        return;
    }

    const newTransaction = {
        id: Date.now(),
        name,
        amount,
        category,
        limit,
        date: new Date().toISOString()
    };

    transactions.push(newTransaction);
    saveData();
    updateUI();
    expenseForm.reset();
});

function deleteTransaction(id) {
    transactions = transactions.filter(item => item.id !== id);
    saveData();
    updateUI();
}

function saveData() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function updateUI() {
    const total = transactions.reduce((sum, item) => sum + item.amount, 0);
    totalBalanceDisplay.textContent = `$${total.toFixed(2)}`;

    let sortedItems = [...transactions];
    const sortingStrategy = sortBySelect.value;

    if (sortingStrategy === 'date-desc') {
        sortedItems.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortingStrategy === 'date-asc') {
        sortedItems.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortingStrategy === 'amount-desc') {
        sortedItems.sort((a, b) => b.amount - a.amount);
    } else if (sortingStrategy === 'amount-asc') {
        sortedItems.sort((a, b) => a.amount - b.amount);
    }

    transactionList.innerHTML = '';
    sortedItems.forEach(item => {
        const li = document.createElement('li');
        li.className = 'transaction-item';
        
        if (item.limit !== null && item.amount > item.limit) {
            li.classList.add('limit-exceeded');
        }

        li.innerHTML = `
            <div class="item-info">
                <h4>${item.name}</h4>
                <span class="item-category">${item.category}</span>
            </div>
            <div class="item-right">
                <span class="item-amount">$${item.amount.toFixed(2)}</span>
                <button class="btn-delete" onclick="deleteTransaction(${item.id})">Delete</button>
            </div>
        `;
        transactionList.appendChild(li);
    });

    updateChartData();
}

function updateChartData() {
    const categories = { Food: 0, Transport: 0, Fun: 0 };
    
    transactions.forEach(item => {
        if (categories.hasOwnProperty(item.category)) {
            categories[item.category] += item.amount;
        }
    });

    const chartData = [categories.Food, categories.Transport, categories.Fun];
    const ctx = document.getElementById('spendingChart').getContext('2d');

    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Food', 'Transport', 'Fun'],
            datasets: [{
                data: chartData,
                backgroundColor: ['#2ecc71', '#3498db', '#e67e22'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: currentTheme === 'dark' ? '#f7fafc' : '#333333'
                    }
                }
            }
        }
    });
}

sortBySelect.addEventListener('change', updateUI);

themeToggleBtn.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateUI(); 
});

updateUI();