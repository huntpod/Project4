<?php
// Database connection
require_once 'db.php';

// Set headers for JSON response
header('Content-Type: application/json');

// Fetch the request method
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            // Fetch reviews
            $query = "SELECT * FROM reviews";
            $result = $conn->query($query);
            $reviews = [];

            while ($row = $result->fetch_assoc()) {
                $reviews[] = $row;
            }

            echo json_encode($reviews);
            break;

        case 'POST':
            // Handle new review creation
            $data = json_decode(file_get_contents('php://input'), true);

            if (!isset($data['professor_id'], $data['course_id'], $data['review_text'], $data['ratings'])) {
                http_response_code(400);
                echo json_encode(['message' => 'Missing required fields']);
                exit;
            }

            $professor_id = $conn->real_escape_string($data['professor_id']);
            $course_id = $conn->real_escape_string($data['course_id']);
            $review_text = $conn->real_escape_string($data['review_text']);
            $ratings = (int)$data['ratings'];

            $query = "INSERT INTO reviews (professor_id, course_id, review_text, ratings) VALUES (?, ?, ?, ?)";
            $stmt = $conn->prepare($query);
            $stmt->bind_param('iisi', $professor_id, $course_id, $review_text, $ratings);

            if ($stmt->execute()) {
                echo json_encode(['message' => 'Review created successfully']);
            } else {
                http_response_code(500);
                echo json_encode(['message' => 'Failed to create review']);
            }

            $stmt->close();
            break;

        case 'PUT':
            // Update existing review
            $data = json_decode(file_get_contents('php://input'), true);

            if (!isset($data['review_id'], $data['review_text'], $data['ratings'])) {
                http_response_code(400);
                echo json_encode(['message' => 'Missing required fields']);
                exit;
            }

            $review_id = (int)$data['review_id'];
            $review_text = $conn->real_escape_string($data['review_text']);
            $ratings = (int)$data['ratings'];

            $query = "UPDATE reviews SET review_text = ?, ratings = ? WHERE review_id = ?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param('sii', $review_text, $ratings, $review_id);

            if ($stmt->execute()) {
                echo json_encode(['message' => 'Review updated successfully']);
            } else {
                http_response_code(500);
                echo json_encode(['message' => 'Failed to update review']);
            }

            $stmt->close();
            break;

        case 'DELETE':
            // Delete a review
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(['message' => 'Missing review ID']);
                exit;
            }

            $review_id = (int)$_GET['id'];

            $query = "DELETE FROM reviews WHERE review_id = ?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param('i', $review_id);

            if ($stmt->execute()) {
                echo json_encode(['message' => 'Review deleted successfully']);
            } else {
                http_response_code(500);
                echo json_encode(['message' => 'Failed to delete review']);
            }

            $stmt->close();
            break;

        default:
            http_response_code(405);
            echo json_encode(['message' => 'Method not allowed']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Server error', 'error' => $e->getMessage()]);
}

$conn->close();
