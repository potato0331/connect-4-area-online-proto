const canvas = document.querySelector(".canvas");
const context = canvas.getContext("2d");
const moveSound = new Audio("./resources/TAK.wav"); //음질 개구림 대체할거 어디서찾니..
const errorSound = new Audio("./resources/error.mp3");
const tostmessage = document.getElementById("wrongmove_tost");
const tostmessage2 = document.getElementById("notthisturn_tost");
const tostmessage_playercolor = document.getElementById("playercolor_tost");

var socket = io(); 
var area4game;

socket.on("connected",(gameInfo) =>{
    tostmessage_playercolor.innerHTML="당신은 "+gameInfo.color+" 입니다";
    tostmessage_playercolor.classList.add("active");
    setTimeout(() => {
    tostmessage_playercolor.classList.remove("active");
}, 1500);
  area4game = new area4();
  area4game.playerColor = gameInfo.color;
  area4game.mainBoard = gameInfo.history;
  area4game.drawboard(context);
})

socket.on("moveReceived",(moveHistory) =>{
  area4game.mainBoard = moveHistory;
  area4game.drawboard(context);
})

canvas.addEventListener("click", (e) => {
  let { inputX, inputY } = area4game.getPosition(e.offsetX, e.offsetY);
  let MoveInfo = area4game.putStone(inputX,inputY);
  socket.emit("playerMove" , MoveInfo);
});