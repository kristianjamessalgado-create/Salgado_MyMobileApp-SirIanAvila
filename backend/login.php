<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$mysqli = new mysqli("localhost", "root", "", "users");

if ($mysqli->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => "DB connection failed: " . $mysqli->connect_error]);
    exit;
}

$username = $_POST['username'] ?? null;
$password = $_POST['password'] ?? null;

if (!$username || !$password) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing username or password']);
    exit;
}

$username = $mysqli->real_escape_string($username);

$sql = "SELECT * FROM users WHERE username = '$username'";
$result = $mysqli->query($sql);

if ($result && $result->num_rows > 0) {
    $row = $result->fetch_assoc();

    // Compare password directly without hashing
    if ($row['password_hash'] === $password) {
        // Block login if not approved
        if ($row['status'] !== 'approved') {
            http_response_code(403);
            echo json_encode(['error' => 'Your account is still pending approval.', 'status' => $row['status']]);
            exit;
        }

        echo json_encode([
            'message' => 'Login successful!',
            'username' => $row['username'],
            'role' => $row['role'],
            'status' => $row['status']
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid password']);
    }
} else {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid username']);
}

$mysqli->close();
