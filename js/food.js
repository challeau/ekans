import {getRandomNumber, isCellEmpty} from "./utils.js";

/* Food class. */
class Food {
  constructor(cells) {
    let foodType = getRandomNumber(0, 4) ? "apple" : "carrot";
    let x = getRandomNumber(0, playfield.columns);
    let y = getRandomNumber(0, playfield.rows);

    do {
      this.x = x;
      this.y = y;
    } while (isCellEmpty(this.x, this.y) === false);

    this.type = foodType;
    this.points = foodType == "apple" ? 10 : 20;
    cells[this.y][this.x].classList.add(foodType);
  }
}

export {Food};