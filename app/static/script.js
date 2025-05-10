
// Task type definitions
const TaskStatus = {
  PENDING: 'pending',
  COMPLETED: 'completed'
};

// DOM Elements
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');
const filterButtons = document.querySelectorAll('.filter-btn');
const taskList = document.getElementById('task-list');
const taskForm = document.getElementById('task-form');
const taskTemplate = document.getElementById('task-item-template');

// State
let tasks = [];
let currentFilter = 'all';

// Load tasks from localStorage
function loadTasks() {
  const savedTasks = localStorage.getItem('tasks');
  if (savedTasks) {
    try {
      tasks = JSON.parse(savedTasks).map(task => ({
        ...task,
        createdAt: new Date(task.createdAt)
      }));
      renderTasks();
    } catch (error) {
      console.error('Failed to parse tasks from localStorage:', error);
      tasks = [];
    }
  }
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Add a new task
function addTask(title, description, label) {
  const newTask = {
    id: Date.now().toString(),
    title,
    description,
    status: TaskStatus.PENDING,
    label,
    createdAt: new Date()
  };
  
  tasks.push(newTask);
  saveTasks();
  renderTasks();
}

// Delete a task
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

// Toggle task status
function toggleTaskStatus(id) {
  tasks = tasks.map(task => {
    if (task.id === id) {
      return {
        ...task,
        status: task.status === TaskStatus.PENDING ? TaskStatus.COMPLETED : TaskStatus.PENDING
      };
    }
    return task;
  });
  saveTasks();
  renderTasks();
}

// Filter tasks
function filterTasks(filter) {
  currentFilter = filter;
  renderTasks();
}

// Render tasks based on the current filter
function renderTasks() {
  taskList.innerHTML = '';
  
  const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'all') return true;
    return task.status === currentFilter;
  });
  
  if (filteredTasks.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.textContent = 'No tasks found.';
    taskList.appendChild(emptyState);
    return;
  }
  
  filteredTasks.forEach(task => {
    const taskElement = createTaskElement(task);
    taskList.appendChild(taskElement);
  });
}

// Create a task element from template
function createTaskElement(task) {
  const taskElement = document.importNode(taskTemplate.content, true).querySelector('.task-item');
  
  if (task.status === TaskStatus.COMPLETED) {
    taskElement.classList.add('completed');
  }
  
  // Set task content
  const checkbox = taskElement.querySelector('.task-checkbox');
  checkbox.checked = task.status === TaskStatus.COMPLETED;
  checkbox.addEventListener('change', () => toggleTaskStatus(task.id));
  
  taskElement.querySelector('.task-title').textContent = task.title;
  
  const descElement = taskElement.querySelector('.task-desc');
  if (task.description) {
    descElement.textContent = task.description;
  } else {
    descElement.style.display = 'none';
  }
  
  const labelElement = taskElement.querySelector('.task-label');
  labelElement.textContent = task.label.charAt(0).toUpperCase() + task.label.slice(1);
  labelElement.classList.add(task.label);
  
  taskElement.querySelector('.task-date').textContent = formatDate(task.createdAt);
  
  // Set delete button action
  taskElement.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id));
  
  return taskElement;
}

// Format date to a readable string
function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

// Initialize tabs
function initTabs() {
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tab = button.dataset.tab;
      
      // Update active button
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Show selected tab content
      tabContents.forEach(content => content.classList.remove('active'));
      document.getElementById(`${tab}-tab`).classList.add('active');
    });
  });
}

// Initialize filter buttons
function initFilters() {
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      
      // Update active filter
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      filterTasks(filter);
    });
  });
}

// Handle form submission
function initForm() {
  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const label = document.getElementById('task-label').value;
    
    if (!title.trim()) return;
    
    addTask(title.trim(), description.trim(), label);
    
    // Reset form
    taskForm.reset();
    
    // Switch to tasks tab
    tabButtons[0].click();
    
    // Show a confirmation
    alert('Task added successfully!');
  });
}

// Initialize the application
function init() {
  loadTasks();
  initTabs();
  initFilters();
  initForm();
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', init);
