// DOM OBJECTS
const startBtn = document.getElementById('start-btn');

const score = document.querySelector('#score p');

const EOGpannel = document.getElementById('EOG-pannel');
const EOGmessage = document.getElementById('msg');
const EOGscore = document.querySelector('#EOG-pannel h2 span')

//CLASSES
class Sprite {
  constructor(x, y, dir, type) {
    this.x = x;
    this.y = y;
    this.dir = dir;
    this.type = type;
  }
}

class Food {
  constructor() {
    do {
      this.x = getRandomNumber(0, playfield.columns);
      this.y = getRandomNumber(0, playfield.rows);
    } while (isCellEmpty(cells, this.x, this.y) === false);
    this.points = 50;
    this.type = 'food';
    }
};

let foods = [];

let cells = [];

const playfield = {
  element: document.getElementById('playfield'),
  columns: 10,
  rows: 10
};


let kiki = new Sprite(5, 1, null, 'kiki');
