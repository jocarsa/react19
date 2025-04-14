import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');

  // Datos del usuario (opcional)
  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');

  // Controla si el user ingresó datos iniciales
  const [isStarted, setIsStarted] = useState(false);

  // Para controlar animaciones de la tarjeta
  const [slideIn, setSlideIn] = useState(true);

  // Array de respuestas del usuario
  // Cada elemento: { questionId, userAnswer, isCorrect }
  const [answers, setAnswers] = useState([]);

  // Flag para ver si terminamos el quiz
  const [quizFinished, setQuizFinished] = useState(false);

  // Obtener preguntas al cargar
  useEffect(() => {
    fetch('https://mandela.jocarsa.com/api/api.php?action=questions')
      .then(response => response.json())
      .then(data => {
        setQuestions(data);
      })
      .catch(error => {
        console.error('Error al obtener preguntas:', error);
      });
  }, []);

  // Iniciar quiz
  const startQuiz = () => {
    setIsStarted(true);
  };

  // Lógica de respuesta
  const handleAnswer = (userAnswer) => {
    if (quizFinished) return;

    const currentQuestion = questions[currentIndex];
    // Validar si es correcto
    const isCorrect = (userAnswer === currentQuestion.respuesta);

    // Actualizar feedback
    if (userAnswer === 'siguiente') {
      setFeedback(`¡Pregunta omitida! Respuesta correcta: ${currentQuestion.respuesta.toUpperCase()}.`);
    } else {
      if (isCorrect) {
        setScore(score + 1);
        setFeedback(`¡Correcto! Respuesta: ${currentQuestion.respuesta.toUpperCase()}.`);
      } else {
        setFeedback(`Incorrecto. Respuesta correcta: ${currentQuestion.respuesta.toUpperCase()}.`);
      }
    }

    // Guardar la respuesta en el array
    setAnswers(prev => [
      ...prev,
      {
        questionId: currentQuestion.id,
        userAnswer: (userAnswer === 'siguiente') ? 'omitida' : userAnswer,
        isCorrect: (userAnswer !== 'siguiente') && isCorrect
      }
    ]);
  };

  // Pasar a la siguiente pregunta
  const nextQuestion = () => {
    // Si estamos en la última pregunta, finalizamos
    if (currentIndex === questions.length - 1) {
      setQuizFinished(true);
      return;
    }

    // Animación: hacemos “slide-out”
    setSlideIn(false);

    // Esperamos el tiempo de la animación para cambiar de pregunta
    setTimeout(() => {
      setFeedback('');
      setCurrentIndex(currentIndex + 1);
      setSlideIn(true); // “slide-in” con la nueva pregunta
    }, 300); // 300ms coincide con la duración definida en CSS
  };

  // Al finalizar el quiz, enviamos todo al backend
  useEffect(() => {
    if (quizFinished && questions.length > 0) {
      const payload = {
        username: username.trim(),
        age: age ? parseInt(age, 10) : null,
        score: score,
        total: questions.length,
        answers: answers
      };

      fetch('https://mandela.jocarsa.com/api/api.php?action=save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(res => res.json())
        .then(result => {
          console.log('Resultados guardados:', result);
        })
        .catch(error => {
          console.error('Error al guardar resultados:', error);
        });
    }
  }, [quizFinished, answers, score, username, age, questions.length]);

  // Render

  // 1) Sin preguntas
  if (questions.length === 0) {
    return (
      <div className="quiz-container">
        <h2>Cargando preguntas...</h2>
      </div>
    );
  }

  // 2) Pantalla inicial
  if (!isStarted) {
    return (
      <div className="quiz-container intro">
        <h1>Quiz del Efecto Mandela</h1>
        <p>¡Bienvenido! Puedes ingresar tu nombre y edad, o dejarlos en blanco.</p>
        <input
          type="text"
          placeholder="Tu nombre (opcional)"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="number"
          placeholder="Tu edad (opcional)"
          value={age}
          onChange={e => setAge(e.target.value)}
        />
        <button onClick={startQuiz}>Comenzar</button>
      </div>
    );
  }

  // 3) Pantalla final
  if (quizFinished) {
    return (
      <div className="quiz-container">
        <h2>¡Quiz finalizado!</h2>
        <p>
          Tu puntuación es <strong>{score}</strong> de {questions.length}.
        </p>
        <p>Gracias por participar{username ? `, ${username}` : ''}.</p>
      </div>
    );
  }

  // 4) Pantalla de pregunta actual con animación
  const currentQuestion = questions[currentIndex];

  return (
    <div className="quiz-container">
      {/* Aquí aplicamos la animación a la tarjeta completa */}
      <div className={`quiz-card ${slideIn ? 'slide-in' : 'slide-out'}`}>
        <h2>Pregunta {currentIndex + 1} de {questions.length}</h2>
        <p className="question-text">{currentQuestion.pregunta}</p>

        {feedback && (
          <div className="feedback">{feedback}</div>
        )}

        {/* Si no hay feedback, mostramos los botones de respuesta */}
        {!feedback && (
          <div className="buttons-container">
            <button onClick={() => handleAnswer('verdadero')}>Verdadero</button>
            <button onClick={() => handleAnswer('falso')}>Falso</button>
            <button onClick={() => handleAnswer('siguiente')}>Omitir</button>
          </div>
        )}

        {/* Botón para ir a la siguiente pregunta cuando hay feedback */}
        {feedback && (
          <button className="next-btn" onClick={nextQuestion}>
            Continuar
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
