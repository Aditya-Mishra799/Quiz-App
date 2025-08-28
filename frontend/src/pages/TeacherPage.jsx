import React, { useEffect, useState } from "react";
import Badge from "../components/Badge";
import Select from "../components/Select";
import TextArea from "../components/TextArea";
import Input from "../components/Input";
import Button from "../components/Button";
import OutlineButton from "../components/OutlineButton";
import styles from "./TeacherPage.module.css";
import YesNoToggle from "../components/YesNoToggle";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import { isQuestionActive, setQuestionActive } from "../utils/questionMarker";
const timerOptions = [
  { label: "60 seconds", value: 60 },
  { label: "2 mins", value: 120 },
  { label: "5 mins", value: 300 },
  { label: "10 mins", value: 600 },
];
const TeacherPage = () => {
  const [options, setOptions] = useState([
    { value: "", correct: false, id: Date.now() + Math.random() },
    { value: "", correct: false, id: Date.now() + Math.random() },
  ]);
  const [question, setQuestion] = useState("");
  const [duration, setDuration] = useState(60);
  const navigate = useNavigate();
  const addOption = () => {
    setOptions((prev) => [
      ...prev,
      { value: "", correct: false, id: Date.now() + Math.random() },
    ]);
  };
  const onChangeOptions = (idx, value) => {
    setOptions((prev) => {
      const newOptions = prev.map((option) => ({ ...option }));
      newOptions[idx].value = value;
      return newOptions;
    });
  };
  const onToggleOptions = (idx, correct) => {
    setOptions((prev) => {
      const newOptions = prev.map((option) => ({ ...option }));
      newOptions[idx].correct = correct;
      return newOptions;
    });
  };
  const handleAskQuestion = () => {
    if (!question.trim() || options.length === 0)
      return alert("Enter question and options");
    socket.emit("ask-question", {
      question,
      options: options.map(({ value, correct }) => ({ value, correct })),
      duration,
    });
  };
  useEffect(() => {
    if (isQuestionActive()) {
      navigate("/live-poll");
    }
    socket.on("new-question", (data) => {
      sessionStorage.setItem("currentQuestion", JSON.stringify(data));
      setQuestionActive();
      navigate("/live-poll");
      sessionStorage.setItem("currentQuestion", JSON.stringify(data));
    });
  }, []);
  return (
    <div>
      <div className={styles.page}>
        <Badge />
        <div className={styles["desc"]}>
          <h2>
            Let’s <strong>Get Started</strong>
          </h2>
          <p>
            you’ll have the ability to create and manage polls, ask questions,
            and monitor your students' responses in real-time.
          </p>
        </div>
        <div className={styles["question-cnt"]}>
          <div className={styles["question-box"]}>
            <div className={styles["timer"]}>
              <h3>Enter your question</h3>
              <Select
                options={timerOptions}
                value={duration}
                onChange={(val) => setDuration(val)}
              />
            </div>
            <TextArea
              value={question}
              onChange={(value) => setQuestion(value)}
              placeholder="Enter Question"
            />
          </div>
          <div className={styles["options-cnt"]}>
            <div className={styles["edit-label"]}>
              <h3>Edit Options</h3>
              <h3>Is it Correct?</h3>
            </div>
            <div className={styles["options"]}>
              {options.map(({ value, correct, id }, idx) => (
                <div className={styles["option"]} key={id}>
                  <div className={styles["input"]}>
                    <span className={styles["list-idx"]}>{idx + 1}</span>
                    <Input
                      value={value}
                      onChange={(e) => onChangeOptions(idx, e)}
                      placeholder="Enter Option"
                    />
                  </div>
                  <YesNoToggle
                    value={correct}
                    onChange={(correct) => onToggleOptions(idx, correct)}
                  />
                </div>
              ))}
            </div>
            <div className={styles["outline-btn"]}>
              <OutlineButton onClick={addOption}>
                <span>+</span> Add More option
              </OutlineButton>
            </div>
          </div>
        </div>
      </div>
      <div className={styles["end"]}>
        <Button onClick={handleAskQuestion}>Ask Question</Button>
      </div>
    </div>
  );
};

export default TeacherPage;
