<?php
require 'db.php';

$tablename = "admincredentials";
$input = json_decode(file_get_contents('php://input'), true);
$request_method = $_SERVER['REQUEST_METHOD']; 

switch ($request_method) {
    case 'GET':
        handleGet();
        break;
    case 'POST':
        if (isset($_GET['resource']) && $_GET['resource'] === 'adminLogin') {
            handleAdminLogin($input);
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
        $stmt = $conn->prepare("SELECT * FROM $tablename WHERE admin_id = ?");
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
    $hashedPassword = hash('sha256', $data['password']);
    $stmt = $conn->prepare("INSERT INTO $tablename (username, password) VALUES (?, ?)");
    $stmt->bind_param("ss", $data['username'], $hashedPassword);
    $stmt->execute();
    echo json_encode(["message" => "Admin created", "id" => $conn->insert_id]);
}

function handleAdminLogin($data) {
    global $conn, $tablename;
    $hashedPassword = hash('sha256', $data['password']);
    $stmt = $conn->prepare("SELECT * FROM $tablename WHERE username = ? AND password = ?");
    $stmt->bind_param("ss", $data['username'], $hashedPassword);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        echo json_encode(["message" => "Login successful", "success" => true]);
    } else {
        echo json_encode(["message" => "Invalid username or password", "success" => false]);
    }
}

function handlePut($data) {
    global $conn, $tablename;
    $hashedPassword = hash('sha256', $data['password']);
    $stmt = $conn->prepare("UPDATE $tablename SET username = ?, password = ? WHERE admin_id = ?");
    $stmt->bind_param("ssi", $data['username'], $hashedPassword, $data['admin_id']);
    $stmt->execute();
    echo json_encode(["message" => "Admin updated"]);
}

function handleDelete($data) {
    global $conn, $tablename;
    $stmt = $conn->prepare("DELETE FROM $tablename WHERE admin_id = ?");
    $stmt->bind_param("i", $_GET['id']);
    $stmt->execute();
    echo json_encode(["message" => "Admin deleted"]);
}
?>