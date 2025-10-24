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

$username = $_GET['username'] ?? '';

if (!$username) {
    echo json_encode(['error' => 'Username is required']);
    exit;
}

// Query user info from the users table
$sql_member = "SELECT total_funds, total_programs FROM users WHERE username = ? AND role='member'";
$stmt = $conn->prepare($sql_member);
$stmt->bind_param("s", $username);
$stmt->execute();
$result_member = $stmt->get_result();

if ($result_member->num_rows === 0) {
    echo json_encode(['error' => 'Member not found']);
    exit;
}

$member = $result_member->fetch_assoc();

// Query projects (to use as announcements)
$sql_projects = "SELECT id, title, description FROM projects ORDER BY id DESC";
$result_projects = $conn->query($sql_projects);

$projects = [];
if ($result_projects && $result_projects->num_rows > 0) {
    while ($row = $result_projects->fetch_assoc()) {
        $projects[] = [
            'id' => (int)$row['id'],
            'title' => $row['title'],
            'description' => $row['description']
        ];
    }
}

$response = [
    'total_funds' => (float)$member['total_funds'],
    'total_programs' => (int)$member['total_programs'],
    'projects' => $projects
];

echo json_encode($response);

$conn->close();

