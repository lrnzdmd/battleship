const GameBoard = require("./gameboard.js");

test("create gameboard", () => {
    const board = new GameBoard();
    const boardLenX = board.board.length
    const boardLenY = board.board[0].length
    expect(boardLenX).toBe(10);
    expect(boardLenY).toBe(10);
});

test("place ship", () => {
    const board = new GameBoard();
    board.placeShip(3, 3, "vertical", 3);
    board.placeShip(0, 0, "horizontal", 3);

    expect(board.board[3][3]).not.toBeNull()
    expect(board.board[3][4]).not.toBeNull()
    expect(board.board[3][5]).not.toBeNull()
    expect(board.board[0][0]).not.toBeNull()
    expect(board.board[1][0]).not.toBeNull()
    expect(board.board[2][0]).not.toBeNull()
    expect(board.board[3][6]).toBeNull()
    expect(board.board[3][2]).toBeNull()
})

test("incorrect ship placement", () => {
    const board = new GameBoard();
    board.placeShip(3, 3, "vertical", 3);

    expect(() => board.placeShip(2,3, "horizontal", 5)).toThrow("Invalid ship placement");
    
})

test("receive hit", () => {
    const board = new GameBoard();
    board.placeShip(3, 3, "vertical", 3);
    board.receiveHit(3,3);
    expect(board.board[3][3].hits).toBe(1);
    expect(board.attackB[3][3]).toEqual("hit");
    expect(board.attackB[1][3]).toBeNull();
})

test("check allSunk", () => {
    const board = new GameBoard();
    board.placeShip(3, 3, "vertical", 3);
    board.receiveHit(3,3);
    board.receiveHit(3,4);
    board.receiveHit(3,5);
    expect(board.checkAllSunk()).toBe(true);
    expect(board.ships.length).toBe(1);
    
})