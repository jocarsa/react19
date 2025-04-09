import { useState } from 'react'
import './App.css'
import ContadorComponent from "./ContadorComponent";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ContadorComponent />
    </>
  )
}

export default App
