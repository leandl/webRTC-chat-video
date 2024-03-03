import dotenv from "dotenv";

import http from "http";
import express from "express";
import cors from "cors";
import Socket from "socket.io";
import { roomHandler } from "./room";

dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT;
// const SERVER_HOST = process.env.SERVER_HOST;

const app = express();
app.use(cors);

const server = http.createServer(app);
const io = new Socket.Server(server, {
  cors: {
    origin: "*",
    methods: ["POST", "GET"],
  },
});

io.on("connection", (socket) => {
  console.log("user is connected");

  roomHandler(socket);

  socket.on("disconnect", () => {
    console.log("user is disconnected");
  });
});

server.listen(SERVER_PORT, () => {
  console.log(`Listening to the port ${SERVER_PORT}`);
});
