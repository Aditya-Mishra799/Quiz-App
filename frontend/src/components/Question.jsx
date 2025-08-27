import React from "react";
import styles from "./Question.module.css";

const Question = ({
  question,
  options = [],
  onOptionSelect,
  selectedOption,
  totalStudentsAnswered = 0,
  showDistribution = false,
  showCorrectAnswer = false,
  correctAnswerId = null,
  questionState = "active",
  onSubmit,
}) => {
  const calculatePercentage = (totalSelected) => {
    if (totalStudentsAnswered === 0) return 0;
    return Math.round((totalSelected / totalStudentsAnswered) * 100);
  };
  return (
    <div className={styles.questionContainer}>
      <div className={styles.questionHeader}>{question}</div>

      <div className={styles.optionsContainer}>
        {options.map((option, index) => (
          <div
            key={option.value + Math.random()}
            className={`${styles.option} ${
              selectedOption ? styles.selectedOption : ""
            } ${showDistribution ? styles.filled : ""}`}
            onClick={() =>
              questionState === "active" && onOptionSelect(option.id)
            }
          >
            {showDistribution && (
              <div
                className={styles.fill}
                style={{
                  width: `${calculatePercentage(option.totalSelected || 0)}%`,
                }}
              ></div>
            )}
            <div className={styles.optionContent}>
              <div className={styles.optionNumber}>{index + 1}</div>
              <span className={styles.optionText}>{option.value}</span>
              {showDistribution && (
                <span className={styles.percentage}>
                  {calculatePercentage(option.totalSelected)}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Question;
