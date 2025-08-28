import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import StudentPage from "./pages/StudentPage";
import TeacherPage from "./pages/TeacherPage";
import QuestionsPage from "./pages/QuestionPage";
import TeacherLivePollPage from "./pages/TeacherLivePollPage";
import PollHistory from "./pages/PollHistory";
import { useEffect, useState } from "react";
import socket from "./socket";
import { useNavigate } from "react-router-dom";
import BlockedPage from "./pages/BlockedPage";
function App() {
  const [blocked, setBlocked] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const storedBlocked = sessionStorage.getItem("blocked");
    if (storedBlocked) {
      if (storedBlocked === "true") {
        setBlocked(true);
      }
    }

    const blockStudent = ({ uuid }) => {
      const student = sessionStorage.getItem("student");
      if (student) {
        const { uuid: storedUuid } = JSON.parse(student);
        if (storedUuid === uuid) {
          sessionStorage.setItem("blocked", "true");
          setBlocked(true);
        }
      }
    };
    socket.on("block-student", blockStudent);
    return () => socket.off("block-student", blockStudent);
  }, []);

  useEffect(() => {
    if (blocked) {
      navigate("/blocked");
    }
  }, [blocked]);
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/student" element={<StudentPage />} />
        <Route path="/teacher" element={<TeacherPage />} />
        <Route path="/questions" element={<QuestionsPage />} />
        <Route path="/live-poll" element={<TeacherLivePollPage />} />
        <Route path="/poll-history" element={<PollHistory />} />
        <Route path="/blocked" element={<BlockedPage />} />
      </Routes>
    </>
  );
}

export default App;
