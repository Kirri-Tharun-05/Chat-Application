import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Home.jsx';
import Screen from './Screen.jsx';
function App() {

  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/room/:roomId' element={<Screen />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App;
