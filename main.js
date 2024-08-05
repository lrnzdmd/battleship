import Player from "./player.js";

const domMessageBox = document.querySelector(".messages");

const domP2GameBoard = document.querySelector(".gameboardgridp2");
const domP1GameBoard = document.querySelector(".gameboardgridp1");





let Player1 = new Player("human");
let Player2 = new Player("cpu");


let gameStart = false;
let p1Turn = true;
domRefreshBoards();











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
        let x = newTile.dataset.x
        let y = newTile.dataset.y
        newTile.addEventListener("click", (event) => {
          gridReceiveHit(event,player,x,y);
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
  ship.addEventListener('dragstart', onDragStart);
  ship.addEventListener('drag', onDrag);
  ship.addEventListener('mousedown', onMouseDown);
  ship.addEventListener('dragend', onDragEnd);
}

function removeShipDnDpEvents(ship) {
  ship.draggable = false; 

  ship.removeEventListener('dragstart', onDragStart);
  ship.removeEventListener('drag', onDrag);
  ship.removeEventListener('mousedown', onMouseDown);
  ship.removeEventListener('dragend', onDragEnd);
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
        console.log(closestTile);
        ship.dataset.x = closestTile.dataset.x;
        ship.dataset.y = closestTile.dataset.y;
        console.log(ship);
    }
    });


    let shipList = document.querySelectorAll(".ship")

    if (shipList.length !== 5) {
      domMessageBox.textContent = "Place all your ships! (right click to rotate)";
    } else {
      let isvalid = true;

      shipList.forEach(ship => {

        let sX = parseInt(ship.dataset.x);
        let sY = parseInt(ship.dataset.y);
        let sL = parseInt(ship.dataset.length);
        let sD = ship.dataset.direction;

        if (Player1.GB.placeShip(sX,sY,sD,sL) === false) {
          console.log(`invalid ship: ${ship.dataset.length}`);
          isvalid = false;
        }
              
      })
      if (!isvalid) {
        domMessageBox.textContent = "Placement Invalid";
        Player1.GB.board = Array(10).fill().map(() => Array(10).fill().map( () => ({ ship:null, hit:null})));
        Player1.GB.ships = [];
        console.log(Player1.GB.board)
      } else if (isvalid) {
        domMessageBox.textContent = "Game Start!"
        startGameBtn.style.display = "none"
        gameStart = true;
        placeCpuShips();
        ships.forEach(ship => removeShipDnDpEvents(ship));
        domRefreshBoards();
      }

    }



}


function getBottomLeftCorner(element) {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left,
    y: rect.top
  }; 
}


function onDragStart(event) {
  const ship = event.target;
  ship.style.position = "absolute"
  ship.offsetX = event.clientX - ship.getBoundingClientRect().left;
  ship.offsetY = event.clientY - ship.getBoundingClientRect().top;
}

function onDrag(event) {
  const ship = event.target;
  const fx = event.pageX - ship.offsetX;
  const fy = event.pageY - ship.offsetY;
  ship.style.left = `${fx}px`;
  ship.style.top = `${fy}px`;
  event.preventDefault();
}

function onMouseDown(event) {
  if (event.button === 2) { 
      rotateShip(event);
  }
}

function onDragEnd(event) {
  const ship = event.target;
  const fx = event.pageX - ship.offsetX;
  const fy = event.pageY - ship.offsetY;
  ship.style.left = `${fx}px`;
  ship.style.top = `${fy}px`;
}

function domRefreshBoards() {
        domRefreshBoard(Player2, domP2GameBoard);
        domRefreshBoard(Player1, domP1GameBoard);
        checkWinCondition();
}

function gridReceiveHit(event,player, x,y) {
  event.preventDefault();
  if (p1Turn && player.GB.receiveHit(x,y)) {
  
  p1Turn = !p1Turn;
  cpuTurn();
  domRefreshBoards();
  }
}

function cpuTurn() {
    //try a random spot until you get an hit then pass turn to the player;
    Player1.GB.receiveRandomHit()
    p1Turn = !p1Turn;
    domRefreshBoards()
  
}


function checkWinCondition() {
  if (gameStart && Player1.GB.checkAllSunk()) {
    gameStart = false;
    p1Turn = false;
    domMessageBox.textContent = "CPU Wins";
  } else if (gameStart && Player2.GB.checkAllSunk()) {
    gameStart = false;
    p1Turn = false;
    domMessageBox.textContent = "Player Wins";
  }
}

function placeCpuShips() {
  const shipsLen = [5, 4, 3, 3, 2];
  const maxAttempts = 500;

  while (shipsLen.length > 0) {
    let success = false;
    let attempts = 0;

    while (!success && attempts < maxAttempts) {
      let randX = Math.floor(Math.random() * 10);
      let randY = Math.floor(Math.random() * 10);
      let randD = randomDirection();
      success = Player2.GB.placeShip(randX, randY, randD, shipsLen[0]);
      attempts++;
    }

    if (success) {
      console.log(`Nave di lunghezza ${shipsLen[0]} piazzata con successo.`);
      shipsLen.shift(); 
    } else {
      console.log(`Non è stato possibile piazzare una nave di lunghezza ${shipsLen[0]} dopo ${maxAttempts} tentativi.`);
      break; 
  }

  console.log(Player2.GB.board);
}
}


function randomDirection() {
    const directions = ["horizontal", "vertical"];
    const randomIndex = Math.floor(Math.random() * directions.length);
    return directions[randomIndex];
}