import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Question from './components/question'
import Results from './components/result'

function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Question/>}></Route>
      <Route path="/results" element={<Results/>}></Route>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
