class TodoApp {
    constructor() {
        this.todo = [];
        this.deleteMode = false;
        this.initializeElements();
        this.attachEventListeners();
        this.updateStats();
        this.logToConsole('Welcome to To-Do Apps!', 'success');
        this.logToConsole('Click any button above to get started.', 'info');
    }

    initializeElements() {
        this.listBtn = document.getElementById('listBtn');
        this.addBtn = document.getElementById('addBtn');
        this.deleteBtn = document.getElementById('deleteBtn');
        this.quitBtn = document.getElementById('quitBtn');

        this.addTaskSection = document.getElementById('addTaskSection');
        this.deleteSection = document.getElementById('deleteSection');

        this.taskInput = document.getElementById('taskInput');
        this.deleteIndex = document.getElementById('deleteIndex');
        this.submitTaskBtn = document.getElementById('submitTaskBtn');
        this.submitDeleteBtn = document.getElementById('submitDeleteBtn');

        this.todosList = document.getElementById('todosList');
        this.emptyState = document.getElementById('emptyState');
        this.consoleOutput = document.getElementById('consoleOutput');
        this.clearConsole = document.getElementById('clearConsole');

        this.totalTasks = document.getElementById('totalTasks');
        this.completedTasks = document.getElementById('completedTasks');
        this.pendingTasks = document.getElementById('pendingTasks');
    }

