<?php
// Ensure this is the absolute first line of the file.
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$host = 'localhost';
$db = 'users'; // Your database name
$user = 'root';
$pass = '';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    echo json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

$username = strtolower(trim($_GET['username'] ?? ''));

if (!$username) {
    echo json_encode(['error' => 'Username is required']);
    exit;
}

// Selects all required columns from the 'reports' table.
// Match username case-insensitively and ignore stray spaces in DB values
$sql = "SELECT id, title, description,
               DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%s') AS created_at
        FROM reports
        WHERE LOWER(TRIM(username)) = ?
        ORDER BY created_at DESC, id DESC";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(['error' => 'SQL prepare failed: ' . $conn->error]);
    exit;
}

$stmt->bind_param("s", $username);
if (!$stmt->execute()) {
    echo json_encode(['error' => 'SQL execute failed: ' . $stmt->error]);
    exit;
}

$result = $stmt->get_result();

$reports = [];
if ($result instanceof mysqli_result) {
    while ($row = $result->fetch_assoc()) {
        $reports[] = $row;
    }
} else {
    // Fallback if mysqlnd is not available (get_result returns null/false)
    $stmt->store_result();
    $stmt->bind_result($id, $title, $description, $createdAt);
    while ($stmt->fetch()) {
        $reports[] = [
            'id' => $id,
            'title' => $title,
            'description' => $description,
            'created_at' => $createdAt,
        ];
    }
}

echo json_encode(['reports' => $reports]);

$stmt->close();
$conn->close();

// DO NOT put the closing tag ?>