<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'users';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

header('Content-Type: application/json');
$method = $_SERVER['REQUEST_METHOD'];

function getJsonInput() {
    return json_decode(file_get_contents('php://input'), true);
}

switch ($method) {
    case 'GET':
      
        $result = $conn->query("SELECT id, title, description FROM projects ORDER BY id DESC");
        $projects = [];
        while ($row = $result->fetch_assoc()) {
            $projects[] = $row;
        }
        echo json_encode($projects);
        break;

    case 'POST':
       
        $input = getJsonInput();
        $title = isset($input['title']) ? trim($conn->real_escape_string($input['title'])) : '';
        $description = isset($input['description']) ? trim($conn->real_escape_string($input['description'])) : '';

        if (empty($title)) {
            http_response_code(400);
            echo json_encode(['error' => 'Title is required']);
            exit;
        }

        $sql = "INSERT INTO projects (title, description) VALUES ('$title', '$description')";
        if ($conn->query($sql)) {
            echo json_encode(['success' => true, 'id' => $conn->insert_id]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create project']);
        }
        break;

    case 'PUT':
       
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Project ID is required']);
            exit;
        }
        $id = intval($_GET['id']);
        $input = getJsonInput();
        $title = isset($input['title']) ? trim($conn->real_escape_string($input['title'])) : '';
        $description = isset($input['description']) ? trim($conn->real_escape_string($input['description'])) : '';

        if (empty($title)) {
            http_response_code(400);
            echo json_encode(['error' => 'Title is required']);
            exit;
        }

        $sql = "UPDATE projects SET title='$title', description='$description' WHERE id=$id";
        if ($conn->query($sql)) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update project']);
        }
        break;

    case 'DELETE':
        
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Project ID is required']);
            exit;
        }
        $id = intval($_GET['id']);
        $sql = "DELETE FROM projects WHERE id=$id";
        if ($conn->query($sql)) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete project']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

$conn->close();