    attachEventListeners() {
        this.listBtn.addEventListener('click', () => this.handleListCommand());
        this.addBtn.addEventListener('click', () => this.handleAddCommand());
        this.deleteBtn.addEventListener('click', () => this.handleDeleteCommand());
        this.quitBtn.addEventListener('click', () => this.handleQuitCommand());

        this.submitTaskBtn.addEventListener('click', () => this.submitTask());
        this.submitDeleteBtn.addEventListener('click', () => this.submitDelete());

        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.submitTask();
        });

        this.deleteIndex.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.submitDelete();
        });

        this.clearConsole.addEventListener('click', () => this.clearConsoleOutput());
    }

    handleListCommand() {
        this.hideAllSections();
        this.logToConsole('-----------------', 'info');
        
        if (this.todo.length === 0) {
            this.logToConsole('No tasks found!', 'error');
        } else {
            for (let i = 0; i < this.todo.length; i++) {
                let status = this.todo[i].done ? "[✔]" : "[ ]";
                this.logToConsole(`${i}: ${status} ${this.todo[i].text}`, 'success');
            }
        }
        
        this.logToConsole('-----------------', 'info');
        this.updateTasksDisplay();
    }

    handleAddCommand() {
        this.hideAllSections();
        this.addTaskSection.classList.remove('hidden');
        this.taskInput.focus();
        this.logToConsole('Add mode activated. Enter your task below.', 'info');
    }

    handleDeleteCommand() {
        this.hideAllSections();
        
        if (this.todo.length === 0) {
            this.logToConsole('No tasks to delete!', 'error');
            return;
        }

        this.deleteSection.classList.remove('hidden');
        this.deleteIndex.focus();
        this.deleteIndex.max = this.todo.length - 1;
        this.logToConsole('Delete mode activated. Enter task index to delete.', 'info');
        this.logToConsole(`Available indices: 0 to ${this.todo.length - 1}`, 'info');
    }

    handleQuitCommand() {
        this.hideAllSections();
        this.logToConsole('Closing app...', 'error');
        
        document.body.style.transition = 'all 1s ease-out';
        document.body.style.opacity = '0.3';
        document.body.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            if (confirm('Are you sure you want to quit the app?')) {
                this.logToConsole('App closed successfully!', 'success');
                setTimeout(() => {
                    window.close();
                }, 1000);
            } else {
                document.body.style.opacity = '1';
                document.body.style.transform = 'scale(1)';
                this.logToConsole('Welcome back!', 'success');
            }
        }, 500);
    }

    submitTask() {
        const taskText = this.taskInput.value.trim();
        
        if (taskText === '') {
            this.logToConsole('Please enter a task!', 'error');
            return;
        }

        this.todo.push({ text: taskText, done: false }); // 
        this.logToConsole('Task added successfully!', 'success');
        this.logToConsole(`Added: "${taskText}"`, 'info');
        
        this.taskInput.value = '';
        this.updateStats();
        this.updateTasksDisplay();
        
        this.submitTaskBtn.style.transform = 'scale(1.2)';
        setTimeout(() => {
            this.submitTaskBtn.style.transform = 'scale(1)';
        }, 200);
    }

    submitDelete() {
        const index = parseInt(this.deleteIndex.value);
        
        if (isNaN(index) || index < 0 || index >= this.todo.length) {
            this.logToConsole('Invalid task index!', 'error');
            this.logToConsole(`Please enter a number between 0 and ${this.todo.length - 1}`, 'error');
            return;
        }

        const deletedTask = this.todo[index].text;
        this.todo.splice(index, 1);
        this.logToConsole('Task deleted successfully!', 'success');
        this.logToConsole(`Deleted: "${deletedTask}"`, 'info');
        
        this.deleteIndex.value = '';
        this.updateStats();
        this.updateTasksDisplay();
        
        if (this.todo.length === 0) {
            this.hideAllSections();
            this.logToConsole('No more tasks to delete.', 'info');
        } else {
            this.deleteIndex.max = this.todo.length - 1;
            this.logToConsole(`Available indices: 0 to ${this.todo.length - 1}`, 'info');
        }
    }

    updateTasksDisplay() {
        this.todosList.innerHTML = '';
        
        if (this.todo.length === 0) {
            this.emptyState.style.display = 'block';
            return;
        }
        
        this.emptyState.style.display = 'none';
        
        this.todo.forEach((task, index) => {
            const todoItem = document.createElement('div');
            todoItem.className = 'todo-item';
            todoItem.style.animationDelay = `${index * 0.1}s`;
            
            todoItem.innerHTML = `
                <div class="todo-content ${task.done ? 'done-task' : ''}">
                    <div class="todo-index">${index}</div>
                    <div class="todo-text">${this.escapeHtml(task.text)}</div>
                </div>
                <div class="todo-actions">
                    <button class="done-todo-btn" onclick="todoApp.toggleDone(${index})">
                        <i class="fas fa-check"></i>
                        Done
                    </button>
                    <button class="delete-todo-btn" onclick="todoApp.deleteTaskByIndex(${index})">
                        <i class="fas fa-trash"></i>
                        Delete
                    </button>
                </div>
            `;
            
            this.todosList.appendChild(todoItem);
        });
    }


    toggleDone(index) {
        if (index >= 0 && index < this.todo.length) {
            this.todo[index].done = !this.todo[index].done;
            this.logToConsole(`Task ${index} marked as ${this.todo[index].done ? 'done' : 'pending'}`, 'info');
            this.updateStats();
            this.updateTasksDisplay();
        }
    }

    deleteTaskByIndex(index) {
        if (index >= 0 && index < this.todo.length) {
            const deletedTask = this.todo[index].text;
            this.todo.splice(index, 1);
            this.logToConsole(`Task deleted: "${deletedTask}"`, 'success');
            this.updateStats();
            this.updateTasksDisplay();
        }
    }

    updateStats() {
        const total = this.todo.length;
        const completed = this.todo.filter(t => t.done).length;
        const pending = total - completed;

        this.totalTasks.textContent = total;
        this.completedTasks.textContent = completed;
        this.pendingTasks.textContent = pending;
    }

    hideAllSections() {
        this.addTaskSection.classList.add('hidden');
        this.deleteSection.classList.add('hidden');
    }

    logToConsole(message, type = 'info') {
        const consoleLine = document.createElement('div');
        consoleLine.className = `console-line ${type}`;
        consoleLine.textContent = `> ${message}`;
        
        this.consoleOutput.appendChild(consoleLine);
        this.consoleOutput.scrollTop = this.consoleOutput.scrollHeight;
        
        consoleLine.style.opacity = '0';
        consoleLine.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            consoleLine.style.transition = 'all 0.3s ease';
            consoleLine.style.opacity = '1';
            consoleLine.style.transform = 'translateX(0)';
        }, 50);
    }

    clearConsoleOutput() {
        this.consoleOutput.innerHTML = '';
        this.logToConsole('Console cleared.', 'info');
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.todoApp = new TodoApp();
});

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'l':
                    e.preventDefault();
                    todoApp.handleListCommand();
                    break;
                case 'n':
                    e.preventDefault();
                    todoApp.handleAddCommand();
                    break;
                case 'd':
                    e.preventDefault();
                    todoApp.handleDeleteCommand();
                    break;
                case 'q':
                    e.preventDefault();
                    todoApp.handleQuitCommand();
                    break;
            }
        }
    });

    function createParticle(x, y) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '6px';
        particle.style.height = '6px';
        particle.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        particle.style.transition = 'all 1s ease-out';
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.style.transform = `translate(${(Math.random() - 0.5) * 200}px, ${Math.random() * -200}px) scale(0)`;
            particle.style.opacity = '0';
        }, 50);
        
        setTimeout(() => {
            document.body.removeChild(particle);
        }, 1000);
    }

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('action-btn') || 
            e.target.classList.contains('submit-btn') || 
            e.target.classList.contains('delete-todo-btn') || 
            e.target.classList.contains('done-todo-btn')) {
            
            for (let i = 0; i < 6; i++) {
                setTimeout(() => {
                    createParticle(e.clientX, e.clientY);
                }, i * 50);
            }
        }
    });

    setTimeout(() => {
        todoApp.logToConsole('💡 Tip: Use Ctrl+L (List), Ctrl+N (New), Ctrl+D (Delete), Ctrl+Q (Quit)', 'info');
    }, 2000);
});
