const Ship = require("./ship");

class GameBoard {
    constructor() {
        this.board = Array(10).fill().map(() => Array(10).fill(null));
        this.attackB = Array(10).fill().map(() => Array(10).fill(null));
        this.ships = []
    }

    placeShip(x,y,direction,shipSize) {
        if (direction === "horizontal" && this._isValidPlacement(x,y,direction,shipSize)) {
                const newShip = new Ship(shipSize);
                this.ships.push(newShip);
                for (let i = 0; i < shipSize; i++) {
                    this.board[x + i][y] = newShip;
                }        
        } else if (direction === "vertical" && this._isValidPlacement(x,y,direction,shipSize)) {
                const newShip = new Ship(shipSize);
                this.ships.push(newShip);
                for (let i = 0; i < shipSize; i++) {
                    this.board[x][y + i] = newShip;
                }
        }
    }

    receiveHit(x,y) {

        if (this.attackB[x][y] !== null) {
            throw new Error("Cannot repeat hit coordinates");   
        }

        if (this.board[x][y] !== null && this.attackB[x][y] === null) {
            this.board[x][y].hit();
            this.attackB[x][y] = "hit";
            this.checkAllSunk();
        }

        if (this.board[x][y] === null && this.attackB[x][y] === null) {
            this.attackB[x][y] = "miss";
        }

    }

    checkAllSunk() {
        if (this.ships.some(ship => ship.isSunk === false)) {
            return false;
        } else {
            return true;
        }
    }

    _isValidPlacement(x,y,direction,shipSize) {
            switch (direction) {
            case "horizontal":  
                if (x + shipSize >= 0 && x + shipSize <= 10) {
                    for (let i = 0; i < shipSize; i++) {
                        if (this.board[x + i][y] !== null) {
                            throw new Error("Invalid ship placement");
                            } 
                    }
                        return true;
                }

                break;

            case "vertical": 
            if (y + shipSize >= 0 && y + shipSize <= 10) {
                for (let i = 0; i < shipSize; i++) {
                if (this.board[x][y + i] !== null) {
                    throw new Error("Invalid ship placement");
                } 
            }
                    return true;
        }

        break;

        default: throw new Error("Invalid ship placement");
                    
                    
       
    }
}
}

module.exports = GameBoard;