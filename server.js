const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("a user connected, user id = " + socket.id);

  socket.on("putStone", (moveinfo) => {
    console.log(moveinfo);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected, user id = " + socket.id);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
