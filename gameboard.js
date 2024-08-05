import Ship from "./ship.js"

class GameBoard {
    constructor() {
        this.board = Array(10).fill().map(() => Array(10).fill().map( () => ({ ship:null, hit:null})));
        this.ships = []
    }

    placeShip(x, y, direction, shipSize) {
        if (direction === "horizontal" && this.isValidPlacement(x, y, direction, shipSize)) {
            const newShip = new Ship(shipSize);
            this.ships.push(newShip);
            for (let i = 0; i < shipSize; i++) {
                this.board[x + i][y].ship = newShip;
            }
            return true;
        } else if (direction === "vertical" && this.isValidPlacement(x, y, direction, shipSize)) {
            const newShip = new Ship(shipSize);
            this.ships.push(newShip);
            for (let i = 0; i < shipSize; i++) {
                this.board[x][y - i].ship = newShip;
            }
            return true;
        } else {
            return false; // Restituisce false se il piazzamento non è valido
        }
    }
    receiveHit(x,y) {

        if (this.board[x][y].hit !== null) {
            return false 
        }

        if (this.board[x][y].ship !== null && this.board[x][y].hit === null) {
            this.board[x][y].ship.hit();
            this.board[x][y].hit = "hit";
            this.checkAllSunk();
            return "hit"
        }

        if (this.board[x][y].ship === null && this.board[x][y].hit === null) {
            this.board[x][y].hit = "miss";
            return "miss";
        }

    }

    checkAllSunk() {
        if (this.ships.some(ship => ship.isSunk === false)) {
            return false;
        } else {
            return true;
        }
    }

    isValidPlacement(x, y, direction, shipSize) {
        switch (direction) {
            case "horizontal":  
                if (x + shipSize > 10 || y >= 10 || x < 0 || y < 0) {
                    return false;
                }
                for (let i = 0; i < shipSize; i++) {
                    if (this.board[x + i][y].ship !== null) {
                        return false; 
                    }
                }
                return true;
    
            case "vertical":
                if (y - shipSize + 1 < 0 || x >= 10 || y >= 10 || x < 0) {
                    return false; 
                }
                for (let i = 0; i < shipSize; i++) {
                    if (this.board[x][y - i].ship !== null) {
                        return false;
                    }
                }
                return true;
    
            default:
                return false;
        }
    }

    receiveRandomHit() {
        let success = false;
        while (!success) {
            let randX = Math.floor(Math.random() * 10);
            let randY = Math.floor(Math.random() * 10);
            
            success = this.receiveHit(randX, randY)

    
            }
        }
    }


export default GameBoard;