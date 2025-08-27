import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Badge from "../components/Badge";
import Button from "../components/Button";
import Input from "../components/Input";
import styles from "./StudentPage.module.css";
import { v4 as uuidv4 } from "uuid";
import socket from "../socket";
const StudentPage = () => {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedStudent = sessionStorage.getItem("student");
    if (storedStudent) {
      const { name } = JSON.parse(storedStudent);
      setName(name);
      navigate("/questions");
    }
  }, [navigate]);


  const handleRegister = () => {
    if (!name.trim()) return alert("Please enter your name");
    let storedStudent = sessionStorage.getItem("student");
    if (!storedStudent) {
      setIsLoading(true); 
      const uuid = uuidv4();
      storedStudent = { uuid, name };
      sessionStorage.setItem("student", JSON.stringify(storedStudent));
      socket.emit("register", storedStudent);

      socket.once("registration-success", () => {
        navigate("/questions");
        setIsLoading(false); 
      });
      socket.once("registration-error", ({message})=>{
        alert(message);
        sessionStorage.removeItem("student")
        setIsLoading(false); 
      })
    }else {
      navigate("/questions");
    }
  };
  return (
    <div className={styles["page"]}>
      <Badge />
      <div className={styles["desc"]}>
        <h2>
          Let’s <span className={styles["bold"]}>Get Started</span>
        </h2>
        <p>
          If you’re a student, you’ll be able to{" "}
          <span className={styles["bold"]}>submit your answers</span>,
          participate in live polls, and see how your responses compare with
          your classmates
        </p>
      </div>
      <div className={styles["input"]}>
        <label htmlFor="name">Enter Your Name</label>
        <Input
          placeholder=""
          value={name}
          onChange={(value) => setName(value)}
          id="name"
        />
      </div>
      <Button onClick={handleRegister} disabled={isLoading}>
        {isLoading ? "Registering..." : "Continue"}
      </Button>
    </div>
  );
};

export default StudentPage;
