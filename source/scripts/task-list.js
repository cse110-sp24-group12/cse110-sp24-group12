class TaskListWidget extends HTMLElement {
    /**
     * A basic constructor that initializes the tasks array.
     */
    constructor() {
        super(); // necessary js call prior to self-referencing via this
        this.tasks = [];
    }

    /**
     * A basic init method that sets a basic innerHTML template for the custom element.
     */
    init() {
        this.innerHTML = `
            <div class="container">
                <h1>Task List</h1>
                
                <div class="inputContainer">
                    <div>
                        <input type="text" id="taskInput" placeholder="Enter task...">
                    </div>
                    <div>
                        <select id="priorityInput">
                            <option value="0">Select one</option>
                            <option value="4">critical</option>
                            <option value="3">high</option>
                            <option value="2">medium</option>
                            <option value="1">low</option>
                        </select>
                    </div>
                </div>
                <button id="addBtn">Add Task</button>
                
                <div class="list-widget" id="taskList">
                    <!-- Tasks will be added dynamically here -->
                </div>
            </div>`;
    }

    /**
     * The connectedCallback method is called when the element is added to the DOM.
     * This method fetches the JSON/localStorage data and renders the tasks.
     */
    connectedCallback() {
        if (localStorage.getItem('tasks') !== null) {
            this.tasks = JSON.parse(localStorage.getItem('tasks'));
            this.renderTasks();
            return;
        }

        const src = this.getAttribute('src');
        if (src) {
            fetch(src)
                .then((response) => response.json())
                .then((data) => {
                    this.tasks = data;
                    this.renderTasks();
                })
                .catch((error) => {
                    console.error('Error fetching JSON:', error);
                });
        } else {
            console.error('No src attribute provided.');
        }
    }

    /**
     * A basic method that adds a task to the task list.
     * @param {*} task - the task that is being added to the list
     * @param {*} container - container that holds the taks items
     * @param {*} id - the id of the task
     */
    addTask(task, container, id) {
        const taskContainer = document.createElement('div');
        taskContainer.classList.add('task-item');
        taskContainer.style.marginBottom = '10px';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.is_done || false;
        checkbox.id = `task${id}`;
        checkbox.addEventListener('change', () => {
            this.tasks[id].is_done = checkbox.checked;
            this.updateLocalStorage();
        });

        const titleText = document.createElement('label');
        titleText.innerHTML = task.title;
        titleText.setAttribute('for', `task${id}`);
        titleText.style.marginLeft = '10px';

        const priority = document.createElement('h4');
        priority.innerHTML = `Priority level: ${task.priority}`;
        console.log(task.priority);

        const editBtn = document.createElement('button');
        editBtn.innerHTML = 'Edit';
        editBtn.classList.add('edit-button');
        editBtn.addEventListener('click', () => {
            this.editForm(task, taskContainer, id);
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = 'X';
        deleteBtn.classList.add('delete-button');
        deleteBtn.addEventListener('click', () => {
            taskContainer.remove();
            this.tasks.splice(id, 1);
            this.updateLocalStorage();
        });

        taskContainer.appendChild(checkbox);
        taskContainer.appendChild(titleText);
        taskContainer.appendChild(priority);
        taskContainer.appendChild(editBtn);
        taskContainer.appendChild(deleteBtn);

        container.appendChild(taskContainer);
    }

    /**
     * Edits a pre-existing task
     * @param {*} task - the task that is going to be edited
     * @param {*} taskContainerParam - the container that holds all of the task items
     * @param {*} id - the id of the task
     */
    editForm(task, taskContainerParam, id) {
        const taskContainer = taskContainerParam;
        taskContainer.innerHTML = `
            <input type="text" id="editTaskInput" value="${task.title}">
            <select id="editPriorityInput">
                <option value="0">Select one</option>
                <option value="4">Critical</option>
                <option value="3">High</option>
                <option value="2">Medium</option>
                <option value="1">Low</option>
            </select>
            <button id="saveBtn">Save</button>
        `;
        const editTaskInput = taskContainer.querySelector('#editTaskInput');
        const editPriorityInput = taskContainer.querySelector('#editPriorityInput');
        const saveBtn = taskContainer.querySelector('#saveBtn');

        editPriorityInput.value = task.priority;

        saveBtn.addEventListener('click', () => {
            const newTaskText = editTaskInput.value.trim();
            const newPriority = editPriorityInput.value;
            if (newTaskText !== '') {
                this.updateTask(id, newTaskText, newPriority);
            } else {
                alert('Task cannot be empty.');
            }
        });
    }

    /**
     * Updates the task after being edited
     * @param {*} id - the id of the task
     * @param {*} newTaskText - the new task description that was edited in
     * @param {*} newPriority - the new priority of the task that was edited
     */
    updateTask(id, newTaskText, newPriority) {
        this.tasks[id].title = newTaskText;
        this.tasks[id].priority = newPriority;
        this.renderTasks();
        this.updateLocalStorage();
    }

    /**
     * Update the local storage with the new tasks array as needed
     * (generally after adding or removing tasks)
     */
    updateLocalStorage() {
        console.log('Update local storage');
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    /**
     * Add a task to the task list and update the local storage
     * @param {*} taskText - the description of the task that is being added
     * @param {*} taskPriority - the priority of the task that is being added
     * @param {*} isChecked - if the task is completed or not
     */
    addTaskToList(taskText, taskPriority, isChecked) {
        const task = {
            title: taskText,
            is_done: isChecked,
            priority: taskPriority,
        };

        this.tasks.push(task);
        this.renderTasks();
        this.updateLocalStorage();
    }

    /*
    Render the tasks in the task list widget (generally run after tasks added or deleted)
    */
    renderTasks() {
        this.init();
        const tasklistContainer = document.getElementById('taskList');
        this.tasks.sort((a, b) => b.priority - a.priority);

        this.tasks.forEach((task, idx) => {
            this.addTask(task, tasklistContainer, idx);
        });

        const addBtn = document.getElementById('addBtn');
        const taskInput = document.getElementById('taskInput');
        const priorityInput = document.getElementById('priorityInput');

        addBtn.addEventListener('click', () => {
            const taskText = taskInput.value.trim();
            const taskPriority = priorityInput.value;
            if (taskText !== '') {
                this.addTaskToList(taskText, taskPriority, false);
                taskInput.value = '';
            } else {
                alert('Please enter a task.');
            }
        });

        this.appendChild(tasklistContainer);
    }

    /**
     * When a task is checked, update the task status
     * in the local storage so it is not rendered improperly
     * @param {*} taskText - the task text
     */
    removeTaskFromLocalStorage(taskText) {
        const index = this.tasks.findIndex((task) => task.text === taskText);
        if (index !== -1) {
            this.tasks.splice(index, 1);
            this.updateLocalStorage();
            this.renderTasks();
        }
    }
}

/**
 * define custom element with the above class
 */
customElements.define('task-list-widget', TaskListWidget);
