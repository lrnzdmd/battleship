class Ship {
    constructor(length) {
        this.length = length;
        this.hits = 0;
        this.isSunk = false;
    }

    hit() {
        this.hits++;
        this._checkSunk();
    }

    _checkSunk() {
        this.hits >= this.length ? this.isSunk = true : this.isSunk = false;
    }
}



export default Ship;