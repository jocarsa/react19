<?php
$dbFile = __DIR__ . '/db.sqlite';
if (file_exists($dbFile)) {
    unlink($dbFile);
}

$pdo = new PDO("sqlite:" . $dbFile);
$pdo->exec("PRAGMA foreign_keys=ON");

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

echo "Database structure created.\n";

// Insert initial user
$stmt = $pdo->prepare("INSERT INTO users (full_name, email, username, password) VALUES (?,?,?,?)");
$stmt->execute([
    "jose vicente carratala",
    "info@josevicentecarratala.com",
    "jocarsa",
    "jocarsa"
]);

echo "Initial user inserted.\n";
