<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');
// Conexión a SQLite (crea "database.db" si no existe)
$pdo = new PDO('sqlite:database.db');
// Modo de errores de PDO para ver excepciones
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

/**
 * Creamos tablas si no existen:
 *  - users: para almacenar datos del usuario (nombre, email, usuario, contraseña)
 *  - dreams: para almacenar sueños (fecha, título, descripción) asociados a un usuario
 */
$pdo->exec("CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT,
    email TEXT,
    username TEXT UNIQUE,
    password TEXT
)");

$pdo->exec("CREATE TABLE IF NOT EXISTS dreams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    dream_date TEXT,
    title TEXT,
    description TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
)");

// Obtenemos la ruta de la query string. Ej: api.php?route=login
$route = $_GET['route'] ?? '';
// Leemos el body JSON (si existe)
$input = json_decode(file_get_contents('php://input'), true);

// Rutas disponibles
switch ($route) {

    // --- REGISTRO DE USUARIO ---
    case 'register':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $full_name = $input['full_name'] ?? '';
            $email     = $input['email'] ?? '';
            $username  = $input['username'] ?? '';
            $password  = $input['password'] ?? '';

            // Validar campos
            if (!$full_name || !$email || !$username || !$password) {
                echo json_encode(['success' => false, 'message' => 'Faltan campos para el registro.']);
                exit;
            }

            // Hashear contraseña
            $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

            // Insertar en DB
            try {
                $stmt = $pdo->prepare("INSERT INTO users (full_name, email, username, password)
                                       VALUES (?, ?, ?, ?)");
                $stmt->execute([$full_name, $email, $username, $hashedPassword]);

                echo json_encode(['success' => true, 'message' => 'Usuario registrado con éxito']);
            } catch (PDOException $e) {
                // Código 23000 significa error de clave única (ej. username duplicado)
                if ($e->getCode() == 23000) {
                    echo json_encode(['success' => false, 'message' => 'El nombre de usuario ya existe']);
                } else {
                    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
                }
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Método no permitido']);
        }
        break;

    // --- LOGIN ---
    case 'login':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $username = $input['username'] ?? '';
            $password = $input['password'] ?? '';

            // Buscar usuario
            $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
            $stmt->execute([$username]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$user || !password_verify($password, $user['password'])) {
                // Credenciales inválidas
                echo json_encode(['success' => false, 'message' => 'Usuario o contraseña incorrectos']);
                exit;
            }

            // Login correcto
            echo json_encode([
                'success' => true,
                'message' => 'Login exitoso',
                'user' => [
                    'id'        => $user['id'],
                    'full_name' => $user['full_name'],
                    'email'     => $user['email'],
                    'username'  => $user['username']
                ]
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Método no permitido']);
        }
        break;

    // --- GUARDAR SUEÑO ---
    case 'add-dream':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $user_id    = $input['user_id'] ?? '';
            $dream_date = $input['dream_date'] ?? '';
            $title      = $input['title'] ?? '';
            $description= $input['description'] ?? '';

            if (!$user_id || !$dream_date || !$title || !$description) {
                echo json_encode(['success' => false, 'message' => 'Faltan campos del sueño']);
                exit;
            }

            $stmt = $pdo->prepare("INSERT INTO dreams (user_id, dream_date, title, description)
                                   VALUES (?, ?, ?, ?)");
            $stmt->execute([$user_id, $dream_date, $title, $description]);

            echo json_encode(['success' => true, 'message' => 'Sueño guardado correctamente']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Método no permitido']);
        }
        break;

    // --- LISTAR SUEÑOS ---
    case 'get-dreams':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $user_id = $input['user_id'] ?? '';
            if (!$user_id) {
                echo json_encode(['success' => false, 'message' => 'Falta user_id']);
                exit;
            }

            $stmt = $pdo->prepare("SELECT * FROM dreams WHERE user_id = ? ORDER BY created_at DESC");
            $stmt->execute([$user_id]);
            $dreams = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode(['success' => true, 'dreams' => $dreams]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Método no permitido']);
        }
        break;

    // --- RUTA NO DEFINIDA ---
    default:
        echo json_encode(['success' => false, 'message' => 'Ruta no válida']);
        break;
}
