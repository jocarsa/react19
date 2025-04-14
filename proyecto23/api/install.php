<?php
/**
 * install.php
 *
 * Crea tablas:
 *   - `questions`: para preguntas y respuestas correctas.
 *   - `results`: para datos básicos de cada quiz (usuario, edad, IP, score, etc.).
 *   - `answers`: para almacenar las respuestas del usuario pregunta por pregunta.
 *
 * Además, inserta preguntas iniciales en `questions`.
 */

header('Content-Type: text/html; charset=utf-8');

$dbFile = __DIR__ . '/quiz.db';

try {
    $pdo = new PDO("sqlite:$dbFile");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Crear tabla 'questions'
    $pdo->exec("
      CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question TEXT NOT NULL,
        correct_answer TEXT NOT NULL
      )
    ");

    // Crear tabla 'results'
    $pdo->exec("
      CREATE TABLE IF NOT EXISTS results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT DEFAULT '',
        age INTEGER DEFAULT NULL,
        user_ip TEXT DEFAULT '',
        score INTEGER NOT NULL,
        total INTEGER NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    ");

    // Crear tabla 'answers'
    // Aquí almacenaremos los datos del usuario para cada pregunta respondida
    // is_correct puede ser 0 (falso) o 1 (verdadero) según SQLite
    $pdo->exec("
      CREATE TABLE IF NOT EXISTS answers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        result_id INTEGER NOT NULL,
        question_id INTEGER NOT NULL,
        user_answer TEXT NOT NULL,
        is_correct INTEGER NOT NULL,
        FOREIGN KEY (result_id) REFERENCES results(id),
        FOREIGN KEY (question_id) REFERENCES questions(id)
      )
    ");

    // Inserta preguntas iniciales
    // (Descomentar la siguiente línea si quieres limpiar la tabla primero)
    // $pdo->exec("DELETE FROM questions");

    $initialQuestions = [
        [
          "question" => "La famosa frase de Star Wars es 'Luke, yo soy tu padre'.",
          "correct_answer" => "falso"
        ],
        [
          "question" => "El personaje del Monopoly siempre ha llevado un monóculo.",
          "correct_answer" => "falso"
        ],
        [
          "question" => "Pikachu tiene la punta de la cola de color negro.",
          "correct_answer" => "falso"
        ],
        [
          "question" => "Nelson Mandela murió en prisión en los años 80.",
          "correct_answer" => "falso"
        ],
        [
          "question" => "En la película de Disney Blancanieves, la Reina dice: 'Espejito, espejito en la pared...'.",
          "correct_answer" => "falso"
        ],
        [
          "question" => "El logotipo de KitKat lleva un guion entre 'Kit' y 'Kat'.",
          "correct_answer" => "falso"
        ],
        [
          "question" => "El nombre correcto del dibujo animado es 'Looney Tunes'.",
          "correct_answer" => "verdadero"
        ],
        [
          "question" => "C-3PO tiene una pierna completamente dorada.",
          "correct_answer" => "falso"
        ],
        [
          "question" => "La canción 'We Are the Champions' de Queen termina con 'of the world' en su versión original.",
          "correct_answer" => "falso"
        ],
        [
          "question" => "El producto de limpieza se llama 'Febreze' y no 'Febreeze'.",
          "correct_answer" => "verdadero"
        ]
    ];

    $insertStmt = $pdo->prepare("
      INSERT INTO questions (question, correct_answer)
      VALUES (:question, :correct_answer)
    ");

    foreach ($initialQuestions as $q) {
        $insertStmt->execute([
            ':question' => $q["question"],
            ':correct_answer' => $q["correct_answer"]
        ]);
    }

    echo "<h3>Instalación completada</h3>";
    echo "<p>Se han creado (si no existían) las tablas y se han insertado preguntas iniciales en 'questions'.</p>";

} catch (PDOException $e) {
    echo "<p>Error al crear/actualizar la base de datos: " . $e->getMessage() . "</p>";
    exit;
}
