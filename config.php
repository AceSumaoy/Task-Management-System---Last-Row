<?php
// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$database = "todo_list";

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Handle add task
if ($_POST['action'] == 'addTask') {
    $title = $_POST['title'];
    $description = $_POST['description'];
    $date = $_POST['date'];

    $sql = "INSERT INTO tasks (title, description, date) VALUES ('$title', '$description', '$date')";
    $conn->query($sql);

    // Get the inserted task ID
    $taskId = $conn->insert_id;

    $response = array('taskId' => $taskId);
    echo json_encode($response);
}

// Handle delete task
if ($_POST['action'] == 'deleteTask') {
    $taskId = $_POST['taskId'];

    $sql = "DELETE FROM tasks WHERE id = $taskId";
    $conn->query($sql);
}

// Handle get tasks
if ($_POST['action'] == 'getTasks') {
    $tasks = array();

    $result = $conn->query("SELECT * FROM tasks");
    while ($row = $result->fetch_assoc()) {
        $tasks[] = $row;
    }

    echo json_encode($tasks);
}

$conn->close();
?>