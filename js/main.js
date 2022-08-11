// OBJECTS
let cells = [];

const playfield = {
  element: document.getElementById('playfield'),
  columns: 10,
  rows: 10
};

let kiki = { x: 5, y: 1 };

// SPRITES  
// check if the snake is colliding with kiki or itself
function checkCollisions(isGameNew) {
  let msg = '';
  const snakeCoords = [snake.head, snake.body, snake.tail].flat();
  if (snakeCoords.some(snakePart => checkCoords(snakePart, kiki))) // snake collision with Kiki
    msg = 'Kiki died a painful death! You should be ashamed of yourself.';
  snakeCoords.shift();
  if (snakeCoords.some(snakePart => checkCoords(snakePart, snake.head))) // snake collision with self
    msg = 'The snake has eaten itself. Have some points.';
  if (msg)
    gameEnd(msg, isGameNew);
  return ;
}

// randomly position sprites and display them
function setUpSprites() {
  cells[kiki.y][kiki.x].classList.add('kiki');
  snake.head.x = getRandomNumber(2, playfield.columns);
  snake.head.y = getRandomNumber(0, playfield.rows);
  snake.tail = { x: snake.head.x - 1, y: snake.head.y };
  cells[snake.head.y][snake.head.x].classList.add('snake-head');
  cells[snake.tail.y][snake.tail.x].classList.add('snake-tail');
  snake.grow('left');
  checkCollisions(true);
}

function spriteMove(sprite, targetX, targetY, spriteType) {
  cells[sprite.y][sprite.x].className = 'cell';
  cells[sprite.y][sprite.x].setAttribute('curve', 'false');
  sprite.x = targetX;
  sprite.y = targetY;
  cells[targetY][targetX].classList.add(spriteType);
  checkCollisions();
}

// GAME
// setup the playfield
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
  console.log(snake.head);
  setInterval(snake.autoTarget, 400);
  console.log(snake.head);
}

// reset the playfield
function gameEnd(message, isGameNew) {
  alert(message);
  playfield.element.innerHTML = '';
  cells.forEach(cell => cell.className = '');
  kiki = { x: 5, y: 1 };
  snake.head = { x: 0, y: 0 };
  snake.tail = { x: 0, y: 0 };
  snake.body = [];
  if (isGameNew)
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
// });
