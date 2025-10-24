<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$mysqli = new mysqli("localhost", "root", "", "users");

if ($mysqli->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $mysqli->connect_error]));
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $result = $mysqli->query("SELECT id, username AS name, role, status FROM users WHERE role = 'admin'");
        $admins = [];
        while ($row = $result->fetch_assoc()) {
            $admins[] = $row;
        }
        echo json_encode($admins);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        $name = $mysqli->real_escape_string($data['name']);
        $result = $mysqli->query("UPDATE users SET role = 'admin' WHERE username = '$name'");

        if ($mysqli->affected_rows > 0) {
            echo json_encode(["message" => "User promoted to admin"]);
        } else {
            echo json_encode(["error" => "User not found or already admin"]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        $id = (int) $data['id'];
        if (isset($data['status'])) {
            $status = $mysqli->real_escape_string($data['status']);
            if (in_array($status, ['approved', 'pending'])) {
                $mysqli->query("UPDATE users SET status = '$status' WHERE id = $id");
                echo json_encode(["message" => "Status updated"]);
            } else {
                http_response_code(400);
                echo json_encode(["error" => "Invalid status value"]);
            }
        } else {
            $name = $mysqli->real_escape_string($data['name'] ?? '');
            $role = $mysqli->real_escape_string($data['role'] ?? 'admin');
            $mysqli->query("UPDATE users SET username = '$name', role = '$role' WHERE id = $id");
            echo json_encode(["message" => "Admin updated"]);
        }
        break;

    case 'DELETE':
        $id = (int) $_GET['id'];
        $mysqli->query("UPDATE users SET role = 'member' WHERE id = $id");
        echo json_encode(["message" => "Admin demoted to member"]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["message" => "Method Not Allowed"]);
        break;
}

$mysqli->close();

