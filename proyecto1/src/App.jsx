import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
     <div>
        <h1>Este es mi proyecto</h1>
        <p>Este es un texto</p>
    </div>
  )
}

export default App
