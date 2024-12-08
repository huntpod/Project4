<?php
require 'db.php';

$resource = isset($_GET['resource']) ? $_GET['resource'] : '';

if (empty($resource)) {
    echo json_encode(["message" => "No resource specified"]);
    http_response_code(400); // Bad Request
    exit();
}

$request_method = $_SERVER['REQUEST_METHOD'];

// We should include the preflight request handling in the main router
if ($request_method === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("HTTP/1.1 204 No Content");
    exit();
}

switch ($resource) {
    case 'admins':
        include 'admins.php';
        break;
    case 'courses':
        include 'courses.php';
        break;
    case 'departments':
        include 'departments.php';
        break;
    case 'profs':
        include 'profs.php';
        break;
    case 'reviews':
        include 'reviews.php';
        break;
    default:
        echo json_encode(["message" => "Resource not found"]);
        http_response_code(404); // Not Found
        break;
}
?>