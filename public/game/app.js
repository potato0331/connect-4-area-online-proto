const canvas = document.querySelector(".canvas");
const context = canvas.getContext("2d");
const moveSound = new Audio("./resources/TAK.wav"); //음질 개구림 대체할거 어디서찾니..
const errorSound = new Audio("./resources/error.mp3");
const tostmessage = document.getElementById("wrongmove_tost");
const tostmessage2 = document.getElementById("notthisturn_tost");

let firstrestrict = 5;

let area4game = new area4(firstrestrict);
area4game.drawboard(context);

canvas.addEventListener("click", (e) => {
  if (area4game.gameEndFlag) {
    return;
  }

  let { inputX, inputY } = area4game.getPosition(e.offsetX, e.offsetY);

  if (inputX < 0 || inputX > 8 || inputY < 0 || inputY > 8) {
    return;
  } //보드판 밖 클릭 시 무시

  if (
    // getAllAvailableMove 함수에서 지금 착수 한 곳의 index값을 찾을 수 없다면
    area4game
      .getAllAvailableMove()
      .find((element) => element == inputX + 9 * inputY) === undefined
  ) {
    //착수 할 수 없는 곳 이므로 클릭시 무시
    errorSound.play();
    tostmessage.classList.add("active");
    setTimeout(() => {
      tostmessage.classList.remove("active");
    }, 500);
    //토스트메세지 띄우고 0.5초후 사라지게함
    return;
  }

  area4game.putStone(inputX, inputY); //수 정보 입력
  moveSound.play(); //탁...탁...탁...

  socket.emit("putStone", area4game.mainBoard[area4game.mainBoard.length - 1]); //moveinfo값을 서버에 전송

  area4game.drawboard(context);

  if (area4game.checkWin(inputX, inputY)) {
    //게임 종료여부 확인
    //setTimeout이 비동기 함수이기 때문에, alert가 drawboard의 작용을 막지 않는다. 지리네
    area4game.gameEndFlag = true;
    area4game.drawboard(context);
    setTimeout(() => {
      if (area4game.getNextcolor() == "white") {
        alert("BLACK WIN!");
      } else {
        alert("WHITE WIN!");
      }
    });
  }

  if (area4game.mainBoard.length == 81) {
    //두어진게 81번째 수라면 게임 종료
    area4game.gameEndFlag = true;
    area4game.drawboard(context);
    setTimeout(() => {
      alert("DRAW!");
    });
  }
});
