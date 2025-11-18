// Todo functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load todos from localStorage
    let todoData = JSON.parse(localStorage.getItem('todo_data') || '[]');
    
    // Current filter
    let currentFilter = 'all';
    
    // DOM elements
    const todoList = document.getElementById('todo-list');
    const taskModal = document.getElementById('task-modal');
    const addTaskBtn = document.getElementById('add-task-btn');
    const closeModal = document.getElementById('close-modal');
    const saveTaskBtn = document.getElementById('save-task-btn');
    const deleteTaskBtn = document.getElementById('delete-task-btn');
    const taskTitle = document.getElementById('task-title');
    const taskDueDate = document.getElementById('task-due-date');
    const taskPriority = document.getElementById('task-priority');
    const taskId = document.getElementById('task-id');
    const modalTitle = document.getElementById('modal-title');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Display todos based on filter
    function displayTodos() {
        // Filter todos based on current filter
        let filteredTodos = [];
        if (currentFilter === 'active') {
            filteredTodos = todoData.filter(todo => !todo.completed);
        } else if (currentFilter === 'completed') {
            filteredTodos = todoData.filter(todo => todo.completed);
        } else {
            filteredTodos = [...todoData];
        }
        
        if (filteredTodos.length === 0) {
            const filterText = currentFilter === 'all' ? 'tasks' : 
                              currentFilter === 'active' ? 'active tasks' : 'completed tasks';
            todoList.innerHTML = `<p class="text-gray-500 dark:text-gray-400 text-center py-8">No ${filterText} yet.</p>`;
            return;
        }
        
        todoList.innerHTML = '';
        filteredTodos.forEach(todo => {
            const todoElement = document.createElement('div');
            todoElement.className = 'flex items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600';
            todoElement.innerHTML = `
                <div class="flex items-center flex-1">
                    <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                           class="w-5 h-5 text-blue-500 rounded focus:ring-blue-400 focus:ring-2 cursor-pointer task-checkbox" 
                           data-id="${todo.id}">
                    <div class="ml-4 flex-1">
                        <h3 class="font-medium text-gray-800 dark:text-white ${todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}">${todo.title}</h3>
                        <div class="flex flex-wrap gap-2 mt-1">
                            ${todo.due_date ? `<span class="text-xs px-2 py-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">${new Date(todo.due_date).toLocaleDateString()}</span>` : ''}
                            <span class="text-xs px-2 py-1 rounded ${todo.priority === 'high' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' : todo.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'}">${todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}</span>
                        </div>
                    </div>
                </div>
                <button class="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 edit-task" data-id="${todo.id}">
                    <i class="fas fa-edit"></i>
                </button>
            `;
            todoList.appendChild(todoElement);
        });
        
        // Add event listeners to checkboxes
        document.querySelectorAll('.task-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const id = this.getAttribute('data-id');
                toggleTaskCompletion(id, this.checked);
            });
        });
        
        // Add event listeners to edit buttons
        document.querySelectorAll('.edit-task').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                openTaskModal(id);
            });
        });
    }
    
    // Toggle task completion status
    function toggleTaskCompletion(id, completed) {
        const todoIndex = todoData.findIndex(todo => todo.id === id);
        if (todoIndex !== -1) {
            todoData[todoIndex].completed = completed;
            todoData[todoIndex].completed_at = completed ? Date.now() : null;
            localStorage.setItem('todo_data', JSON.stringify(todoData));
            displayTodos();
        }
    }
    
    // Open task modal
    function openTaskModal(id = null) {
        if (id) {
            // Edit existing task
            const task = todoData.find(todo => todo.id === id);
            if (task) {
                taskId.value = task.id;
                taskTitle.value = task.title || '';
                taskDueDate.value = task.due_date || '';
                taskPriority.value = task.priority || 'medium';
                modalTitle.textContent = 'Edit Tugas';
                deleteTaskBtn.classList.remove('hidden');
            }
        } else {
            // Create new task
            taskId.value = '';
            taskTitle.value = '';
            taskDueDate.value = '';
            taskPriority.value = 'medium';
            modalTitle.textContent = 'Tambah Tugas';
            deleteTaskBtn.classList.add('hidden');
        }
        
        taskModal.classList.remove('hidden');
    }
    
    // Close task modal
    function closeTaskModal() {
        taskModal.classList.add('hidden');
    }
    
    // Save task
    function saveTask() {
        const id = taskId.value;
        const title = taskTitle.value.trim();
        const dueDate = taskDueDate.value;
        const priority = taskPriority.value;
        
        if (!title) {
            alert('Judul Tugas Tidak Boleh Kosong!');
            return;
        }
        
        if (id) {
            // Update existing task
            const taskIndex = todoData.findIndex(todo => todo.id === id);
            if (taskIndex !== -1) {
                todoData[taskIndex].title = title;
                todoData[taskIndex].due_date = dueDate || null;
                todoData[taskIndex].priority = priority;
                todoData[taskIndex].updated_at = Date.now();
            }
        } else {
            // Create new task
            const newTask = {
                id: generateId(),
                title: title,
                due_date: dueDate || null,
                priority: priority,
                completed: false,
                created_at: Date.now(),
                updated_at: Date.now()
            };
            todoData.push(newTask);
        }
        
        // Save to localStorage
        localStorage.setItem('todo_data', JSON.stringify(todoData));
        
        // Refresh display
        displayTodos();
        
        // Close modal
        closeTaskModal();
    }
    
    // Delete task
    function deleteTask() {
        const id = taskId.value;
        if (id && confirm('Apakah kamu yakin ingin menghapus tugas ini?')) {
            todoData = todoData.filter(todo => todo.id !== id);
            localStorage.setItem('todo_data', JSON.stringify(todoData));
            displayTodos();
            closeTaskModal();
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

        // Remove default gray classes
        btn.classList.remove(
            'bg-gray-200', 'dark:bg-gray-700',
            'hover:bg-gray-300', 'dark:hover:bg-gray-600'
        );

        // Add purple active classes
        btn.classList.add(
            'bg-purple-600',
            'text-white',
            'hover:bg-purple-500'
        );

    } else {
        btn.classList.remove('active');

        // Remove purple classes
        btn.classList.remove(
            'bg-purple-600',
            'text-white',
            'hover:bg-purple-500'
        );

        // Restore gray default style
        btn.classList.add(
            'bg-gray-200', 'dark:bg-gray-700',
            'hover:bg-gray-300', 'dark:hover:bg-gray-600'
        );
    }
});

        
        displayTodos();
    }
    
    // Event listeners
    addTaskBtn.addEventListener('click', () => openTaskModal());
    closeModal.addEventListener('click', closeTaskModal);
    saveTaskBtn.addEventListener('click', saveTask);
    deleteTaskBtn.addEventListener('click', deleteTask);
    
    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            setFilter(filter);
        });
    });
    
    // Close modal when clicking outside
    taskModal.addEventListener('click', function(e) {
        if (e.target === taskModal) {
            closeTaskModal();
        }
    });
    
    // Initial display
    displayTodos();
});