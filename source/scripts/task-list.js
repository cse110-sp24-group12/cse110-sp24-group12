class TaskListWidget extends HTMLElement {

    /*
    A basic constructor that initializes the tasks array.
    */
    constructor() {
        super(); // necessary js call prior to self-referencing via this
        this.tasks = [];
    }

    /*
    A basic init method that sets a basic innerHTML template for the custom element.
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

    /* 
    The connectedCallback method is called when the element is added to the DOM.
    This method fetches the JSON/localStorage data and renders the tasks.
    */
    connectedCallback() {
        // Check if tasks are stored in local storage, if so, load them and terminate function
        if (localStorage.getItem("tasks") !== null) {
            this.tasks = JSON.parse(localStorage.getItem("tasks"));
            this.renderTasks();
            return;
        }

        // If no tasks are stored in local storage, fetch tasks from JSON file
        const src = this.getAttribute('src');
        if (src) {
            fetch(src)
                .then(response => response.json())
                .then(data => {
                    this.tasks = data;
                    this.renderTasks();
                })
                .catch(error => {
                    console.error('Error fetching JSON:', error);
                });
        } else {
            console.error('No src attribute provided.'); // this will log an error if no src attribute is provided, JS error
        }
    }

    /*
    A basic method that adds a task to the task list.
    */
    addTask(task, container, id) {
        const task_container = document.createElement('div'); // Create <li> for each task
        task_container.classList.add("task-item");
        task_container.style.marginBottom = '10px'; // Add margin for spacing between tasks
        task_container.addEventListener('click', (event) => { // Toggle checkbox when clicking on task
            if (event.target !== checkbox && event.target !== deleteBtn && event.target !== editBtn) { // ensure not clicking on checkbox or delete button
                checkbox.click();
            }
        });
        task_container.addEventListener("dblclick", (event) => {
            if (event.target !== checkbox && event.target !== deleteBtn) {
                this.updateNote(id, task_container, task.title)
            }
        });

        // Create checkbox for task status
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.is_done || false; // Set checkbox state based on task completion status
        checkbox.id = `task${id}`;
        checkbox.addEventListener('change', () => {
            this.tasks[id].is_done = checkbox.checked;
            this.updateLocalStorage();
        })

        // Display task title
        const titleText = document.createElement('label');
        titleText.innerHTML = task.title;
        titleText.setAttribute("for", `task${id}`)
        titleText.style.marginLeft = '10px'; // Add margin for spacing between checkbox and title


        // Display priority level
        const priority = document.createElement('h4');
        priority.innerHTML = 'Priority level: ' + task.priority;
        console.log(task.priority)

        // Create edit button
        const editBtn = document.createElement('button');
        editBtn.innerHTML = 'Edit';
        editBtn.classList.add('edit-button');
        editBtn.addEventListener('click', () => {
            this.editForm(task, task_container, id);
        });        

        // Create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = 'X';
        deleteBtn.classList.add('delete-button');
        deleteBtn.addEventListener('click', () => {
            task_container.remove(); // Remove the task container from the DOM
            this.tasks.splice(id, 1); // Remove task from array
            this.updateLocalStorage(); // Update local storage
        });

        // Append checkbox, title, and due date to <li> element
        task_container.appendChild(checkbox);
        task_container.appendChild(titleText);
        task_container.appendChild(priority);
        task_container.appendChild(editBtn);
        task_container.appendChild(deleteBtn);

        container.appendChild(task_container); // Append <li> to <ul>
    }

    /**
     * Edits a pre existing task
     */
    editForm(task, taskContainer, id) {
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

    /* 
    Update the task
    */
    updateTask(id, newTaskText, newPriority) {
        this.tasks[id].title = newTaskText;
        this.tasks[id].priority = newPriority;
        this.renderTasks();
        this.updateLocalStorage();
    }

    /* 
    Update the local storage with the new tasks array as needed (generally after adding or removing tasks)
    */
    updateLocalStorage() {
        console.log("Update local storage")
        localStorage.setItem("tasks", JSON.stringify(this.tasks)); // Store tasks in local storage
    }

    /* 
    Add a task to the task list and update the local storage
    */
    addTaskToList(taskText, taskPriority, isChecked) {
        const task = {
            title: taskText,
            is_done: isChecked,
            priority: taskPriority
        }

        this.tasks.push(task);
        this.renderTasks();
        this.updateLocalStorage(); // call earlier method to update local storage
    }

    /* 
    Render the tasks in the task list widget (generally run after tasks added or deleted)
    */
    renderTasks() {
        this.init();
        const tasklist_container = document.getElementById("taskList");
        // sort the task list based on the priorty level
        this.tasks.sort((a, b) => b.priority - a.priority);

        this.tasks.forEach((task, idx) => {
            this.addTask(task, tasklist_container, idx);
        });

        const addBtn = document.getElementById('addBtn');
        const taskInput = document.getElementById('taskInput');
        const priorityInput = document.getElementById('priorityInput');

        // Get info about new task and add it to the list to be rendered
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

        this.appendChild(tasklist_container); // Append <ul> to the custom element
    }

    /*
    When a task is checked, update the task status in the local storage so it is not rendered improperly
    */
    removeTaskFromLocalStorage(taskText) {
        // Find index of the task to remove
        const index = tasks.findIndex(task => task.text === taskText);
        if (index !== -1) {
            tasks.splice(index, 1); // Remove task from array
            this.updateLocalStorage();
            this.renderTasks();
        }
    }
}

// define custom element with the above class
customElements.define('task-list-widget', TaskListWidget);