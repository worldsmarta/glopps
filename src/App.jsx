import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LogisticsConsumer from './LogisticsConsumer/LogisticsConsumer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <LogisticsConsumer/>
    </>
  )
}

export default App
