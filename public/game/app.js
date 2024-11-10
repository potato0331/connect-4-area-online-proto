const canvas = document.querySelector(".canvas");
const context = canvas.getContext("2d");
const moveSound = new Audio("./resources/TAK.wav"); //음질 개구림 대체할거 어디서찾니..
const errorSound = new Audio("./resources/error.mp3");
const tostmessage = document.getElementById("wrongmove_tost");
const tostmessage_wrongturn = document.getElementById("notthisturn_tost");
const tostmessage_playercolor = document.getElementById("playercolor_tost");

var socket = io(); 
var area4game;

socket.on("connected",(gameInfo) =>{
    tostmessage_playercolor.innerHTML="당신은 "+gameInfo.color+" 입니다";
    tostmessage_playercolor.classList.add("active");
    setTimeout(() => { tostmessage_playercolor.classList.remove("active");}, 1500);
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
  if (inputX < 0 || inputX > 8 || inputY < 0 || inputY > 8) {
    return;
  } //보드판 밖 클릭 시 무시
  if (area4game.playerColor == "spectater"){
    return;
  } //관전자 일시 무시
  if ((area4game.mainBoard.length != 0 && area4game.mainBoard[area4game.mainBoard.length - 1].color == area4game.playerColor) ||
     (area4game.mainBoard.length == 0 && area4game.playerColor == "white")){
    tostmessage_wrongturn.classList.add("active");
    setTimeout(() => {
    tostmessage_wrongturn.classList.remove("active");}, 500);
    return;
  } // 만일 이전 턴의 색이 나의 색과 같거나(연속으로 착수를 두번하거나), 첫 턴이고 백인데 착수하려 하면 토스트메세지를 띄우고 무시

  let MoveInfo = area4game.putStone(inputX,inputY);
  socket.emit("playerMove" , MoveInfo);
});