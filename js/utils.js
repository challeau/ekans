import {score} from "./main.js";
import {endGame} from "./game.js";


/**
 * Returns a random number between two bounds.
 * @param {number} lowBound - lower limit.
 * @param {number} highBound - higher limit.
 * @returns {number}
 */
function getRandomNumber(lowBound, highBound) {
  const rand = Math.floor(Math.random() * (highBound - lowBound) + lowBound);
  return (rand);
}


/**
 * Checks if a cell is empty.
 * @param {number} x - the X coordinate of the cell.
 * @param {number} y - the Y coordinate of the cell.
 * @returns {boolean}
 */
function isCellEmpty(x, y) {
  let cellClassList = cells[y][x].classList.value.replaceAll('cell', '').trim();
  return (cellClassList == "");
}


/**
 * Checks for collisions between the snake and kiki, the snake and food
 * and kiki and food.
 * @param {Snake} snakeObj - the snake, only used when we check collisions
 *			     after a snake move.
 */
function checkForCollisions(snakeObj=undefined) {
  for (let x of Array(playfield.columns).keys()){
    for (let y of Array(playfield.rows).keys()){
      let classList = cells[y][x].classList.value;
      let kiki = classList.match(/kiki/);
      let food = classList.match(/carrot|apple/);
      let snake = classList.match(/snake-head|snake-tail|snake-body/g);

      if (!kiki && !food && !snake)
	continue;

      if (food && (kiki || snake)){
	if (kiki)
	  score.textContent = Number(score.textContent) + (food.includes("apple") ? 10 : 20);
	if (snake && snakeObj)
	  snakeObj.grow(snakeObj.tail.dir);
	let id = foods.indexOf(f => f.x == x && f.y == y);
	foods.splice(id, 1);
      }

      if (kiki && snake)
	endGame(1);

      if (snake && snake.length > 1)
	endGame(2);
    }
  }
}

export {getRandomNumber, checkForCollisions, isCellEmpty};
