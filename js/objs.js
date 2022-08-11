// OBJECTS
let score = document.querySelector('#score p');

let cells = [];

const playfield = {
  element: document.getElementById('playfield'),
  columns: 10,
  rows: 10
};

class Sprite {
  constructor(x, y, dir, type) {
    this.x = x;
    this.y = y;
    this.dir = dir;
    this.type = type;
  }
}

let kiki = new Sprite(5, 1, null, 'kiki');

class Food {
  constructor() {
    do {
      this.x = getRandomNumber(0, playfield.columns);
      this.y = getRandomNumber(0, playfield.rows);
    } while (isCellEmpty(cells, this.x, this.y));
    this.points = 50;
    this.type = 'food';
    }
};

let foods = [];
