<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

$host = 'localhost';
$db = 'users';
$user = 'root';
$pass = '';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
  echo json_encode(['error' => 'Database connection failed']);
  exit;
}

// ✅ Count only users where role = 'member'
$result = $conn->query("SELECT COUNT(*) as count FROM users WHERE role = 'member'");

if ($result) {
  $row = $result->fetch_assoc();
  echo json_encode(['count' => (int)$row['count']]);
} else {
  echo json_encode(['error' => 'Query failed']);
}

$conn->close();

