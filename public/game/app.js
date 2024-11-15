const canvas = document.querySelector(".canvas");
const context = canvas.getContext("2d");
const moveSound = new Audio("./resources/TAK.wav"); //음질 개구림 대체할거 어디서찾니..
const errorSound = new Audio("./resources/error.mp3");
const tostmessage = document.getElementById("tost_message");
const resetButton = document.querySelector(".reset");
const undoButton = document.querySelector(".undo");
const resignButton = document.querySelector(".resign");

var socket = io(); 
var area4game;

resetButton.addEventListener("click", () => {
  socket.emit("reset");
})

undoButton.addEventListener("click", () => {
  if(area4game.mainBoard.length == 0) {
    return;
  }
  socket.emit("undo");
})

resignButton.addEventListener("click", () => {
  socket.emit("resign", area4game.playerColor);
})

socket.on("connected",(gameInfo) =>{
  tostmessage.innerHTML="당신은 "+gameInfo.color+" 입니다.";
  tostmessage.classList.add("active");
  setTimeout(() => { tostmessage.classList.remove("active");}, 1500);
  area4game = new area4();
  area4game.playerColor = gameInfo.color;
  area4game.mainBoard = gameInfo.history;
  area4game.drawboard(context);
})

socket.on("moveReceived",(moveHistory) => {
  area4game.mainBoard = moveHistory;
  area4game.drawboard(context);
})//수의 변경사항이 있으면, 서버에서 수 정보를 받아옴

socket.on("playerWin",(color) => {
  tostmessage.innerHTML = color.toUpperCase()+" 플레이어의 승리 입니다!";
  tostmessage.classList.add("active");
  setTimeout(() => { tostmessage.classList.remove("active");}, 1500);
  area4game.gameEndFlag = true;
  area4game.drawboard(context);
})

socket.on("playerDraw",() => {
  tostmessage.innerHTML="무승부입니다!";
  tostmessage.classList.add("active");
  setTimeout(() => { tostmessage.classList.remove("active");}, 1500);
  area4game.gameEndFlag = true;
  area4game.drawboard(context);
})

socket.on("resigned", (color) => {
  tostmessage.innerHTML = color.toUpperCase()+" 플레이어가 기권하였습니다.";
  tostmessage.classList.add("active");
  setTimeout(() => { tostmessage.classList.remove("active");}, 1500);
  area4game.gameEndFlag = true;
  area4game.drawboard(context);
})

socket.on("undid", (moveHistory) => {
  area4game.mainBoard = moveHistory;
  area4game.gameEndFlag = false;
  area4game.drawboard(context);
})

socket.on("resetted", (moveHistory) => {
  area4game.mainBoard = moveHistory;
  area4game.gameEndFlag = false;
  area4game.drawboard(context);
  tostmessage.innerHTML="리셋되었습니다.";
    tostmessage.classList.add("active");
    setTimeout(() => {
    tostmessage.classList.remove("active");}, 500);
})

canvas.addEventListener("click", (e) => {
  let { inputX, inputY } = area4game.getPosition(e.offsetX, e.offsetY);

  if (inputX < 0 || inputX > 8 || inputY < 0 || inputY > 8) {
    return;
  } //보드판 밖 클릭 시 무시

  if (area4game.gameEndFlag) {
    return;
  } //gameEndFlag가 true면 무시

  if (area4game.playerColor == "spectater"){
    return;
  } //관전자 일시 무시

  if(!area4game.checkTurn()){
    tostmessage.innerHTML="상대 플레이어의 차례 입니다.";
    tostmessage.classList.add("active");
    setTimeout(() => {
    tostmessage.classList.remove("active");}, 500);
    errorSound.play();
    return;
  } //자신의 턴이 아닐시 소리 재생및 토스트 메세지 활성화 후 무시

  if (area4game
    .getAllAvailableMove()
    .find((element) => element == inputX + 9 * inputY) === undefined) { // getAllAvailableMove 함수에서 지금 착수 한 곳의 index값을 찾을 수 없다면
    //착수 할 수 없는 곳 이므로 클릭시 무시
    errorSound.play();
    tostmessage.innerHTML="착수 불가한 위치 입니다.";
    tostmessage.classList.add("active");
    setTimeout(() => {
      tostmessage.classList.remove("active");}, 500);
    //토스트메세지 띄우고 0.5초후 사라지게함
    return;
  }

  let MoveInfo = area4game.putStone(inputX,inputY);
  moveSound.play();
  socket.emit("playerMove" , MoveInfo);
});