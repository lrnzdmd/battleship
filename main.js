import Player from "./player.js";

const domMessageBox = document.querySelector(".messages");

const domP2GameBoard = document.querySelector(".gameboardgridp2");
const domP1GameBoard = document.querySelector(".gameboardgridp1");

const Player1 = new Player("human");
const Player2 = new Player("cpu");
let gameStart = false;
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
      if (player.type !== "human" && gameStart) {
        newTile.addEventListener("click", (event) => {
          event.preventDefault();
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

// gets all the ships from the dom and then initializes their events

const ships = document.querySelectorAll(".ship");

ships.forEach(ship => initShipDnDpEvents(ship))




function initShipDnDpEvents(ship) {

let offsetX, offsetY;

ship.addEventListener('dragstart', function(event) {
  ship.style.position = "absolute"
  offsetX = event.clientX - ship.getBoundingClientRect().left;
  offsetY = event.clientY - ship.getBoundingClientRect().top;
});

ship.addEventListener('drag', function(event) {
  const fx = event.pageX - offsetX;
  const fy = event.pageY - offsetY;
  ship.style.left = `${fx}px`;
  ship.style.top = `${fy}px`;
  event.preventDefault();
});



ship.addEventListener('mousedown', function(event) {
  if (event.button === 2) {
      rotateShip(event);
  }
});

ship.addEventListener('dragend', function(event) {
  const fx = event.pageX - offsetX;
  const fy = event.pageY - offsetY;
  ship.style.left = `${fx}px`;
  ship.style.top = `${fy}px`;

});
}


// self explainatory... rotates the ships on the dom before placement

function rotateShip(event) {
  const ship = event.target
  event.preventDefault();
  const currentHeight = window.getComputedStyle(ship).height;
  const currentWidth = window.getComputedStyle(ship).width;

  ship.style.height = currentWidth;
  ship.style.width = currentHeight;

  if (ship.dataset.direction == "horizontal") {
    ship.dataset.direction = "vertical";
  } else {
    ship.dataset.direction = "horizontal";
  }
}

// start game button event listener and function

const startGameBtn = document.querySelector(".startbtn");

startGameBtn.addEventListener("click", startGame);

function startGame() {
    const tiles = document.querySelectorAll(".gameboardgridp1>div");
    const gameBoard = document.querySelector(".gameboardgridp1");
    const boardRect = gameBoard.getBoundingClientRect();
    

    ships.forEach(ship => {
      let closestTile = null;
      let minDistance = Infinity;
      const shipPos = getBottomLeftCorner(ship);
  

      tiles.forEach(tile => {
        const tilePos = getBottomLeftCorner(tile);
        let distance = Math.abs(tilePos.x - shipPos.x) + Math.abs(tilePos.y - shipPos.y);
        if (distance < minDistance) {
          minDistance = distance;
          closestTile = tile;
        }
        
      });
      if (closestTile && ship.style.position === "absolute") {
        const closestTileRect = closestTile.getBoundingClientRect()
        ship.style.left = `${closestTileRect.left}px`;
        ship.style.top = `${closestTileRect.top}px`; 
        
    }
      


    })
}


function getBottomLeftCorner(element) {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left,
    y: rect.top
  }; 
}