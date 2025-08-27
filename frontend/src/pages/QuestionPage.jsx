import React, { useCallback, useEffect, useMemo, useState } from "react";
import Question from "../components/Question";
import Timer from "../components/Timer";
import ChatFAB from "../components/ChatFAB";
import styles from "./QuestionPage.module.css";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import WaitPage from "./WaitPage";
import { calcRemTime } from "../utils/questionMarker";

function QuestionsPage() {
  const [currentQuestion, setCurrentQuestion] = useState(
    sessionStorage.getItem("currentQuestion")
      ? JSON.parse(sessionStorage.getItem("currentQuestion"))
      : null
  );
  const [selectedOption, setSelectedOption] = useState(null);
  const [showDistribution, setShowDistribution] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const storeSelectedOption = useCallback((val) => {
    sessionStorage.setItem("selected-index", String(val));
  }, []);

  useEffect(() => {
    if (!currentQuestion) return;
    const remTime = calcRemTime(
      currentQuestion?.askedAt,
      currentQuestion?.duration
    );
    const timer = setTimeout(() => {
      setShowDistribution(true);
    }, remTime * 1000);
    return () => clearTimeout(timer);
  }, [currentQuestion]);

  useEffect(() => {
    const storedOption = sessionStorage.getItem("selected-index");
    if (storedOption && !isNaN(parseInt(storedOption))) {
      setSelectedOption(parseInt(storedOption));
      setShowDistribution(true);
    }
    socket.on("new-question", (data) => {
      sessionStorage.setItem("currentQuestion", JSON.stringify(data));
      storeSelectedOption(null);
      setSelectedOption(null);
      setCurrentQuestion(data);
      setShowDistribution(false);
    });

    socket.on("submit-answer-success", ({ message, optionIndex }) => {
      setLoading(false);
      setShowDistribution(true);
      storeSelectedOption(optionIndex);
    });

    socket.on("submit-answer-error", ({ message }) => {
      setLoading(false);
      alert(message);
    });

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
    const student = sessionStorage.getItem("student");
    if (!student) {
      navigate("/student");
    }
  }, []);

  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId);
  };

  const handleSubmit = () => {
    setLoading(true);
    const student = sessionStorage.getItem("student") || null;
    const uuid = student ? JSON.parse(student)?.uuid : null;
    socket.emit("submit-answer", { uuid, optionIndex: selectedOption });
  };

  return currentQuestion ? (
    <div className={styles.app}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.questionWithTimer}>
            <h1 className={styles.questionTitle}>
              Question {currentQuestion.id}
            </h1>
            <Timer
              startedAt={currentQuestion?.askedAt}
              duration={currentQuestion?.duration}
            />
          </div>
        </div>

        <Question
          question={currentQuestion?.question}
          options={currentQuestion?.options}
          onOptionSelect={handleOptionSelect}
          selectedOption={selectedOption}
          totalStudentsAnswered={currentQuestion?.totalAnswered}
          showDistribution={showDistribution}
          onSubmit={handleSubmit}
        />

        {showDistribution && (
          <div className={styles.waitingMessage}>
            <p>Wait for the teacher to ask a new question..</p>
          </div>
        )}

        <div className={styles.controls}>
          {!showDistribution && (
            <Button
              onClick={handleSubmit}
              disabled={loading || showDistribution}
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          )}
        </div>
      </div>

      <ChatFAB />
    </div>
  ) : (
    <WaitPage />
  );
}

export default QuestionsPage;
