import React, { useState, useEffect } from "react";
import styles from "./Timer.module.css";
import timerLogo from "../assets/Timer.svg"

const Timer = ({ timeInSeconds = 60 }) => {
  const [time, setTime] = useState(timeInSeconds);

  useEffect(() => {
    setTime(timeInSeconds);
  }, [timeInSeconds]);

  useEffect(() => {
    if (time <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          onFinish && onFinish();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [time]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const isTimeRunningOut = time <= 15;

  return (
    <div
      className={`${styles.timer} ${
        isTimeRunningOut ? styles.timeRunningOut : ""
      }`}
    >
      <div className={styles.timerIcon}>
        <img src={timerLogo} alt="timer" />
      </div>
      <span className={styles.timeText}>{formatTime(time)}</span>
    </div>
  );
};

export default Timer;
