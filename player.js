import GameBoard from "./gameboard.js";

class Player {
    constructor(type = "human") {
        this.type = type
        this.GB = new GameBoard;
    }
}

export default Player;