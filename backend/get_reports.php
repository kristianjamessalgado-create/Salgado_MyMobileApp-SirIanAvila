<?php
// Ensure this is the absolute first line of the file.
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Helpful during debugging; safe to leave enabled on dev
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$host = 'localhost';
$db = 'users'; // Your database name
$user = 'root';
$pass = '';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    echo json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

$username = trim($_GET['username'] ?? '');

if ($username === '') {
    echo json_encode(['error' => 'Username is required']);
    exit;
}

// Case-insensitive match on username and newest-first ordering
$sql = "SELECT id, title, description,
               DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%s') AS created_at
        FROM reports
        WHERE LOWER(username) = LOWER(?)
        ORDER BY created_at DESC, id DESC";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(['error' => 'SQL prepare failed: ' . $conn->error]);
    exit;
}

$stmt->bind_param('s', $username);
$stmt->execute();
$result = $stmt->get_result();

$reports = [];
while ($row = $result->fetch_assoc()) {
    $reports[] = $row;
}

echo json_encode(['reports' => $reports]);

// DO NOT put the closing tag ?>