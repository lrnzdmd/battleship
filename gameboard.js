import Ship from "./ship.js"

class GameBoard {
    constructor() {
        this.board = Array(10).fill().map(() => Array(10).fill().map( () => ({ ship:null, hit:null})));
        this.ships = []
    }

    placeShip(x,y,direction,shipSize) {
        if (direction === "horizontal" && this._isValidPlacement(x,y,direction,shipSize)) {
                const newShip = new Ship(shipSize);
                this.ships.push(newShip);
                for (let i = 0; i < shipSize; i++) {
                    this.board[x + i][y].ship = newShip;
                }        
        } else if (direction === "vertical" && this._isValidPlacement(x,y,direction,shipSize)) {
                const newShip = new Ship(shipSize);
                this.ships.push(newShip);
                for (let i = 0; i < shipSize; i++) {
                    this.board[x][y + i].ship = newShip;
                }
        }
    }
    receiveHit(x,y) {

        if (this.board[x][y].hit !== null) {
            throw new Error("Cannot repeat hit coordinates");   
        }

        if (this.board[x][y].ship !== null && this.board[x][y].hit === null) {
            this.board[x][y].ship.hit();
            this.board[x][y].hit = "hit";
            this.checkAllSunk();
        }

        if (this.board[x][y].ship === null && this.board[x][y].hit === null) {
            this.board[x][y].hit = "miss";
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
                        if (this.board[x + i][y].ship !== null) {
                            throw new Error("Invalid ship placement");
                            } 
                    }
                        return true;
                }

                break;

            case "vertical": 
            if (y + shipSize >= 0 && y + shipSize <= 10) {
                for (let i = 0; i < shipSize; i++) {
                if (this.board[x][y + i].ship !== null) {
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

export default GameBoard;