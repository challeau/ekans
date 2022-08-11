// return a random normal between lowBound and highBound
function getRandomNumber(lowBound, highBound) {
  const rand = Math.floor(Math.random() * (highBound - lowBound) + lowBound);
  return (rand);
}

// return true if both sprites have the same coordiantes
function compareCoordinates(sprite1, sprite2) {
  const ret = sprite1.x === sprite2.x && sprite1.y === sprite2.y ? true : false;
  return (ret);
}

// checks if cell with the coordinates x and y is empty
function isCellEmpty(cells, x, y) {
  let ret = cells[y][x].classList.length <= 1 ? true : false;
  return (ret);
}


// document.addEventListener('keydown', event => {
//   switch (event.key) {
//   case 'ArrowLeft':		// left
//     if (snake.head.x > 0)
//       snake.move(snake.head.x - 1, snake.head.y, 'left');
//     break;
//   case 'ArrowUp':		// up
//     if (snake.head.y > 0)
//       snake.move(snake.head.x, snake.head.y - 1, 'up');
//     break;
//   case 'ArrowRight':		// right
//     if (snake.head.x < playfield.columns - 1)
//       snake.move(snake.head.x + 1, snake.head.y, 'right');
//     break;
//   case 'ArrowDown':		// down
//     if (snake.head.y < playfield.rows - 1)
//       snake.move(snake.head.x, snake.head.y + 1, 'down');
//     break;
//   case ' ':
//     snake.grow('left');
//   }
//   for (const food of foods){
//     console.log(`${snake.head.y}:${snake.head.x} ${food.y}:${food.x} `, compareCoordinates(snake.head, food) === true);
//     if (compareCoordinates(snake.head, food) === true){
//       let id = foods.find(e => (e.x === snake.head.x && e.y === snake.head.y));
//       foods.splice(id, 1);
//       snake.grow(snake.tail.dir);
//     }
//   }
// });

