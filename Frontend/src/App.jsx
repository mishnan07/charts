import { useState } from 'react'
import { Routes, Route, Navigate } from "react-router-dom";
import Home from './Components/Home/Home';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
          <Routes>

      <Route
          path="/home"
          element={ <Home /> }
        />

     </Routes>
    </>

  )
}

export default App
