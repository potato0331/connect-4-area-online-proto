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
      //moveInfo 객체를 생성
    }

    checkTurn(){
      if (this.mainBoard.length != 0 && this.mainBoard[this.mainBoard.length - 1].color == this.playerColor){
        return false;
      }//첫 턴이 아니고, 이전턴의 색이 내 색과 같으면 false반환
      if (this.mainBoard.length == 0 && this.playerColor == "white"){
        return false;
      }//첫 턴이고, 백(후수)이면 false반환
      return true;
    }//자기 차례이면 true반환

    checkArea(MoveInfo) {
      return { AreaX: MoveInfo.x % 3, AreaY: MoveInfo.y % 3 };
    } //두어진 수의 영역 확인하기

    getAllAvailableMove() {
      //각각의 칸을 0~80의 숫자로 표현
      //인덱스->좌표 변환식은 x=index % 9 y=Math.floor(index / 9)
      //좌표->인덱스 변환식은 x+9*y
      let AvailableMoveList = new Array();
      if (this.mainBoard.length == 0) {
        //첫 수일경우
        let restrictDistancefromCenter = (this.firstrestrict + 1) / 2;
        let upperbound = 4 + restrictDistancefromCenter;
        let lowerbound = 4 - restrictDistancefromCenter;
        for (let i = 0; i < 81; i++) {
          if (
            !(
              i % 9 > lowerbound &&
              i % 9 < upperbound &&
              Math.floor(i / 9) > lowerbound &&
              Math.floor(i / 9) < upperbound
            )
          ) {
            AvailableMoveList.push(i);
          }
        }
      } else {
        // 첫 수가 아닐경우
        let { AreaX, AreaY } = this.checkArea(
          this.mainBoard[this.mainBoard.length - 1]
        );
        let NWsquare = 3 * AreaX + 27 * AreaY;
        let AvailableArea = [NWsquare, NWsquare + 1, NWsquare + 2,
                            NWsquare + 9, NWsquare + 10, NWsquare + 11,
                            NWsquare + 18, NWsquare + 19, NWsquare + 20,];
        // 착수 가능한 영역 안 칸들의 인덱스 리스트
        for (let i of AvailableArea) {
          let occupied = this.mainBoard.find(
            (point) => point.x == i % 9 && point.y == Math.floor(i / 9)
          );
          if (occupied === undefined) {
            AvailableMoveList.push(i);
          }
        }
      }
  
      if (AvailableMoveList.length == 0) {
        //만약 영역이 가득차 착수가 불가능 하다면, 겹치는 칸을 제외하고 전부 착수가능
        for (let i = 0; i < 81; i++) {
          let occupied = this.mainBoard.find(
            (point) => point.x == i % 9 && point.y == Math.floor(i / 9)
          );
          if (occupied === undefined) {
            AvailableMoveList.push(i);
          }
        }
      }
      return AvailableMoveList;
    }
  
    drawAvailableMove(ctx, MoveList) {
      for (let i of MoveList) {
        //i는 getAllAvailableMove함수의 결과값인 인덱스 값의 집합
        let { boardX, boardY } = this.getBoardPosition(i % 9, Math.floor(i / 9));
        boardX -= 29;
        boardY -= 29; // 사각형 크기의 절반-getBoardPosition함수가 구해다주는 위치가 사각형의 중앙이기 때문에, 위치를 좌상단으로 옮겨줘야 함
        ctx.strokeStyle = "Yellow";
        ctx.lineWidth = 4;
        ctx.strokeRect(boardX, boardY, 58, 58);
      }
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

      if (!this.gameEndFlag && this.checkTurn()) {
        //게임이 끝난게 아니고, 나의 차례라면,
        this.drawAvailableMove(ctx, this.getAllAvailableMove());
      }
  
      for (let MoveInfo of this.mainBoard) {
        this.drawStone(ctx, MoveInfo);
      }
      // 바둑알 그리기
  
    }
  }