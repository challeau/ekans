// OBJECTS
let playfield = {
  element: document.getElementById('playfield'),
  columns: 10,
  rows: 10
};

let player = { x: 5, y: 1 };

let snake = {
  head: { x: 0, y: 0 },
  tail: { x: 0, y: 0 },
  body: []
};

let cells = [];

// GAME MECHANICS
function checkCollisions() {
  for (const playerClass of cells[player.y][player.x].classList){
    if (/snake/.test(playerClass))
      return(true);
  }
  if (cells[snake.head.y][snake.head.x].classList.contains('snake-tail')
      || cells[snake.head.y][snake.head.x].classList.contains('snake-body'))
    return (true);
  return (false);
}

function displaySprites() {
  cells[player.y][player.x].classList.add('player');
  snake.head.x = getRandomNumber(2, playfield.columns);
  snake.head.y = getRandomNumber(0, playfield.rows);
  snake.tail = { x: snake.head.x - 1, y: snake.head.y };
  cells[snake.head.y][snake.head.x].classList.add('snake-head');
  cells[snake.tail.y][snake.tail.x].classList.add('snake-tail');
  snakeGrow('left');
  if (checkCollisions() === true){
    gameEnd();
    gameStart();
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
  displaySprites();
}

function gameEnd() {
  playfield.element.innerHTML = '';
  cells = [];
  player = { x: 5, y: 1 };
  snake.head = { x: 0, y: 0 };
  snake.body = [];
  snake.head = { x: 0, y: 0 };
}

function spriteMove(sprite, targetX, targetY, spriteType) {
  cells[sprite.y][sprite.x].className = 'cell';
  sprite.x = targetX;
  sprite.y = targetY;
  cells[targetY][targetX].classList.add(spriteType);
}

// SNAKE
function snakeGrow(direction) {
  let tailTarget;
  switch (direction){
  case 'left':
    tailTarget = {x: snake.tail.x - 1, y: snake.tail.y};
    break;
  case 'right':
    tailTarget = {x: snake.tail.x + 1, y: snake.tail.y};
    break;
  case 'up':
    tailTarget = {x: snake.tail.x, y: snake.tail.y - 1};
    break;
  case 'down':
    tailTarget = {x: snake.tail.x, y: snake.tail.y + 1};
    break;
  }
  let newBody = { x: snake.tail.x, y: snake.tail.y };
  spriteMove(snake.tail, tailTarget.x, tailTarget.y, 'snake-tail');
  cells[newBody.y][newBody.x].classList.add('cell', 'snake-body');
  snake.body.push(newBody);
}

function snakeOrient(direction) {
  cells[snake.head.y][snake.head.x].setAttribute('direction', direction);
}

function snakeMove(targetX, targetY, direction) {
  let newBody = { x: snake.head.x, y: snake.head.y };
  spriteMove(snake.head, targetX, targetY, 'snake-head');
  let last = snake.body.length -1;
  cells[snake.body[last].y][snake.body[last].x].classList.remove('snake-body');
  spriteMove(snake.tail, snake.body[last].x, snake.body[last].y, 'snake-tail');
  cells[newBody.y][newBody.x].classList.add('cell', 'snake-body');
  snake.body.pop();
  snake.body.unshift(newBody);
  snakeOrient(direction);
  if (checkCollisions() === true){
    gameEnd();
    alert('You killed Kiki.....');
    gameStart();
  }
}

// EVENTS
const startBtn = document.getElementById('start-btn');
startBtn.addEventListener('click', () => {
  if (playfield.element.childElementCount === 0)
    gameStart();
});

document.onkeydown = function (event) {
  switch (event.keyCode) {
  case 37:		// left
    if (snake.head.x > 0)
      snakeMove(snake.head.x - 1, snake.head.y, 'left');
    break;
  case 38:		// up
    if (snake.head.y > 0)
      snakeMove(snake.head.x, snake.head.y - 1, 'up');
    break;
  case 39:		// right
    if (snake.head.x < playfield.columns - 1)
      snakeMove(snake.head.x + 1, snake.head.y, 'right');
    break;
  case 40:		// down
    if (snake.head.y < playfield.rows - 1)
      snakeMove(snake.head.x, snake.head.y + 1, 'down');
    break;
  case 32:
    snakeGrow('left');
  }
};


