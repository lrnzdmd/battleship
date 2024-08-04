import Player from "./player.js";

const domMessageBox = document.querySelector(".messages");

const domP2GameBoard = document.querySelector(".gameboardgridp2");
const domP1GameBoard = document.querySelector(".gameboardgridp1");

const Player1 = new Player("human");
const Player2 = new Player("cpu");
let p1Turn = true;
Player2.GB.placeShip(3,3,"horizontal",4);
domRefreshBoard(Player2, domP2GameBoard);
domRefreshBoard(Player1, domP1GameBoard);

function domRefreshBoard(player, playerBoard) {
    playerBoard.innerHTML = "";
  const boardLen = player.GB.board.length;

  for (let j = 0; j < boardLen; j++) {

    for (let i = 0; i < boardLen; i++) {

      const newTile = document.createElement("div");

      newTile.dataset.x = i;
      newTile.dataset.y = boardLen - 1 - j;

      switch (player.GB.board[i][boardLen - 1 - j].hit) {

        case "hit":
          newTile.classList.add("hit");
          break;

        case "miss":
          newTile.classList.add("miss");
          break;

        default:
          newTile.classList.add("griditem");
      }
      if (player.type !== "human") {
        newTile.addEventListener("click", () => {
            if (p1Turn) {
            player.GB.receiveHit(newTile.dataset.x,newTile.dataset.y)
            p1Turn = !p1Turn;
            domRefreshBoard(player, playerBoard);
            }
      });
    }


      playerBoard.appendChild(newTile);
    }
  }
}
