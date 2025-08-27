import React, { useEffect, useMemo, useState } from "react";
import Question from "../components/Question";
import Timer from "../components/Timer";
import ChatFAB from "../components/ChatFAB";
import styles from "./QuestionPage.module.css";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import {
  calcRemTime,
  clearQuestionActive,
  isQuestionActive,
  removeIfExpired,
} from "../utils/questionMarker";
function TeacherLivePollPage() {
  const [currentQuestion, setCurrentQuestion] = useState(
    sessionStorage.getItem("currentQuestion")
      ? JSON.parse(sessionStorage.getItem("currentQuestion"))
      : null
  );
  const navigate = useNavigate();
  const [durationActive, setDurationActive] = useState(true);

  useEffect(() => {
    const remTime = calcRemTime(
      currentQuestion?.askedAt,
      currentQuestion.duration
    );
    const timer = setTimeout(() => {
      clearQuestionActive();
      setDurationActive(false);
    }, remTime * 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!currentQuestion) {
      navigate("/teacher");
    }
    socket.on("poll-update", ({ totalAnswered, options }) => {
      setCurrentQuestion((prev) => {
        const newSate = { ...prev };
        newSate.totalAnswered = totalAnswered;
        newSate.options = prev.options.map((op, idx) => ({
          ...op,
          totalSelected: options[idx].totalSelected,
        }));
        sessionStorage.setItem("currentQuestion", JSON.stringify(newSate));
        return newSate;
      });
    });

    socket.on("question-ended", () => {
      clearQuestionActive();
      setDurationActive(false);
    });
  }, []);

  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.questionWithTimer}>
            <h1 className={styles.questionTitle}>
              Question {currentQuestion?.id || 1}
            </h1>
            <Timer
              startedAt={currentQuestion?.askedAt}
              duration={currentQuestion?.duration}
            />
          </div>
        </div>

        <Question
          question={currentQuestion.question}
          options={currentQuestion.options}
          totalStudentsAnswered={currentQuestion.totalAnswered}
          showDistribution={true}
          showCorrectAnswer={true}
        />

        <div className={styles.controls}>
          <Button
            disabled={durationActive}
            onClick={() => navigate("/teacher")}
          >
            + Ask new a Question
          </Button>
        </div>
      </div>
      <ChatFAB />
    </div>
  );
}

export default TeacherLivePollPage;
