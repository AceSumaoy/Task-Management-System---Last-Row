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