import {score} from "./main.js";


/* Returns a random number between lowBound and highBound. */
function getRandomNumber(lowBound, highBound) {
  const rand = Math.floor(Math.random() * (highBound - lowBound) + lowBound);
  return (rand);
}


/* Return true if both sprites have the same coordiantes. */
function compareCoordinates(sprite1, sprite2) {
  const ret = sprite1.x === sprite2.x && sprite1.y === sprite2.y ? true : false;
  return (ret);
}


/* Checks if the cell with the coordinates x and y is empty. */
function isCellEmpty(x, y) {
  let ret = cells[y][x].classList.length <= 1 ? true : false;
  return (ret);
}


/* Checks for collisions between the snake and kiki, the snake and food, and kiki and food. */
function checkForCollisions(kiki, snake ,foods) {
  let ret = 0;
  const snakeCoords = [snake.head, snake.body, snake.tail].flat();

  // collisions with food
  for (const food of foods){
    if (compareCoordinates(kiki, food) === true){
      let id = foods.find(sprite => sprite.x == kiki.x && sprite.y == kiki.y);
      score.textContent = Number(score.textContent) + food.points;
      foods.splice(id, 1);
    }

    if (compareCoordinates(snake.head, food) === true){
      let id = foods.find(sprite => sprite.x == snake.head.x && sprite.y === snake.head.y);
      snake.grow(snake.tail.dir);
      foods.splice(id, 1);
    }
  }

  // snake collision with Kiki
  if (snakeCoords.some(snakePart => compareCoordinates(snakePart, kiki)))
    ret = 1;
  snakeCoords.shift();

  // snake collision with self
  if (snakeCoords.some(snakePart => compareCoordinates(snakePart, snake.head)))
    ret = 2;

  return (ret);
}

export {getRandomNumber, checkForCollisions, compareCoordinates, isCellEmpty};
