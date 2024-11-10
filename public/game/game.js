class area4 {
    VACANT = " ";
    BLACK = "black";
    WHITE = "white"; //가이드에서 하래서 했는데 그래서 이거 ㅅㅂ 왜하는거임 상수선언의 의의란 뭘가...
    blockinterval = 68;
    sideMargin = 18; //"왼쪽으로 1픽셀만 옮겨주세요!"가 왜 죽일놈인지 알거같기도 합니다
    gameEndFlag = false;
  
    mainBoard = new Array();
    playerColor;
  
    firstrestrict = 5;

    getPosition(offsetX, offsetY) {
      return {
        inputX: Math.floor((offsetX - this.sideMargin) / this.blockinterval),
        inputY: Math.floor((offsetY - this.sideMargin) / this.blockinterval),
      };
    } //클릭된 위치의 좌표값을 기반으로 칸의 위치를 구함
  
    getBoardPosition(inputX, inputY) {
      return {
        boardX:
          inputX * this.blockinterval + this.blockinterval / 2 + this.sideMargin,
        boardY:
          inputY * this.blockinterval + this.blockinterval / 2 + this.sideMargin,
      };
    } //칸의 위치값을 기반으로 그 칸의 중심점의 좌표값을 구함
  
    putStone(inputX, inputY) {
      let MoveInfo = Object.create(null);
      MoveInfo.x = inputX;
      MoveInfo.y = inputY;
      MoveInfo.color = this.playerColor;
      return MoveInfo;
      //그 수의 정보를 mainBoard에 입력
    }

    drawStone(ctx, MoveInfo) {
      let { boardX, boardY } = this.getBoardPosition(MoveInfo.x, MoveInfo.y);
      //돌 위치 계산
      ctx.beginPath(); //새 선 그릴 준비
      ctx.strokeStyle = "darkgrey";
      ctx.lineWidth = 2;
      ctx.arc(boardX, boardY, 30, 0, 2 * Math.PI); //경로지정
      ctx.stroke(); // 선 그리기
      ctx.beginPath();
      ctx.fillStyle = MoveInfo.color; // 돌 색깔 지정
      ctx.arc(boardX, boardY, 30, 0, 2 * Math.PI);
      ctx.fill(); // 색 채우기
    }
  
    drawboard(ctx) {
      ctx.clearRect(0, 0, 648, 648); //보드영역 지우기
      ctx.lineWidth = 1;
      ctx.strokeStyle = "black";
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          //정사각형그리기
          ctx.strokeRect(
            i * this.blockinterval + this.sideMargin,
            j * this.blockinterval + this.sideMargin,
            this.blockinterval,
            this.blockinterval
          );
        }
      }
  
      ctx.lineWidth = 3;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          //큰정사각형그리기
          ctx.strokeRect(
            3 * i * this.blockinterval + this.sideMargin,
            3 * j * this.blockinterval + this.sideMargin,
            3 * this.blockinterval,
            3 * this.blockinterval
          );
        }
      }
  
      if (this.firstrestrict != -1) {
        //선공 제한 구역이 설정되어 있다면 첫수 금지선 그리기
        let startpoint = 4 - (this.firstrestrict - 1) / 2;
        //첫수 금지선의 좌상단 좌표 구함 7->1 5->2 3->3
        ctx.lineWidth = 2;
        ctx.strokeStyle = "red";
        ctx.strokeRect(
          startpoint * this.blockinterval + this.sideMargin,
          startpoint * this.blockinterval + this.sideMargin,
          this.firstrestrict * this.blockinterval,
          this.firstrestrict * this.blockinterval
        );
      }

      if (this.playerColor != "spectater"){
        ctx.beginPath(); //새 선 그릴 준비
        ctx.fillStyle = this.playerColor;
        ctx.arc(648 - 9 , 9 , 5, 0, 2 * Math.PI);
        ctx.fill(); 
        ctx.beginPath(); 
        ctx.arc(9 , 9 , 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath(); 
        ctx.arc(648 - 9 , 648 - 9 , 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath(); 
        ctx.arc(9 , 648 - 9 , 5, 0, 2 * Math.PI);
        ctx.fill(); // 색 채우기
      } //구석에 플레이어 색상 표시
      /** 여기까지 보드판 영역**/
  
      for (let MoveInfo of this.mainBoard) {
        this.drawStone(ctx, MoveInfo);
      }
      // 바둑알 그리기
  
    }
  }