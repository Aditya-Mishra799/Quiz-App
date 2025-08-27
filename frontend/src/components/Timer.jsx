import React, { useState, useEffect } from "react";
import styles from "./Timer.module.css";
import timerLogo from "../assets/Timer.svg";

const Timer = ({ startedAt, duration }) => {
  const calcRemTime = (startedAt, duration) => {
    if (
      startedAt === undefined ||
      startedAt === null ||
      duration === undefined ||
      duration === null
    ) {
      return 0;
    }
    const elapsed = Math.floor((Date.now() - startedAt) / 1000);
    const rem = duration - elapsed;
    return Math.max(rem, 0);
  };
  const [time, setTime] = useState(calcRemTime(startedAt, duration));

  useEffect(() => {
    setTime(calcRemTime(startedAt, duration));

    const timer = setInterval(() => {
      const remaining = calcRemTime(startedAt, duration);
      setTime(remaining);
      if (remaining <= 0) {
        clearInterval(timer); 
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startedAt, duration]);

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
