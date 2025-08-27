import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from "./pages/Home"
import StudentPage from "./pages/StudentPage"
import TeacherPage from "./pages/TeacherPage"
import QuestionsPage from './pages/QuestionPage'
import TeacherLivePollPage from './pages/TeacherLivePollPage'
function App() {
  return (
    <>
     <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/student" element={<StudentPage />} />
        <Route path="/teacher" element={<TeacherPage />} />
        <Route path="/questions" element={<QuestionsPage />} />
        <Route path="/live-poll" element={<TeacherLivePollPage />} />
      </Routes> 
    </>
  )
}

export default App
