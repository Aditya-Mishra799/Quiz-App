import React from "react";
import Badge from "../components/Badge";
import styles from "./BlockedPage.module.css";
const BlockedPage = () => {
  return (
    <div className={styles["page"]}>
      <Badge />
      <div className={styles["desc"]}>
        <h2>You’ve been Kicked out !</h2>
        <p>
          Looks like the teacher had removed you from the poll system .Please
          Try again sometime.
        </p>
      </div>
    </div>
  );
};

export default BlockedPage;
