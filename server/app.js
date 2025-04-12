import express from "express";
import http from "http";
import { Server } from "socket.io";
import { registerSocketHandlers } from "./socket/registerSocketHandlers.js";
import cors from "cors";
import { configDotenv } from "dotenv";
import { UserRoute } from "./routes/UserRoute.js";
import connectDB from "./config/db.js";

configDotenv();

const app = express();
app.use(cors("*"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello from SERVER!");
});
app.use("/user", UserRoute);

const server = http.createServer(app);
export  const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
connectDB();
io.on("connection", (socket) => {
  registerSocketHandlers(socket, io);
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
