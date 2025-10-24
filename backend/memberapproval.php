<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
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

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Return all pending users
    $result = $mysqli->query("SELECT id, username, role, status FROM users WHERE status = 'pending'");

    $pendingUsers = [];
    while ($row = $result->fetch_assoc()) {
        $pendingUsers[] = $row;
    }

    echo json_encode($pendingUsers);
    $mysqli->close();
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Approve a user: receive id in POST body JSON
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'] ?? null;

    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing user ID']);
        exit;
    }

    $id = (int)$id;

    $updateSql = "UPDATE users SET status = 'approved' WHERE id = $id";
    if ($mysqli->query($updateSql)) {
        echo json_encode(['message' => 'User approved successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to approve user']);
    }
    $mysqli->close();
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
$mysqli->close();

