<?php
/**
 * install.php
 *
 * Crea tablas:
 *   - `questions`: para las preguntas y sus respuestas correctas.
 *   - `results`: para almacenar datos básicos de cada quiz (usuario, edad, IP, score, etc.).
 *   - `answers`: para guardar las respuestas del usuario, pregunta por pregunta.
 *
 * Además, inserta preguntas iniciales en `questions`. Las preguntas están basadas en hechos
 * que han dado lugar al efecto Mandela, es decir, errores de memoria colectiva conocidos a nivel mundial.
 *
 * Nota: No se incluyen hechos delicados de la historia española y se evita el uso de términos en inglés.
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

    // Inserta preguntas iniciales basadas en hechos del efecto Mandela
    $initialQuestions = [
        [
            "question" => "¿Es correcto que Nelson Mandela murió en prisión en los años 80?",
            "correct_answer" => "Falso: No es correcto porque Nelson Mandela falleció en 2013 y llegó a ser presidente de Sudáfrica."
        ],
        [
            "question" => "¿Es correcto que en la saga Star Wars se dice 'Luke, yo soy tu padre'?",
            "correct_answer" => "Falso: No es correcto porque la frase original es 'No, yo soy tu padre'."
        ],
        [
            "question" => "¿Es correcto que el logotipo de KitKat incluye un guion entre 'Kit' y 'Kat'?",
            "correct_answer" => "Falso: No es correcto porque el logotipo oficial no lleva ningún guion."
        ],
        [
            "question" => "¿Es correcto que el personaje del Monopoly siempre ha llevado un monóculo?",
            "correct_answer" => "Falso: No es correcto porque las representaciones oficiales del personaje no muestran un monóculo."
        ],
        [
            "question" => "¿Es correcto que la canción 'We Are the Champions' de Queen termina con la frase 'of the world'?",
            "correct_answer" => "Falso: No es correcto porque la versión original en los discos no incluye esa frase al final."
        ],
        [
            "question" => "¿Es correcto que Pikachu tiene la punta de la cola de color negro?",
            "correct_answer" => "Falso: No es correcto porque, según su diseño oficial, la cola de Pikachu es completamente amarilla."
        ],
        [
            "question" => "¿Es correcto que el nombre del famoso dibujo animado es 'Looney Toons'?",
            "correct_answer" => "Falso: No es correcto porque el nombre original es 'Looney Tunes'."
        ],
        [
            "question" => "¿Es correcto que el logotipo de Fruit of the Loom incluye un cuerno de la abundancia?",
            "correct_answer" => "Falso: No es correcto porque el logotipo oficial nunca ha mostrado un cuerno de la abundancia."
        ],
        [
            "question" => "¿Es correcto que en la película de Blancanieves la Reina dice 'Espejito, espejito en la pared'?",
            "correct_answer" => "Falso: No es correcto porque la frase atribuida es una alteración; la versión original varía según la adaptación."
        ],
        [
            "question" => "¿Es correcto que la serie de libros infantiles se escribe como 'Berenstein Bears'?",
            "correct_answer" => "Falso: No es correcto porque la forma oficial es 'Berenstain Bears', pese a que muchos la recuerdan de otra manera."
        ],
        [
            "question" => "¿Es correcto que el himno nacional de España, 'La Marcha Real', tiene letra oficial?",
            "correct_answer" => "Falso: No es correcto porque 'La Marcha Real' no dispone de una letra oficial, a pesar de algunos intentos y recuerdos erróneos."
        ],
        [
            "question" => "¿Es correcto que en la serie 'Star Trek' se dice 'Beam me up, Scotty'?",
            "correct_answer" => "Falso: No es correcto porque esa frase nunca apareció de forma exacta en la serie, siendo una interpretación popular."
        ],
        [
            "question" => "¿Es correcto que el 'efecto Mandela' se debe a cambios reales en la historia?",
            "correct_answer" => "Falso: No es correcto porque el 'efecto Mandela' es un fenómeno de memoria colectiva errónea, no de alteraciones en la realidad histórica."
        ],
        [
            "question" => "¿Es correcto que existió una película llamada 'Shazaam' protagonizada por Sinbad en los años 90?",
            "correct_answer" => "Falso: No es correcto porque no existe ninguna película oficial con ese título, a pesar de que muchas personas la recuerdan."
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
    echo "<p>Se han creado (si no existían) las tablas y se han insertado las preguntas iniciales en 'questions'.</p>";

} catch (PDOException $e) {
    echo "<p>Error al crear/actualizar la base de datos: " . $e->getMessage() . "</p>";
    exit;
}
