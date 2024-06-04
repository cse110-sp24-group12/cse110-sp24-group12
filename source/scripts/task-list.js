class TaskListWidget extends HTMLElement {
    /**
     * A basic constructor that initializes the tasks array.
     */
    constructor() {
        super(); // necessary js call prior to self-referencing via this
        this.tasks = [];
        this.filePath = '';
    }

    /**
     * A basic init method that sets a basic innerHTML template for the custom element.
     */
    init() {
        this.innerHTML = `
            <h1 id="tasklist-title">Task List</h1>
                <div class="container">
                    
                    <div class="inputContainer">
                        <div>
                            <input type="text" id="taskInput" placeholder="Enter task...">
                        </div>
                        <div>
                            <select id="priorityInput">
                                <option value="" disabled selected hidden>Priority Level</option>
                                <option value="4">critical</option>
                                <option value="3">high</option>
                                <option value="2">medium</option>
                                <option value="1">low</option>
                            </select>
                        </div>
                        <button id="addBtn">Add Task</button>
                    </div>
                    
                    <div class="list-widget" id="taskList">
                        <!-- Tasks will be added dynamically here -->
                    </div>
                </div>`;
        this.handlePlaceholder();
    }

    /**
     * The connectedCallback method is called when the element is added to the DOM.
     * This method fetches the JSON/localStorage data and renders the tasks.
     */
    async connectedCallback() {
        // currently read if by it but could it change it to read by type?
        const dataFile = this.getAttribute('data-file');
        if (dataFile) {
            try {
                const tasks = await window.api.readFile(dataFile);
                this.filePath = dataFile;
                this.tasks = JSON.parse(tasks);
                console.log(this.tasks);
                console.log('Finish reading tasks');
                this.renderTasks();
            } catch (error) {
                console.log(entryId);
                console.log(this.tasks);
                console.error('Error fetching tasks:', error);
            }
        } else {
            console.error('No data-file provided.');
        }
    }

    /**
     * A basic method that adds a task to the task list.
     * @param {*} task - the task that is being added to the list
     * @param {*} container - container that holds the taks items
     * @param {*} id - the id of the task(using like the index)
     */
    addTask(task, container, id) {
        // create the container to store the whole stuff
        const taskContainer = document.createElement('div');
        taskContainer.classList.add('task-item');
        taskContainer.style.marginBottom = '10px';

        // Here is the checkbox part
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.is_done || false;
        checkbox.id = `task${id}`;
        checkbox.addEventListener('change', async () => {
            this.tasks[id].is_done = checkbox.checked;
            await this.updateTasks();
        });

        // Here is the label part(task tittle)
        const titleText = document.createElement('label');
        titleText.innerHTML = task.title;
        titleText.setAttribute('for', `task${id}`);
        titleText.style.marginLeft = '10px';

        // Here is the priority part
        const priority = document.createElement('img');
        // priority.innerHTML = ` : ${task.priority}`;
        // console.log(task.priority)
        priority.style.marginRight = '10px';
        switch (parseInt(task.priority, 10)) {
        case 4:
            priority.src = './images/priorityLevel4.png';
            priority.alt = 'Critical';
            break;
        case 3:
            priority.src = './images/priorityLevel3.png';
            priority.alt = 'High';
            break;
        case 2:
            priority.src = './images/priorityLevel2.png';
            priority.alt = 'Medium';
            break;
        case 1:
            priority.src = './images/priorityLevel1.png';
            priority.alt = 'Low';
            break;
        default:
            console.log('Image error', task.priority, typeof(task.priority));
        }

        // Here is the edit button pack
        const editBtn = document.createElement('button');
        editBtn.innerHTML = 'Edit';
        editBtn.classList.add('edit-button');
        editBtn.addEventListener('click', () => {
            this.editForm(task, taskContainer, id);
        });

        // Here is the delete button part
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = 'X';
        deleteBtn.classList.add('delete-button');
        deleteBtn.addEventListener('click', async () => {
            taskContainer.remove();
            this.tasks.splice(id, 1);
            await this.updateTasks();
        });

        // Add the whole stuff to  the container
        taskContainer.appendChild(checkbox);
        taskContainer.appendChild(titleText);
        taskContainer.appendChild(priority);
        taskContainer.appendChild(editBtn);
        taskContainer.appendChild(deleteBtn);

        // add a task list container to the whole container
        container.appendChild(taskContainer);
    }

    /**
     * Handle the placeholder for priority level
     */
    handlePlaceholder() {
        const priorityInput = document.getElementById('priorityInput');

        priorityInput.addEventListener('change', function () {
            if (this.value === '') {
                this.style.color = '#888'; // Placeholder color
            } else {
                this.style.color = '#000'; // Selected option color
            }
        });

        // Initial check to set the correct color
        if (priorityInput.value === '') {
            priorityInput.style.color = '#888'; // Placeholder color
        } else {
            priorityInput.style.color = '#000'; // Selected option color
        }
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

        saveBtn.addEventListener('click', async () => {
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
    async updateTask(id, newTaskText, newPriority) {
        this.tasks[id].title = newTaskText;
        this.tasks[id].priority = newPriority;
        this.renderTasks();
        await this.updateTasks();
    }

    /**
    * Updates the tasks to the json file(using the method from the preload.js and main.js)
    */
    async updateTasks() {
        console.log('Update json file Now');
        await window.api.writeJsonFile({ filePath: this.filePath, data: this.tasks });
        console.log(this.tasks);
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
            priority: parseInt(taskPriority, 10),
        };

        this.tasks.push(task);
        this.renderTasks();
        this.updateTasks();
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
                priorityInput.value = '';
                priorityInput.style.color = '#888';
            } else {
                alert('Please enter a task.');
            }
        });

        this.appendChild(tasklistContainer);

        this.handlePlaceholder();
    }
}

/**
 * define custom element with the above class
 */
customElements.define('task-list-widget', TaskListWidget);
