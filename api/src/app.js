import express from "express";
import http from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
const app = express();
app.use(cookieParser());

const students = new Map();
let currentQuestion = null;
let questionTimer = null;
const prevQuestions = [];
const blockedStudents = new Map();

export const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND,
    credentials: true,
  },
});
app.use(
  cors({
    origin: process.env.FRONTEND,
  })
);
app.get("/poll-history", (req, res) => {
  return res.json(prevQuestions);
});
io.on("connection", (socket) => {
  socket.on("register", ({ uuid, name }) => {
    if (!uuid || !name) {
      socket.emit("registration-error", { message: "UUID and name required" });
      return;
    }
    if (blockedStudents.has(uuid)) {
      socket.emit("block-student", { uuid });
    }
    students.set(uuid, { name, socketId: socket.id });
    console.log(`Student registered: ${name} (${uuid})`);
    socket.emit("registration-success", { uuid, name });

    // new user broadcast
    emitAllStudents(students, io);

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
    if (blockedStudents.has(uuid)) {
      socket.emit("block-student", { uuid });
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

  socket.on("chat-message", ({ uuid, message, isTeacher }) => {
    const student = students.get(uuid);
    if (!student && !isTeacher) {
      socket.emit("chat-message-error", {
        message: "Your are unregistered !!!",
      });
      return;
    }
    socket.emit("chat-message-success", {
      message: message,
      user: isTeacher ? "Teacher" : student.name,
      id: Date.now(),
      self: true,
      teacher: isTeacher,
    });
    socket.broadcast.emit("new-chat", {
      message: message,
      user: isTeacher ? "Teacher" : student.name,
      id: Date.now(),
      self: false,
      teacher: isTeacher,
    });
  });
  socket.on("get-all-students", () => {
    socket.emit(
      "all-students",
      Array.from(students.entries()).map(([uuid, { name }]) => ({
        uuid,
        name,
      }))
    );
  });

  socket.on("kick-student", ({ uuid }) => {
    const student = students.get(uuid);
    if (!student) return;
    blockedStudents.set(uuid, student);
    students.delete(uuid);
    emitAllStudents(students, io);
    io.emit("block-student", { uuid });
  });
});

function emitAllStudents(students, socketOrIO) {
  socketOrIO.emit(
    "all-students",
    Array.from(students.entries()).map(([uuid, { name }]) => ({ uuid, name }))
  );
}
