<?php
// Ensure this is the absolute first line of the file.
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

// Force JSON-only error handling (avoid HTML error pages)
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('html_errors', '0');
set_error_handler(function ($severity, $message, $file, $line) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Server error',
        'message' => $message,
    ]);
    exit;
});
set_exception_handler(function ($e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Server exception',
        'message' => $e->getMessage(),
    ]);
    exit;
});

$host = 'localhost';
$db = 'reports'; // New dedicated database for reports
$user = 'root';
$pass = '';

// Throw exceptions on MySQLi errors
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

// Ensure proper charset
$conn->set_charset('utf8mb4');

$username = trim($_GET['username'] ?? '');

if ($username === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Username is required']);
    exit;
}

// Selects all required columns from the 'reports' table.
// Case-insensitive match on username and newest first
$sql = "SELECT id, title, description, DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%s') AS created_at
        FROM reports
        WHERE LOWER(username) = LOWER(?)
        ORDER BY created_at DESC";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(['error' => 'SQL prepare failed: ' . $conn->error]);
    exit;
}

$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

$reports = [];
while ($row = $result->fetch_assoc()) {
    $reports[] = $row;
}

echo json_encode(['reports' => $reports], JSON_UNESCAPED_UNICODE);

// DO NOT put the closing tag ?>