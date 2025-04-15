<?php
session_start();

/*****************************************************
 * CONNECT TO DB
 *****************************************************/
$dbFile = __DIR__ . '/db.sqlite';
$pdo = new PDO("sqlite:" . $dbFile);
// Ensure foreign keys
$pdo->exec("PRAGMA foreign_keys=ON");

/*****************************************************
 * INITIAL TABLES
 *****************************************************/
$pdo->exec("CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)");
$pdo->exec("CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    doc_name TEXT NOT NULL,
    doc_content TEXT,
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_modified DATETIME,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
)");

/*****************************************************
 * CREATE AN INITIAL USER IF NOT EXISTS
 * Full name: jose vicente carratala
 * Email: info@josevicentecarratala.com
 * Username: jocarsa
 * Password: jocarsa
 *****************************************************/
$check = $pdo->prepare("SELECT * FROM users WHERE username = ?");
$check->execute(["jocarsa"]);
if (!$check->fetch()) {
    $insert = $pdo->prepare("INSERT INTO users (full_name, email, username, password) VALUES (?,?,?,?)");
    $insert->execute([
        "jose vicente carratala",
        "info@josevicentecarratala.com",
        "jocarsa",
        "jocarsa"
    ]);
}

/*****************************************************
 * ROUTING
 *****************************************************/
$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($action) {
    case 'login':
        handleLogin($pdo);
        break;
    case 'logout':
        handleLogout();
        break;
    case 'getSessionUser':
        handleSessionUser($pdo);
        break;
    case 'getDocs':
        handleGetDocs($pdo);
        break;
    case 'createDoc':
        handleCreateDoc($pdo);
        break;
    case 'loadDoc':
        handleLoadDoc($pdo);
        break;
    case 'saveDoc':
        handleSaveDoc($pdo);
        break;
    default:
        echo json_encode(["success" => false, "message" => "Invalid action"]);
        break;
}

/*****************************************************
 * FUNCTIONS
 *****************************************************/

/**
 * LOGIN
 */
function handleLogin($pdo) {
    $input = json_decode(file_get_contents("php://input"), true);
    $username = $input['username'] ?? '';
    $password = $input['password'] ?? '';

    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($user) {
        if ($user['password'] === $password) {
            $_SESSION['user_id'] = $user['id'];
            echo json_encode([
                "success" => true,
                "user" => [
                    "id" => $user['id'],
                    "full_name" => $user['full_name'],
                    "email" => $user['email'],
                    "username" => $user['username']
                ]
            ]);
            return;
        }
    }
    echo json_encode(["success" => false, "message" => "Invalid credentials."]);
}

/**
 * LOGOUT
 */
function handleLogout() {
    session_destroy();
    echo json_encode(["success" => true, "message" => "Logged out."]);
}

/**
 * GET SESSION USER
 */
function handleSessionUser($pdo) {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(["loggedIn" => false]);
        return;
    }
    $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($user) {
        echo json_encode([
            "loggedIn" => true,
            "user" => [
                "id" => $user['id'],
                "full_name" => $user['full_name'],
                "email" => $user['email'],
                "username" => $user['username']
            ]
        ]);
    } else {
        echo json_encode(["loggedIn" => false]);
    }
}

/**
 * GET DOCUMENT LIST
 */
function handleGetDocs($pdo) {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(["success" => false, "message" => "Not logged in."]);
        return;
    }
    $userId = $_SESSION['user_id'];
    $stmt = $pdo->prepare("SELECT id, doc_name, date_created, date_modified FROM documents WHERE user_id = ? ORDER BY date_created DESC");
    $stmt->execute([$userId]);
    $docs = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["success" => true, "documents" => $docs]);
}

/**
 * CREATE DOCUMENT
 */
function handleCreateDoc($pdo) {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(["success" => false, "message" => "Not logged in."]);
        return;
    }
    $input = json_decode(file_get_contents("php://input"), true);
    $docName = $input['docName'] ?? '';
    if (!$docName) {
        echo json_encode(["success" => false, "message" => "Document name is required"]);
        return;
    }
    $userId = $_SESSION['user_id'];
    $stmt = $pdo->prepare("INSERT INTO documents (user_id, doc_name, doc_content, date_modified) VALUES (?,?,?,?)");
    $res = $stmt->execute([$userId, $docName, '', date('Y-m-d H:i:s')]);
    if ($res) {
        echo json_encode(["success" => true, "message" => "Document created"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error creating document"]);
    }
}

/**
 * LOAD DOCUMENT
 */
function handleLoadDoc($pdo) {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(["success" => false, "message" => "Not logged in."]);
        return;
    }
    $docId = $_GET['docId'] ?? 0;
    $userId = $_SESSION['user_id'];

    $stmt = $pdo->prepare("SELECT * FROM documents WHERE id = ? AND user_id = ?");
    $stmt->execute([$docId, $userId]);
    $doc = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($doc) {
        echo json_encode([
            "success" => true,
            "document" => [
                "id" => $doc['id'],
                "doc_name" => $doc['doc_name'],
                // doc_content -> decode JSON if not empty
                "doc_content" => $doc['doc_content'] ? json_decode($doc['doc_content'], true) : null
            ]
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Document not found"]);
    }
}

/**
 * SAVE DOCUMENT
 */
function handleSaveDoc($pdo) {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(["success" => false, "message" => "Not logged in."]);
        return;
    }
    $input = json_decode(file_get_contents("php://input"), true);
    $docId = $input['docId'] ?? 0;
    $docContent = $input['docContent'] ?? null;  // multi-sheet JSON
    $userId = $_SESSION['user_id'];

    $jsonContent = json_encode($docContent);

    $stmt = $pdo->prepare("UPDATE documents SET doc_content = ?, date_modified = ? WHERE id = ? AND user_id = ?");
    $res = $stmt->execute([$jsonContent, date('Y-m-d H:i:s'), $docId, $userId]);
    if ($res) {
        echo json_encode(["success" => true, "message" => "Document saved"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error saving document"]);
    }
}
