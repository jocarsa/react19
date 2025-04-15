<?php
/**
 * api.php
 *
 * Contiene endpoints para:
 *   - GET  ?action=questions -> Obtiene preguntas de la BD
 *   - POST ?action=save      -> Guarda resultados y respuestas
 */

header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  exit(0);
}

$dbFile = __DIR__ . '/quiz.db';

try {
    $pdo = new PDO("sqlite:$dbFile");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

// =================== GET: OBTENER PREGUNTAS =========================
if ($method === 'GET' && $action === 'questions') {
    try {
        $stmt = $pdo->query("SELECT id, question, correct_answer FROM questions");
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Ajustar formato para el frontend
        $questions = [];
        foreach ($rows as $r) {
            $questions[] = [
                "id"       => $r["id"],
                "pregunta" => $r["question"],
                "respuesta" => $r["correct_answer"]  // El front podría o no necesitar la respuesta real, depende
            ];
        }

        echo json_encode($questions);
        exit;
    } catch (PDOException $e) {
        echo json_encode(["error" => "Error al obtener preguntas: " . $e->getMessage()]);
        exit;
    }

// =================== POST: GUARDAR RESULTADOS =======================
} elseif ($method === 'POST' && $action === 'save') {
    $inputData = json_decode(file_get_contents('php://input'), true);

    // Estructura esperada en $inputData:
    // {
    //   "username": "...",
    //   "age": 25,
    //   "score": 8,
    //   "total": 10,
    //   "answers": [
    //       { "questionId": 1, "userAnswer": "falso", "isCorrect": true },
    //       ...
    //   ]
    // }

    // Validar datos
    if (!isset($inputData['score']) || !isset($inputData['total']) || !isset($inputData['answers'])) {
        echo json_encode(["error" => "Datos incompletos"]);
        exit;
    }

    // Nombre y edad pueden ser opcionales. Si no vienen, ponlos en vacío o null
    $username = isset($inputData['username']) ? $inputData['username'] : '';
    $age      = isset($inputData['age']) ? (int)$inputData['age'] : null;
    $score    = (int)$inputData['score'];
    $total    = (int)$inputData['total'];
    $answers  = $inputData['answers'];

    // Capturar IP del usuario
    $userIp   = $_SERVER['REMOTE_ADDR'] ?? '';

    // Primero, insertar en la tabla 'results'
    try {
        $stmt = $pdo->prepare("
          INSERT INTO results (username, age, user_ip, score, total)
          VALUES (:username, :age, :user_ip, :score, :total)
        ");
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':age', $age);
        $stmt->bindParam(':user_ip', $userIp);
        $stmt->bindParam(':score', $score);
        $stmt->bindParam(':total', $total);
        $stmt->execute();

        $resultId = $pdo->lastInsertId(); // ID autogenerado

        // Insertar respuestas en la tabla 'answers'
        $stmtAns = $pdo->prepare("
          INSERT INTO answers (result_id, question_id, user_answer, is_correct)
          VALUES (:result_id, :question_id, :user_answer, :is_correct)
        ");

        foreach ($answers as $answer) {
            // Cada elemento en 'answers' debe tener: questionId, userAnswer, isCorrect
            $stmtAns->execute([
                ':result_id'   => $resultId,
                ':question_id' => $answer["questionId"],
                ':user_answer' => $answer["userAnswer"],
                ':is_correct'  => $answer["isCorrect"] ? 1 : 0
            ]);
        }

        echo json_encode(["status" => "ok", "message" => "Resultados guardados correctamente"]);
        exit;
    } catch (PDOException $e) {
        echo json_encode(["error" => "Error al guardar resultados: " . $e->getMessage()]);
        exit;
    }

} else {
    // Ruta no válida
    echo json_encode(["error" => "Ruta o método no soportado"]);
    exit;
}
