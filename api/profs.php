<?php
require 'db.php';
global $conn;

$tablename = "professorcredentials";
$input = json_decode(file_get_contents('php://input'), true);
$request_method = $_SERVER['REQUEST_METHOD']; // Ensure to capture the request method

switch ($request_method) {
    case 'GET':
        handleGet();
        break;
    case 'POST':
        if (isset($_GET['resource']) && $_GET['resource'] === 'professorLogin') {
            handleProfessorLogin($input);
        } else {
            handlePost($input);
        }
        break;
    case 'PUT':
        handlePut($input);
        break;
    case 'DELETE':
        handleDelete($input);
        break;
    default:
        echo json_encode(["message" => "Method not supported"]);
        http_response_code(405); // Method Not Allowed
        break;
}

function handleGet() {
    global $conn, $tablename;
    if (isset($_GET['id'])) {
        $stmt = $conn->prepare("SELECT * FROM $tablename WHERE professor_id = ?");
        $stmt->bind_param("i", $_GET['id']);
        $stmt->execute();
        $result = $stmt->get_result();
        echo json_encode($result->fetch_assoc());
    } else {
        $result = $conn->query("SELECT * FROM $tablename");
        echo json_encode($result->fetch_all(MYSQLI_ASSOC));
    }
}

function handlePost($data) {
    global $conn, $tablename;
    $hashedPassword = hash('sha256', $data['password']); // Hash the password with SHA-256
    $stmt = $conn->prepare("INSERT INTO $tablename (name, email, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $data['name'], $data['email'], $hashedPassword);
    $stmt->execute();
    echo json_encode(["message" => "Professor created", "id" => $conn->insert_id]);
}

function handlePut($data) {
    global $conn, $tablename;
    $hashedPassword = hash('sha256', $data['password']); // Hash the password with SHA-256
    $stmt = $conn->prepare("UPDATE $tablename SET name = ?, email = ?, password = ? WHERE professor_id = ?");
    $stmt->bind_param("sssi", $data['name'], $data['email'], $hashedPassword, $data['professor_id']);
    $stmt->execute();
    echo json_encode(["message" => "Professor updated"]);
}

function handleDelete($data) {
    global $conn, $tablename;
    $stmt = $conn->prepare("DELETE FROM $tablename WHERE professor_id = ?");
    $stmt->bind_param("i", $_GET['id']);
    $stmt->execute();
    echo json_encode(["message" => "Professor deleted"]);
}

function handleProfessorLogin($data) {
    global $conn, $tablename;
    $hashedPassword = hash('sha256', $data['password']);
    $stmt = $conn->prepare("SELECT professor_id FROM $tablename WHERE email = ? AND password = ?");
    $stmt->bind_param("ss", $data['email'], $hashedPassword);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        $professor = $result->fetch_assoc();
        echo json_encode(["message" => "Login successful", "success" => true, "userId" => $professor['professor_id']]);
    } else {
        echo json_encode(["message" => "Invalid email or password", "success" => false]);
    }
}
?>