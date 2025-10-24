<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  exit(0);
}

$host = 'localhost';
$db = 'users';
$user = 'root';
$pass = '';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
  echo json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]);
  exit;
}

// ✅ Only select approved members
$sql = "SELECT username, role, status FROM users WHERE role = 'member' AND status = 'approved'";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
  $members = [];
  while ($row = $result->fetch_assoc()) {
    $members[] = $row;
  }
  echo json_encode($members);
} else {
  echo json_encode([]); // No approved members found
}

$conn->close();

