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