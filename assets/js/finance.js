// Finance functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load finance data from localStorage
    let financeData = JSON.parse(localStorage.getItem('finance_data') || '[]');
    
    // Current filter
    let currentFilter = 'all';
    
    // DOM elements
    const transactionsList = document.getElementById('transactions-list');
    const transactionModal = document.getElementById('transaction-modal');
    const addTransactionBtn = document.getElementById('add-transaction-btn');
    const closeModal = document.getElementById('close-modal');
    const saveTransactionBtn = document.getElementById('save-transaction-btn');
    const deleteTransactionBtn = document.getElementById('delete-transaction-btn');
    const transactionTypeRadios = document.querySelectorAll('.transaction-type-radio');
    const transactionAmount = document.getElementById('transaction-amount');
    const transactionDescription = document.getElementById('transaction-description');
    const transactionDate = document.getElementById('transaction-date');
    const transactionId = document.getElementById('transaction-id');
    const modalTitle = document.getElementById('modal-title');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const totalBalance = document.getElementById('total-balance');
    const totalIncome = document.getElementById('total-income');
    const totalExpenses = document.getElementById('total-expenses');
    const financeChart = document.getElementById('finance-chart');
    
    // Set today's date as default
    const today = new Date();
    transactionDate.value = today.toISOString().split('T')[0];
    
    // Display transactions based on filter
    function displayTransactions() {
        // Filter transactions based on current filter
        let filteredTransactions = [];
        if (currentFilter === 'income') {
            filteredTransactions = financeData.filter(transaction => transaction.type === 'income');
        } else if (currentFilter === 'expense') {
            filteredTransactions = financeData.filter(transaction => transaction.type === 'expense');
        } else {
            filteredTransactions = [...financeData];
        }
        
        // Sort by date descending
        filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (filteredTransactions.length === 0) {
            const filterText = currentFilter === 'all' ? 'transaksi' :
                              currentFilter === 'income' ? 'pemasukan' : 'pengeluaran';
            transactionsList.innerHTML = `<p class="text-gray-500 dark:text-gray-400 text-center py-8">Belum ada ${filterText}.</p>`;
            return;
        }
        
        transactionsList.innerHTML = '';
        filteredTransactions.forEach(transaction => {
            const transactionElement = document.createElement('div');
            transactionElement.className = 'flex items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600';
            const isIncome = transaction.type === 'income';
            transactionElement.innerHTML = `
                <div class="mr-4">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center ${isIncome ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'}">
                        <i class="fas ${isIncome ? 'fa-arrow-down' : 'fa-arrow-up'} ${isIncome ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}"></i>
                    </div>
                </div>
                <div class="flex-1">
                    <h3 class="font-medium text-gray-800 dark:text-white">${transaction.description}</h3>
                    <p class="text-gray-600 dark:text-gray-400 text-sm">${new Date(transaction.date).toLocaleDateString()}</p>
                </div>
                <div class="font-medium ${isIncome ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}">
                    ${isIncome ? '+' : '-'}Rp${parseFloat(transaction.amount).toFixed(2)}
                </div>
                <button class="ml-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 edit-transaction" data-id="${transaction.id}">
                    <i class="fas fa-edit"></i>
                </button>
            `;
            transactionsList.appendChild(transactionElement);
        });
        
        // Add event listeners to edit buttons
        document.querySelectorAll('.edit-transaction').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                openTransactionModal(id);
            });
        });
    }
    
    // Update balance summary
    function updateBalanceSummary() {
        let income = 0;
        let expenses = 0;
        
        financeData.forEach(transaction => {
            if (transaction.type === 'income') {
                income += parseFloat(transaction.amount);
            } else if (transaction.type === 'expense') {
                expenses += parseFloat(transaction.amount);
            }
        });
        
        const balance = income - expenses;
        
        totalBalance.textContent = `Rp${balance.toFixed(2)}`;
        totalIncome.textContent = `Rp${income.toFixed(2)}`;
        totalExpenses.textContent = `Rp${expenses.toFixed(2)}`;
        
        // Apply color based on balance
        if (balance < 0) {
            totalBalance.classList.remove('text-green-600', 'dark:text-green-400');
            totalBalance.classList.add('text-red-600', 'dark:text-red-400');
        } else {
            totalBalance.classList.remove('text-red-600', 'dark:text-red-400');
            totalBalance.classList.add('text-green-600', 'dark:text-green-400');
        }
    }
    
    // Display finance chart
    function displayFinanceChart() {
        financeChart.innerHTML = '';
        
        if (financeData.length === 0) {
            financeChart.innerHTML = '<p class="text-gray-500 dark:text-gray-400 text-center w-full py-16">Belum ada data transaksi</p>';
            return;
        }
        
        // Get current month and year
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        // Create array for last 6 months
        const months = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date(currentYear, currentMonth - i, 1);
            months.push({
                month: date.getMonth(),
                year: date.getFullYear(),
                label: date.toLocaleDateString('en-US', { month: 'short' }),
                income: 0,
                expenses: 0
            });
        }
        
        // Calculate income and expenses for each month
        financeData.forEach(transaction => {
            const transactionDate = new Date(transaction.date);
            const transactionMonth = transactionDate.getMonth();
            const transactionYear = transactionDate.getFullYear();
            
            months.forEach(month => {
                if (month.month === transactionMonth && month.year === transactionYear) {
                    if (transaction.type === 'income') {
                        month.income += parseFloat(transaction.amount);
                    } else if (transaction.type === 'expense') {
                        month.expenses += parseFloat(transaction.amount);
                    }
                }
            });
        });
        
        // Create chart
        const chartContainer = document.createElement('div');
        chartContainer.className = 'flex items-end justify-between w-full h-full';
        
        months.forEach(month => {
            const monthContainer = document.createElement('div');
            monthContainer.className = 'flex flex-col items-center flex-1 px-1';
            
            const barsContainer = document.createElement('div');
            barsContainer.className = 'flex items-end justify-center space-x-1 mt-auto';
            
            // Income bar
            const incomeBar = document.createElement('div');
            incomeBar.className = 'w-4 bg-green-500 rounded-t hover:bg-green-600 transition-all';
            incomeBar.style.height = `${Math.min(100, month.income)}%`;
            
            // Expense bar
            const expenseBar = document.createElement('div');
            expenseBar.className = 'w-4 bg-red-500 rounded-t hover:bg-red-600 transition-all';
            expenseBar.style.height = `${Math.min(100, month.expenses)}%`;
            
            barsContainer.appendChild(expenseBar);
            barsContainer.appendChild(incomeBar);
            
            const monthLabel = document.createElement('div');
            monthLabel.className = 'text-xs text-gray-500 dark:text-gray-400 mt-2';
            monthLabel.textContent = month.label;
            
            monthContainer.appendChild(barsContainer);
            monthContainer.appendChild(monthLabel);
            chartContainer.appendChild(monthContainer);
        });
        
        financeChart.appendChild(chartContainer);
    }
    
    // Open transaction modal
    function openTransactionModal(id = null) {
        if (id) {
            // Edit existing transaction
            const transaction = financeData.find(transaction => transaction.id === id);
            if (transaction) {
                transactionId.value = transaction.id;
                document.querySelector(`.transaction-type-radio[value="${transaction.type}"]`).checked = true;
                transactionAmount.value = transaction.amount;
                transactionDescription.value = transaction.description;
                transactionDate.value = transaction.date;
                modalTitle.textContent = 'Edit Transaksi';
                deleteTransactionBtn.classList.remove('hidden');
            }
        } else {
            // Create new transaction
            transactionId.value = '';
            document.querySelector('.transaction-type-radio[value="income"]').checked = true;
            transactionAmount.value = '';
            transactionDescription.value = '';
            transactionDate.value = today.toISOString().split('T')[0];
            modalTitle.textContent = 'Tambah Transaksi';
            deleteTransactionBtn.classList.add('hidden');
        }
        
        transactionModal.classList.remove('hidden');
    }
    
    // Close transaction modal
    function closeTransactionModal() {
        transactionModal.classList.add('hidden');
    }
    
    // Save transaction
    function saveTransaction() {
        const id = transactionId.value;
        const type = document.querySelector('.transaction-type-radio:checked').value;
        const amount = transactionAmount.value.trim();
        const description = transactionDescription.value.trim();
        const date = transactionDate.value;
        
        if (!amount || !description || !date) {
            alert('Harap isi semua kolom!');
            return;
        }

        if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            alert('Harap masukkan jumlah yang valid!');
            return;
        }
        
        if (id) {
            // Update existing transaction
            const transactionIndex = financeData.findIndex(transaction => transaction.id === id);
            if (transactionIndex !== -1) {
                financeData[transactionIndex].type = type;
                financeData[transactionIndex].amount = parseFloat(amount);
                financeData[transactionIndex].description = description;
                financeData[transactionIndex].date = date;
                financeData[transactionIndex].updated_at = Date.now();
            }
        } else {
            // Create new transaction
            const newTransaction = {
                id: generateId(),
                type: type,
                amount: parseFloat(amount),
                description: description,
                date: date,
                created_at: Date.now()
            };
            financeData.push(newTransaction);
        }
        
        // Save to localStorage
        localStorage.setItem('finance_data', JSON.stringify(financeData));
        
        // Refresh displays
        displayTransactions();
        updateBalanceSummary();
        displayFinanceChart();
        
        // Close modal
        closeTransactionModal();
    }
    
    // Delete transaction
    function deleteTransaction() {
        const id = transactionId.value;
        if (id && confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
            financeData = financeData.filter(transaction => transaction.id !== id);
            localStorage.setItem('finance_data', JSON.stringify(financeData));
            displayTransactions();
            updateBalanceSummary();
            displayFinanceChart();
            closeTransactionModal();
        }
    }
    
    // Generate unique ID
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    // Set filter
    function setFilter(filter) {
        currentFilter = filter;
        
        // Update active filter button
        filterButtons.forEach(btn => {
            if (btn.getAttribute('data-filter') === filter) {
                btn.classList.add('active');
                btn.classList.remove('bg-gray-200', 'dark:bg-gray-700', 'hover:bg-gray-300', 'dark:hover:bg-gray-600');
                btn.classList.add('bg-purple-500', 'text-white');
            } else {
                btn.classList.remove('active');
                btn.classList.remove('bg-purple-500', 'text-white');
                btn.classList.add('bg-gray-200', 'dark:bg-gray-700', 'hover:bg-gray-300', 'dark:hover:bg-gray-600');
            }
        });
        
        displayTransactions();
    }
    
    // Event listeners
    addTransactionBtn.addEventListener('click', () => openTransactionModal());
    closeModal.addEventListener('click', closeTransactionModal);
    saveTransactionBtn.addEventListener('click', saveTransaction);
    deleteTransactionBtn.addEventListener('click', deleteTransaction);
    
    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            setFilter(filter);
        });
    });
    
    // Close modal when clicking outside
    transactionModal.addEventListener('click', function(e) {
        if (e.target === transactionModal) {
            closeTransactionModal();
        }
    });
    
    // Initial display
    displayTransactions();
    updateBalanceSummary();
    displayFinanceChart();
});