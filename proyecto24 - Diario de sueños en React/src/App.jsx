import React, { useState, useEffect } from 'react'
import './App.css'

const API_URL = 'https://antiquewhite.jocarsa.com/api/api.php' // Ajusta con tu ruta real

function App() {
  const [usuario, setUsuario] = useState(null)
  const [seccionActiva, setSeccionActiva] = useState('inicio')
  const [mostrarRegistro, setMostrarRegistro] = useState(false)

  useEffect(() => {
    const userGuardado = localStorage.getItem('usuario')
    if (userGuardado) {
      setUsuario(JSON.parse(userGuardado))
    }
  }, [])

  function manejarCerrarSesion() {
    localStorage.removeItem('usuario')
    setUsuario(null)
    setSeccionActiva('inicio')
  }

  // Si no hay usuario en sesión, mostramos pantalla de Auth (login/registro)
  if (!usuario) {
    return (
      <div className="screen" id="loginScreen">
        {mostrarRegistro ? (
          <PantallaRegistro
            onVolverAlLogin={() => setMostrarRegistro(false)}
            onRegistroExitoso={(userData) => {
              setUsuario(userData)
              localStorage.setItem('usuario', JSON.stringify(userData))
            }}
          />
        ) : (
          <PantallaLogin
            onCambiarARegistro={() => setMostrarRegistro(true)}
            onLoginExitoso={(userData) => {
              setUsuario(userData)
              localStorage.setItem('usuario', JSON.stringify(userData))
            }}
          />
        )}
      </div>
    )
  }

  // Si hay usuario, mostramos la aplicación principal
  return (
    <div className="screen" id="appContainer">
      <Encabezado onLogout={manejarCerrarSesion} />

      <main
        id="mainScreen"
        className={seccionActiva === 'inicio' ? '' : 'hidden'}
      >
        <SeccionInicio usuario={usuario} />
      </main>

      <section
        id="contentScreen_news"
        className={seccionActiva === 'noticias' ? '' : 'hidden'}
      >
        <SeccionNoticias usuario={usuario} />
      </section>

      <section
        id="contentScreen_profile"
        className={seccionActiva === 'perfil' ? '' : 'hidden'}
      >
        <SeccionPerfil usuario={usuario} />
      </section>

      <NavegacionInferior
        seccionActiva={seccionActiva}
        onCambiarSeccion={setSeccionActiva}
      />
    </div>
  )
}

/* -------------------------------------
   ENCABEZADO (HEADER)
------------------------------------- */
function Encabezado({ onLogout }) {
  return (
    <header>
      <h1>Mis Sueños</h1>
      <button id="logoutButton" onClick={onLogout}>
        Cerrar Sesión
      </button>
    </header>
  )
}

/* -------------------------------------
   NAVEGACIÓN INFERIOR
------------------------------------- */
function NavegacionInferior({ seccionActiva, onCambiarSeccion }) {
  return (
    <nav>
      <ul>
        <li
          className={seccionActiva === 'inicio' ? 'active' : ''}
          onClick={() => onCambiarSeccion('inicio')}
        >
          🏠
        </li>
        <li
          className={seccionActiva === 'noticias' ? 'active' : ''}
          onClick={() => onCambiarSeccion('noticias')}
        >
          📰
        </li>
        <li
          className={seccionActiva === 'perfil' ? 'active' : ''}
          onClick={() => onCambiarSeccion('perfil')}
        >
          👤
        </li>
      </ul>
    </nav>
  )
}

