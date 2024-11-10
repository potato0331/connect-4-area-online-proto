const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
app.use(express.static("public"));

let playerColor;
var boardArray = Array.from(Array(9), () => new Array(9).fill(" "));
var moveHistory = new Array();
var playerList = {
  black : 0, 
  white : 0,
  spectater : new Array()
};

function gameReset(){
  boardArray = Array.from(Array(9), () => new Array(9).fill(" "));
  moveHistory = new Array();
} // boardArray와 moveHistory 초기화

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {

  if (playerList.black == 0){
    playerList.black = socket.id;
    playerColor = "black";
  } 
  else if (playerList.white == 0){
    playerList.white = socket.id;
    playerColor = "white";
  } 
  else {
    playerList.spectater.push(socket.id)
    playerColor = "spectater"
  } // 빈칸에 플레이어 추가, 다만 빈칸이 없다면 spectater배열에 id추가

  socket.emit("connected" , {color : playerColor, history : moveHistory});
    //접속시 connected이벤트로 플레이어의 색상과 현재 수 현황 넘김
  
  console.log("a user connected, "+playerColor+", user id = " + socket.id);
  console.log(playerList);

  socket.on("disconnect", () => {
    console.log("user disconnected, user id = " + socket.id);
    
    if (socket.id == playerList.black){
      playerList.black = 0;
    } 
    else if (socket.id == playerList.white){
      playerList.white = 0;
    } 
    else {
      playerList.spectater.splice(playerList.spectater.indexOf(socket.id), 1);
    } // 플레이어 id찾아서 제거, 없으면 spectater에서 찾아서 제거

    console.log(playerList);

    if (playerList.black == 0 && playerList.white == 0){
      gameReset()
      console.log("resetting game...")
      io.emit("moveReceived",moveHistory);
    } // 플레이어가 아무도 없을 시 리셋
  });

  socket.on("playerMove" , (MoveInfo) =>{
    moveHistory.push(MoveInfo);
    boardArray[MoveInfo.y][MoveInfo.x] = MoveInfo.color;
    io.emit("moveReceived",moveHistory);
  });
  //moveinfo를 movehistory에 저장하고, movehistory를 모든 플레이어에게 전송

});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
