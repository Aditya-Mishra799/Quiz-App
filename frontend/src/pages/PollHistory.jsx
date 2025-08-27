import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./PollHistory.module.css";
import Question from "../components/Question";
import ChatFAB from "../components/ChatFAB";
const PollHistory = () => {
  const [questions, setQuestions] = useState([]);
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_API}/poll-history`
        );
        setQuestions(res.data);
      } catch (error) {
        alert(error.message);
      }
    };
    fetchQuestions();
  }, []);
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1>
          View <span className={styles.bold}>Poll History</span>
        </h1>
        <div className={styles.questions}>
          {questions.length !== 0 ? (
            questions.map(({ question, options, totalAnswered, id }) => (
              <div className={styles.question} key = {id}>
                <h2 className={styles.questionTitle}>Question {id + 1}</h2>
                <Question
                  question={question}
                  options={options}
                  totalStudentsAnswered={totalAnswered}
                  showDistribution={true}
                  showCorrectAnswer={true}
                />
              </div>
            ))
          ) : (
            <h3>No Questions yet asked...</h3>
          )}
        </div>
      </div>
      <ChatFAB/>
    </div>
  );
};

export default PollHistory;
