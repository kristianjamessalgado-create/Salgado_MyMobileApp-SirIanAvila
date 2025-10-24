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
$role = $_POST['role'] ?? 'member'; // Default role is member

if (!$username || !$password) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing username or password']);
    exit;
}

$username = $mysqli->real_escape_string($username);
$role = $mysqli->real_escape_string($role);
$passwordPlain = $mysqli->real_escape_string($password);

// All new users get 'pending' status initially
$status = 'pending';

// Check if username already exists
$checkSql = "SELECT id FROM users WHERE username = '$username'";
$result = $mysqli->query($checkSql);
if ($result && $result->num_rows > 0) {
    http_response_code(409);
    echo json_encode(['error' => 'Username already exists']);
    exit;
}

$sql = "INSERT INTO users (username, password_hash, role, status) VALUES (?, ?, ?, ?)";
$stmt = $mysqli->prepare($sql);
$stmt->bind_param("ssss", $username, $passwordPlain, $role, $status);

if ($stmt->execute()) {
    echo json_encode(['message' => 'Registration successful. Awaiting admin approval.']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Registration failed.']);
}

$stmt->close();
$mysqli->close();
