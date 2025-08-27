import React, { useEffect, useState } from "react";
import Question from "../components/Question";
import Timer from "../components/Timer";
import ChatFAB from "../components/ChatFAB";
import styles from "./QuestionPage.module.css";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
function TeacherLivePollPage() {
  const [currentQuestion, setCurrentQuestion] = useState(
    sessionStorage.getItem("currentQuestion")
      ? JSON.parse(sessionStorage.getItem("currentQuestion"))
      : null
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentQuestion) {
      navigate("/teachers");
    }
    console.log(currentQuestion);
    socket.on("poll-update", ({ totalAnswered, options }) => {
      console.log("Updated");
      setCurrentQuestion((prev) => {
        const newSate = { ...prev };
        newSate.totalAnswered = totalAnswered;
        newSate.options = prev.options.map((op, idx) => ({
          ...op,
          totalSelected: options[idx].totalSelected,
        }));
        sessionStorage.setItem(
          "currentQuestion",
          JSON.stringify(currentQuestion)
        );
        return newSate;
      });
    });
  }, []);

  let timeLeft =
    currentQuestion?.duration -
    Math.floor((Date.now() - currentQuestion?.askedAt) / 1000);
  timeLeft = timeLeft < 0 ? 0 : timeLeft;
  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.questionWithTimer}>
            <h1 className={styles.questionTitle}>
              Question {currentQuestion?.id || 1}
            </h1>
            <Timer
              timeInSeconds={timeLeft || 0}
              // isActive={true}
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
          <Button>+ Ask new a Question</Button>
        </div>
      </div>
    </div>
  );
}

export default TeacherLivePollPage;
