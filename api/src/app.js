import express from "express";
import http from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(cookieParser());

const students = new Map();
let currentQuestion = null;
let questionTimer = null;
const prevQuestions = []
export const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Socked Registered ....", socket.id);
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
    console.log("New Question Asked...")
    //send to all
    io.emit("new-question", { ...currentQuestion });
    questionTimer = setTimeout(() => {
      io.emit("question-ended", currentQuestion);
      prevQuestions.push(currentQuestion)
      currentQuestion = null;
      questionTimer = null;
    }, duration * 1000);
  });
  socket.on("submit-answer", ({ uuid, optionIndex }) => {
    if (!currentQuestion) return;
    const student = students.get(uuid);
    if (!student) return;
    if (!currentQuestion.votedStudents)
      currentQuestion.votedStudents = new Set();
    if (currentQuestion.votedStudents.has(uuid)) return;
    console.log("New Answer Submitted...")
    currentQuestion.votedStudents.add(uuid);
    currentQuestion.totalAnswered += 1;
    if (currentQuestion.options[optionIndex]) {
      currentQuestion.options[optionIndex].totalSelected += 1;
    }
    io.emit("poll-update", {
      totalAnswered: currentQuestion.totalAnswered,
      options: currentQuestion.options.map((opt) => ({
        totalSelected: opt.totalSelected,
      })),
    });
  });
});
