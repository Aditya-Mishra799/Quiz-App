import React from "react";
import Badge from "../components/Badge";
import Button from "../components/Button";
import SelectPanel from "../components/SelectPanel";
import styles from "./Home.module.css"

const Home = () => {
  return (
    <div className= {styles.home}>
      <Badge />
      <div className="desc">
        <h2>Welcome to the <span className={styles["bold"]}>Live Polling System</span></h2>
        <p>
          Please select the role that best describes you to begin using the live
          polling system
        </p>
      </div>
      <div className={styles.selection}>
        <SelectPanel
          label={"I’m a Student"}
          description={
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry"
          }
          link="/student"
        />
        <SelectPanel
          label={"I’m a Teacher"}
          description={
            "Submit answers and view live poll results in real-time."
          }
          link="/teacher"
        />
      </div>

      <Button>Continue</Button>
    </div>
  );
};

export default Home;