/* -------------------------------------
   PANTALLA LOGIN
------------------------------------- */
function PantallaLogin({ onCambiarARegistro, onLoginExitoso }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [mensaje, setMensaje] = useState('')

  const manejarLogin = async (e) => {
    e.preventDefault()
    setMensaje('Iniciando sesión...')

    try {
      const response = await fetch(`${API_URL}?route=login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await response.json()
      if (data.success) {
        // data.user => { id, full_name, email, username }
        onLoginExitoso(data.user)
      } else {
        setMensaje(data.message || 'No se pudo iniciar sesión')
      }
    } catch (err) {
      console.error(err)
      setMensaje('Error del servidor')
    }
  }

  return (
    <form id="loginForm" onSubmit={manejarLogin}>
      <h2>Iniciar Sesión</h2>
      <input
        type="text"
        placeholder="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Ingresar</button>
      <p id="loginMessage" className="message">
        {mensaje}
      </p>
      <p className="register-link">
        ¿No tienes cuenta?{' '}
        <button type="button" onClick={onCambiarARegistro}>
          Regístrate aquí
        </button>
      </p>
    </form>
  )
}

/* -------------------------------------
   PANTALLA REGISTRO
------------------------------------- */
function PantallaRegistro({ onVolverAlLogin, onRegistroExitoso }) {
  const [nombreCompleto, setNombreCompleto] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [mensaje, setMensaje] = useState('')

  const manejarRegistro = async (e) => {
    e.preventDefault()
    setMensaje('Registrando...')

    try {
      const response = await fetch(`${API_URL}?route=register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: nombreCompleto,
          email,
          username,
          password,
        }),
      })
      const data = await response.json()

      if (data.success) {
        // Registrado con éxito; iniciamos sesión automáticamente
        onRegistroExitoso({
          id: data.user?.id ?? 0, // solo si el back enviara user (o lo re-obtenemos)
          full_name: nombreCompleto,
          email,
          username,
        })
      } else {
        setMensaje(data.message || 'Error al registrar usuario')
      }
    } catch (err) {
      console.error(err)
      setMensaje('Error del servidor')
    }
  }

  return (
    <form id="registerForm" onSubmit={manejarRegistro}>
      <h2>Registro de Nuevo Usuario</h2>
      <input
        type="text"
        placeholder="Nombre Completo"
        value={nombreCompleto}
        onChange={(e) => setNombreCompleto(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Correo Electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Crear Cuenta</button>
      <p id="registerMessage" className="message">
        {mensaje}
      </p>
      <p className="register-link">
        ¿Ya tienes cuenta?{' '}
        <button type="button" onClick={onVolverAlLogin}>
          Inicia sesión aquí
        </button>
      </p>
    </form>
  )
}

/* -------------------------------------
   SECCIÓN INICIO (Agregar Sueño)
------------------------------------- */
function SeccionInicio({ usuario }) {
  const [fecha, setFecha] = useState('')
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [mensaje, setMensaje] = useState('')

  const manejarAgregarSueno = async (e) => {
    e.preventDefault()
    if (!fecha || !titulo || !descripcion) {
      setMensaje('Por favor llena todos los campos')
      return
    }
    setMensaje('Guardando sueño...')

    try {
      const resp = await fetch(`${API_URL}?route=add-dream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: usuario.id,
          dream_date: fecha,
          title: titulo,
          description: descripcion,
        }),
      })
      const data = await resp.json()
      if (data.success) {
        setMensaje('¡Sueño guardado con éxito!')
        setFecha('')
        setTitulo('')
        setDescripcion('')
      } else {
        setMensaje(data.message || 'Error al guardar el sueño')
      }
    } catch (err) {
      console.error(err)
      setMensaje('Error del servidor')
    }
  }

  return (
    <div>
      <h2>Agregar un Nuevo Sueño</h2>
      <form className="dream-form" onSubmit={manejarAgregarSueno}>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
        <input
          type="text"
          placeholder="Título del sueño"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <textarea
          rows="3"
          placeholder="Describe tu sueño..."
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <button type="submit">Guardar Sueño</button>
      </form>
      <p className="message">{mensaje}</p>
    </div>
  )
}

/* -------------------------------------
   SECCIÓN NOTICIAS (Lista de Sueños)
------------------------------------- */
function SeccionNoticias({ usuario }) {
  const [suenos, setSuenos] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const obtenerSuenos = async () => {
      setCargando(true)
      try {
        const res = await fetch(`${API_URL}?route=get-dreams`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: usuario.id }),
        })
        const data = await res.json()
        if (data.success) {
          setSuenos(data.dreams || [])
        }
      } catch (err) {
        console.error(err)
      }
      setCargando(false)
    }
    obtenerSuenos()
  }, [usuario])

  if (cargando) return <p>Cargando sueños...</p>
  if (!suenos.length) return <p>No tienes ningún sueño registrado aún.</p>

  return (
    <div>
      <h2>Lista de Mis Sueños</h2>
      {suenos.map((dream) => (
        <div className="dream-item" key={dream.id}>
          <h4>{dream.title}</h4>
          <p className="date-info">Fecha: {dream.dream_date}</p>
          <p>{dream.description}</p>
        </div>
      ))}
    </div>
  )
}

/* -------------------------------------
   SECCIÓN PERFIL (Datos del Usuario)
------------------------------------- */
function SeccionPerfil({ usuario }) {
  return (
    <div>
      <h2>Mi Perfil</h2>
      <p>
        <strong>Nombre:</strong> {usuario.full_name}
      </p>
      <p>
        <strong>Usuario:</strong> {usuario.username}
      </p>
      <p>
        <strong>Correo:</strong> {usuario.email}
      </p>
    </div>
  )
}

export default App
