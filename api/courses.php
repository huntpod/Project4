<?php
require 'db.php';
global $conn;

$tablename = "courseassociations";
$input = json_decode(file_get_contents('php://input'), true);

switch ($request_method) {
    case 'GET':
        handleGet();
        break;
    case 'POST':
        handlePost($input);
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
        $stmt = $conn->prepare("SELECT * FROM $tablename WHERE course_id = ?");
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
    $stmt = $conn->prepare("INSERT INTO $tablename (course_name, professor_id, course_code) VALUES (?, ?, ?)");
    $stmt->bind_param("sis", $data['course_name'], $data['professor_id'], $data['course_code']);
    $stmt->execute();
    echo json_encode(["message" => "Course created", "id" => $conn->insert_id]);
}

function handlePut($data) {
    global $conn, $tablename;
    $stmt = $conn->prepare("UPDATE $tablename SET course_name = ?, professor_id = ?, course_code = ? WHERE course_id = ?");
    $stmt->bind_param("sisi", $data['course_name'], $data['professor_id'], $data['course_code'], $data['course_id']);
    $stmt->execute();
    echo json_encode(["message" => "Course updated"]);
}

function handleDelete($data) {
    global $conn, $tablename;
    $stmt = $conn->prepare("DELETE FROM $tablename WHERE course_id = ?");
    $stmt->bind_param("i", $_GET['id']);
    $stmt->execute();
    echo json_encode(["message" => "Course deleted"]);
}
?>