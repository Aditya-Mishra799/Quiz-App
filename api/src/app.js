import express from "express";
import http from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors"
dotenv.config();
const app = express();
app.use(cookieParser());

const students = new Map();
let currentQuestion = null;
let questionTimer = null;
const prevQuestions = [];

export const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND,
    credentials: true,
  },
});
app.use(cors({
  origin:process.env.FRONTEND,
}))
app.get("/poll-history", (req, res) => {
  return res.json(prevQuestions);
});
io.on("connection", (socket) => {
  socket.on("register", ({ uuid, name }) => {
    if (!uuid || !name) {
      socket.emit("registration-error", { message: "UUID and name required" });
      return;
    }
    students.set(uuid, { name, socketId: socket.id });
    console.log(`Student registered: ${name} (${uuid})`);
    socket.emit("registration-success", { uuid, name });
    if (currentQuestion) {
      socket.emit("new-question", currentQuestion);
    }
  });

  socket.on("ask-question", ({ question, options, duration }) => {
    if (currentQuestion) {
      socket.emit("question-error", {
        message: "Previous question still active",
      });
      return;
    }
    currentQuestion = {
      question,
      options: options.map((opt) => ({ ...opt, totalSelected: 0 })),
      duration,
      totalAnswered: 0,
      askedAt: Date.now(),
      id: prevQuestions.length,
    };
    //send to all
    io.emit("new-question", { ...currentQuestion });
    questionTimer = setTimeout(() => {
      io.emit("question-ended", currentQuestion);
      prevQuestions.push(currentQuestion);
      currentQuestion = null;
      questionTimer = null;
    }, duration * 1000);
  });

  socket.on("submit-answer", ({ uuid, optionIndex }) => {
    if (!currentQuestion) {
      socket.emit("submit-answer-error", {
        message: "Question Duration Expired :(",
      });
      return;
    }
    const student = students.get(uuid);
    if (!student) {
      socket.emit("submit-answer-error", {
        message: "Your are unregistered !!!",
      });
      return;
    }
    if (!currentQuestion.votedStudents)
      currentQuestion.votedStudents = new Set();
    if (currentQuestion.votedStudents.has(uuid)) {
      socket.emit("submit-answer-error", { message: "Already Voted !!!" });
      return;
    }
    currentQuestion.votedStudents.add(uuid);
    currentQuestion.totalAnswered += 1;
    if (currentQuestion.options[optionIndex]) {
      currentQuestion.options[optionIndex].totalSelected += 1;
    }
    socket.emit("submit-answer-success", { message: "Success", optionIndex });

    io.emit("poll-update", {
      totalAnswered: currentQuestion.totalAnswered,
      options: currentQuestion.options.map((opt) => ({
        totalSelected: opt.totalSelected,
      })),
    });
  });
  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });

  socket.on("chat-message", ({ uuid, message }) => {
    const student = students.get(uuid);
    if (!student) {
      socket.emit("chat-message-error", {
        message: "Your are unregistered !!!",
      });
      return;
    }
    socket.emit("chat-message-success", {
      message: message,
      user: student.name,
      id: Date.now(),
      self: true,
    });
    socket.broadcast.emit("new-chat", {
      message: message,
      user: student.name,
      id: Date.now(),
      self: false,
    });
  });
});
