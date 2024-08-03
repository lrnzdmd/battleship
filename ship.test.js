const Ship = require("./ship");

test("ship class constructor", () => {
    expect(new Ship(3)).toEqual({
        length: 3,
        hits: 0,
        isSunk: false
    })
})

test("hit function", () => {
    const ship = new Ship(3);
    ship.hit();
    ship.hit();
    expect(ship.hits).toBe(2);
})

test("checkSunk function", () => {
    const ship = new Ship(2);
    ship.hit();
    ship.hit();
    expect(ship.isSunk).toBe(true);
})