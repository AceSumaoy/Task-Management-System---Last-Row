function TodoListApp() {
    // Initialize properties
    this.titleInput = document.getElementById("title");
    this.descriptionInput = document.getElementById("description");
    this.dateInput = document.getElementById("date");
    this.addItemBtn = document.getElementById("addItemBtn");
    this.todoList = document.getElementById("todoList"); // Updated to get the container div
    this.confirmationModal = document.getElementById("confirmationModal");
    this.confirmationText = document.getElementById("confirmationText");
    this.confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
    this.cancelDeleteBtn = document.getElementById("cancelDeleteBtn");

    // Bind event listeners
    this.addItemBtn.onclick = this.addItem.bind(this);
    this.confirmDeleteBtn.onclick = this.confirmDelete.bind(this);
    this.cancelDeleteBtn.onclick = this.cancelDelete.bind(this);

    // Initialize the application
    this.init();
}

TodoListApp.prototype.addItem = function () {
    // Get the values from the input fields
    const title = this.titleInput.value;
    const description = this.descriptionInput.value;
    const date = this.dateInput.value;

    // Check if the form is in edit mode
    const editNote = this.todoList.querySelector(".edit-mode");

    if (editNote) {
        // Update the existing note in edit mode
        const taskId = editNote.querySelector(".note-id").textContent;

        // Update the task on the server
        fetch('api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=updateTask&taskId=${taskId}&title=${title}&description=${description}&date=${date}`,
        })
            .then(response => response.json())
            .then(data => {
                // Handle the response if needed
                console.log(data);
            });

        // Update the note in the UI
        editNote.querySelector(".note-title").textContent = title;
        editNote.querySelector(".note-description").textContent = description;
        editNote.querySelector(".note-date").textContent = date;

        // Clear the edit mode indicator
        editNote.classList.remove("edit-mode");
    } else {
        // Add the new task on the server
        fetch('api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=addTask&title=${title}&description=${description}&date=${date}`,
        })
            .then(response => response.json())
            .then(data => {
                // Handle the response if needed
                console.log(data);

                // Create a new note
                const note = document.createElement('div');
                note.classList.add('note');

                note.innerHTML = `<div class="note-header">
                                    <span class="note-id">${data.taskId}</span>
                                    <span class="note-title">${title}</span>
                                  </div>
                                  <div class="note-description">${description}</div>
                                  <div class="note-date">${date}</div>
                                  <div class="note-actions">
                                    <button onclick="app.editTask(this)">Edit</button>
                                    <button onclick="app.confirmDeleteModal(this)">Delete</button>
                                  </div>`;

                // Add the note to the container
                this.todoList.appendChild(note);
            })
            .catch(error => {
                console.error('Error adding task:', error);
            });
    }

    // Clear the input fields
    this.titleInput.value = "";
    this.descriptionInput.value = "";
    this.dateInput.value = "";

    // Reset the button text to "Add Item"
    this.addItemBtn.textContent = "Add Item";
};

TodoListApp.prototype.editTask = function (editButton) {
    // Retrieve the task details from the note
    const editNote = editButton.closest('.note');
    const taskId = editNote.querySelector('.note-id').textContent;
    const title = editNote.querySelector('.note-title').textContent;
    const description = editNote.querySelector('.note-description').textContent;
    const date = editNote.querySelector('.note-date').textContent;

    // Populate the form with task details for editing
    this.titleInput.value = title;
    this.descriptionInput.value = description;
    this.dateInput.value = date;

    // Change the button text to "Update" for editing mode
    this.addItemBtn.textContent = 'Update';

    // Add a data-id attribute to the button to store the task ID
    this.addItemBtn.setAttribute('data-id', taskId);

    // Mark the note as edit mode
    editNote.classList.add('edit-mode');
    
};

TodoListApp.prototype.confirmDeleteModal = function (deleteButton) {
    // Display a confirmation message in the modal
    const deleteNote = deleteButton.closest('.note');
    
    if (deleteNote) {
        const taskId = deleteNote.querySelector('.note-id').textContent;
        this.confirmationText.textContent = `Are you sure you want to delete task ${taskId}?`;

        // Show the modal
        this.confirmationModal.style.display = 'block';

        // Store the note to be deleted in a property for later use
        this.noteToDelete = deleteNote; // Ensure that this assignment is correct

        // Clear the noteToDelete property when the modal is closed
        const closeModal = () => {
            this.noteToDelete = null;
            this.confirmationModal.style.display = 'none';
        };

        // Attach event listeners to the modal buttons
        this.confirmDeleteBtn.addEventListener('click', this.confirmDelete.bind(this));
        this.cancelDeleteBtn.addEventListener('click', closeModal);
    }
};

TodoListApp.prototype.confirmDelete = function () {
    // Close the modal
    this.confirmationModal.style.display = 'none';

    // Check if this.noteToDelete is defined
    if (this.noteToDelete && this.noteToDelete.querySelector) {
        // Retrieve the task details from the note
        const taskId = this.noteToDelete.querySelector('.note-id').textContent;

        // Remove the note from the UI
        this.noteToDelete.remove();

        // Send a request to the server to delete the task
        fetch('api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=deleteTask&taskId=${taskId}`,
        })
        .catch(error => {
            console.error('Error deleting task:', error);
        });
    } else {
        console.error('Error: Unable to delete task. Note to delete is not properly set.');
    }
};


TodoListApp.prototype.cancelDelete = function () {
    // Close the modal
    this.confirmationModal.style.display = 'none';
};

// Instantiate the TodoListApp
const app = new TodoListApp();

//----------------------------------------------------------------DELETE SAMANTE

TodoListApp.prototype.init = function () {
    // Fetch existing tasks from the server
    fetch('api.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'action=getTasks',
    })
        .then(response => response.json())
        .then(data => {
            // Handle the response if needed
            console.log(data);
            // Display existing tasks
            this.displayTasks(data);
        })
        .catch(error => {
            console.error('Error fetching tasks:', error);
        });
};

TodoListApp.prototype.displayTasks = function (tasks) {
    const todoList = document.getElementById("todoList");

    // Clear existing notes in the container
    todoList.innerHTML = '';

    // Iterate over tasks and add each one to the container
    tasks.forEach(task => {
        const note = document.createElement('div');
        note.classList.add('note');

      note.innerHTML = `<div class="note-header">
                    <span class="note-id">${task.id}</span>
                    <span class="note-title">${task.title}</span>
                  </div>
                  <div class="note-description">${task.description}</div>
                  <div class="note-date">${new Date(task.date).toLocaleDateString()}</div>
                  <div class="note-actions">
                    <button class="edit-btn" onclick="app.editTask(this)">Edit</button>
                    <button class="delete-btn" onclick="app.confirmDeleteModal(this)">Delete</button>
                  </div>`;


        // Add the note to the container
        todoList.appendChild(note);
    });
};