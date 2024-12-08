<?php
require 'db.php';

$tablename = "admincredentials";
$input = json_decode(file_get_contents('php://input'), true);

switch ($request_method) {
    case 'GET':
        error_log('GET request received for admins');
        handleGet();
        break;
    case 'POST':
        error_log('POST request received for admins');
        handlePost($input);
        break;
    case 'PUT':
        error_log('PUT request received for admins');
        handlePut($input);
        break;
    case 'DELETE':
        error_log('DELETE request received for admins');
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
    $stmt = $conn->prepare("INSERT INTO $tablename (username, password) VALUES (?, ?)");
    $stmt->bind_param("ss", $data['username'], $data['password']);
    $stmt->execute();
    echo json_encode(["message" => "Admin created", "id" => $conn->insert_id]);
}

function handlePut($data) {
    global $conn, $tablename;
    $stmt = $conn->prepare("UPDATE $tablename SET username = ?, password = ? WHERE admin_id = ?");
    $stmt->bind_param("ssi", $data['username'], $data['password'], $data['admin_id']);
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