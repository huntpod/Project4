<?php
require 'db.php';
global $conn;

$tablename = "reviews";
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
        $stmt = $conn->prepare("SELECT * FROM $tablename WHERE review_id = ?");
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
    $stmt = $conn->prepare("INSERT INTO $tablename (course_id, review_text, flagged, ratings) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("isii", $data['course_id'], $data['review_text'], $data['flagged'], $data['ratings']);
    $stmt->execute();
    echo json_encode(["message" => "Review created", "id" => $conn->insert_id]);
}

function handlePut($data) {
    global $conn, $tablename;
    $stmt = $conn->prepare("UPDATE $tablename SET course_id = ?, review_text = ?, flagged = ?, ratings = ? WHERE review_id = ?");
    $stmt->bind_param("isiii", $data['course_id'], $data['review_text'], $data['flagged'], $data['ratings'], $data['review_id']);
    $stmt->execute();
    echo json_encode(["message" => "Review updated"]);
}

function handleDelete($data) {
    global $conn, $tablename;
    $stmt = $conn->prepare("DELETE FROM $tablename WHERE review_id = ?");
    $stmt->bind_param("i", $_GET['id']);
    $stmt->execute();
    echo json_encode(["message" => "Review deleted"]);
}
?>