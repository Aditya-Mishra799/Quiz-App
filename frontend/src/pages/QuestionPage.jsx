import React, { useEffect, useState } from "react";
import Question from "../components/Question";
import Timer from "../components/Timer";
import ChatFAB from "../components/ChatFAB";
import styles from "./QuestionPage.module.css";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import socket from "../socket";

const sampleQuestion = {
  id: 1,
  text: "Which planet is known as the Red Planet?",
  options: [
    { id: 1, text: "Mars", totalSelected: 15 },
    { id: 2, text: "Venus", totalSelected: 1 },
    { id: 3, text: "Jupiter", totalSelected: 1 },
    { id: 4, text: "Saturn", totalSelected: 3 },
  ],
  correctAnswerId: 1,
  totalStudentsAnswered: 20,
};

const sampleParticipants = [
  { id: 1, name: "Rahul Arora" },
  { id: 2, name: "Pushpender Rautela" },
  { id: 3, name: "Rijul Zalpuri" },
  { id: 4, name: "Nadeem N" },
  { id: 5, name: "Ashwin Sharma" },
];

const sampleChats = [
  {
    id: 1,
    user: "User1",
    message: "Hey There , how can I help?",
    timestamp: new Date(),
  },
  {
    id: 2,
    user: "User2",
    message: "Nothing bro..just chill!!",
    timestamp: new Date(),
  },
];

function QuestionsPage() {
  const [currentQuestion, setCurrentQuestion] = useState(
    sessionStorage.getItem("currentQuestion")
      ? JSON.parse(sessionStorage.getItem("currentQuestion"))
      : null
  );
  const [selectedOption, setSelectedOption] = useState(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [questionState, setQuestionState] = useState("active");
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("new-question", (data) => {
      sessionStorage.setItem("currentQuestion", JSON.stringify(data));
      navigate("/live-poll");
    });
  }, []);

  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId);
  };

  const handleSubmit = () => {
    setQuestionState("submitted");
  };

  const handleTimerFinish = () => {
    console.log("Timer finished!");
    setQuestionState("results");
    setShowResults(true);
    setShowCorrectAnswer(true);
  };

  const toggleResults = () => {
    setShowResults(!showResults);
    setShowCorrectAnswer(!showCorrectAnswer);
    setQuestionState(showResults ? "active" : "results");
  };

  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.questionWithTimer}>
            <h1 className={styles.questionTitle}>
              Question {sampleQuestion.id}
            </h1>
            <Timer
              timeInSeconds={timeLeft}
              onFinish={handleTimerFinish}
              isActive={questionState === "active"}
            />
          </div>
        </div>

        <Question
          question={currentQuestion?.question}
          options={currentQuestion?.options}
          onOptionSelect={handleOptionSelect}
          selectedOption={selectedOption}
          totalStudentsAnswered={currentQuestion?.totalAnswered}
          showDistribution={false}
          questionState={questionState}
          onSubmit={handleSubmit}
        />

        {questionState === "results" && (
          <div className={styles.waitingMessage}>
            <p>Wait for the teacher to ask a new question..</p>
          </div>
        )}

        <div className={styles.controls}>
          <Button>Submit</Button>
        </div>
      </div>

      <ChatFAB participants={sampleParticipants} chats={sampleChats} />
    </div>
  );
}

export default QuestionsPage;
