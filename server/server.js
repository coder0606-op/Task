import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/authRoutes.js";
import boardRoutes from "./routes/boardRoutes.js";
import listRoutes from "./routes/listRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/tasks", taskRoutes);

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("MongoDB connected");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("join-board", (boardId) => {
    socket.join(boardId);
  });

 
  socket.on("task-update", (data) => {
    io.to(data.boardId).emit("task-updated", data);
  });

  
  socket.on("list-update", (data) => {
    io.to(data.boardId).emit("list-updated", data);
  });
});



server.listen(5000, () => {
  console.log("Server running on port 5000");
});
