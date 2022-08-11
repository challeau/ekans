// SPRITES  
// check if the snake is colliding with kiki or itself
function checkCollisions() {
  let ret = 2;
  const snakeCoords = [snake.head, snake.body, snake.tail].flat();
  // snake collision with Kiki
  if (snakeCoords.some(snakePart => compareCoordinates(snakePart, kiki)))
    ret = 0;
  snakeCoords.shift();
  // snake collision with self
  if (snakeCoords.some(snakePart => compareCoordinates(snakePart, snake.head)))
    ret = 1;
  return (ret);
}

// randomly position sprites and display them
function generateFood() {
  let newFly = new Food();
  cells[newFly.y][newFly.x].classList.add('fly');
  console.log(`new food @ ${newFly.x}:${newFly.x}`);
  foods.push(newFly);
}

function setUpSprites() {
  cells[kiki.y][kiki.x].classList.add('kiki');
  while (checkCollisions() !== 2){
    snake.head.x = getRandomNumber(2, playfield.columns);
    snake.head.y = getRandomNumber(0, playfield.rows);
    snake.tail.x = snake.head.x - 1;
    snake.tail.y = snake.head.y;
  }
  cells[snake.head.y][snake.head.x].classList.add('snake-head');
  cells[snake.tail.y][snake.tail.x].classList.add('snake-tail');
  snake.grow('left');
}

function spriteMove(sprite, targetX, targetY, spriteType) {
  cells[sprite.y][sprite.x].className = 'cell';
  cells[sprite.y][sprite.x].setAttribute('curve', 'false');
  sprite.x = targetX;
  sprite.y = targetY;
  if (/snake/.test(spriteType))
    sprite.type = 'snake';
  else
    sprite.type = 'kiki';
  cells[targetY][targetX].classList.add(spriteType);
}

// GAME
// setup the playfield
function updateScore() {
  for (const food of foods){
    if (compareCoordinates(kiki, food) === true)
      score.textContent = Number(score.textContent) + food.points;
  }
}

function gameStart() {
  for (let y = 0; y < playfield.rows; y++) {
    cells.push([]);
    for (let x = 0; x < playfield.columns; x++){
      let div = document.createElement('div');
      div.classList.add('cell');
      div.dataset.x = x;
      div.dataset.y = y;
      playfield.element.append(div);
      cells[y].push(div);
    }
  }
  setUpSprites();
  setInterval(snake.autoTarget, 700);
  setInterval(generateFood, 6000);
}

// reset the playfield
function gameEnd(outcome) {
  if (outcome === 2)
    return ;
  const msg = ['Kiki died a painful death! You should be ashamed of yourself.',
	       'The snake has eaten itself. Have some points.'];
  alert(msg[outcome]);
  playfield.element.innerHTML = '';
  cells.forEach(cell => cell.className = '');
  kiki = { x: 5, y: 1 };
  snake.head = { x: 0, y: 0 };
  snake.tail = { x: 0, y: 0 };
  snake.body = [];
  gameStart();
}

// EVENTS
const startBtn = document.getElementById('start-btn');
startBtn.addEventListener('click', () => {
  if (playfield.element.childElementCount === 0)
    gameStart();
});

document.addEventListener('keydown', event => {
  switch (event.key) {
  case 'ArrowLeft':		// left
    if (kiki.x > 0)
      spriteMove(kiki, kiki.x - 1, kiki.y, 'kiki');
    break;
  case 'ArrowUp':		// up
    if (kiki.y > 0)
      spriteMove(kiki, kiki.x, kiki.y - 1, 'kiki');
    break;
  case 'ArrowRight':		// right
    if (kiki.x < playfield.columns - 1)
      spriteMove(kiki, kiki.x + 1, kiki.y, 'kiki');
    break;
  case 'ArrowDown':		// down
    if (kiki.y < playfield.rows - 1)
      spriteMove(kiki, kiki.x, kiki.y + 1, 'kiki');
    break;
  case ' ':
    snake.grow('left');
  }
  updateScore();
});

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
