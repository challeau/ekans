// OBJECTS
let cells = [];

const playfield = {
  element: document.getElementById('playfield'),
  columns: 10,
  rows: 10
};

let kiki = { x: 5, y: 1 };

let snake = {
  head: { x: 0, y: 0 },
  tail: { x: 0, y: 0 },
  body: [],
  grow(direction) {
    let tailTarget;
    switch (direction){
    case 'left':
      tailTarget = {x: this.tail.x - 1, y: this.tail.y};
      break;
    case 'right':
      tailTarget = {x: this.tail.x + 1, y: this.tail.y};
      break;
    case 'up':
      tailTarget = {x: this.tail.x, y: this.tail.y - 1};
      break;
    case 'down':
      tailTarget = {x: this.tail.x, y: this.tail.y + 1};
      break;
    }
    const newBodyPart = { x: this.tail.x, y: this.tail.y };
    spriteMove(this.tail, tailTarget.x, tailTarget.y, 'snake-tail');
    cells[newBodyPart.y][newBodyPart.x].classList.add('cell', 'snake-body');
    this.body.push(newBodyPart);
  },
  move(targetX, targetY, direction) {
    const bodyLen = this.body.length;
    const newBodyPart = { x: this.head.x, y: this.head.y };
    const lastBodyPart = { x: this.body[bodyLen -1].x, y: this.body[bodyLen -1].y};

    // move head to target
    spriteMove(this.head, targetX, targetY, 'snake-head');
    // change last body part to tail
    cells[lastBodyPart.y][lastBodyPart.x].classList.remove('snake-body');
    spriteMove(this.tail, lastBodyPart.x, lastBodyPart.y, 'snake-tail');
    this.body.pop();
    // change old head spot to a body part
    cells[newBodyPart.y][newBodyPart.x].classList.add('cell', 'snake-body');
    this.body.unshift(newBodyPart);

    this.orient(direction);
    checkCollisions();
  },
  orient(direction) { cells[this.head.y][this.head.x].setAttribute('direction', direction); },
  autoTarget() {
    const directions = ['left', 'right', 'up', 'down'];
    const dist = { x: snake.head.x - kiki.x, y: snake.head.y - kiki.y };
    if (Math.abs(dist.x) > Math.abs(dist.y)){
      const newX = dist.x > 0 ? snake.head.x - 1 : snake.head.x + 1;
      snake.move(newX, snake.head.y, directions[dist.x > 0 ? 0 : 1]);
    }
    else {
      const newY = dist.y > 0 ? snake.head.y - 1 : snake.head.y + 1;
      snake.move(snake.head.x, newY, directions[dist.y > 0 ? 2 : 3]);
    }
  }
};

// GAME MECHANICS  
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
function displaySprites() {
  cells[kiki.y][kiki.x].classList.add('kiki');
  snake.head.x = getRandomNumber(2, playfield.columns);
  snake.head.y = getRandomNumber(0, playfield.rows);
  snake.tail = { x: snake.head.x - 1, y: snake.head.y };
  cells[snake.head.y][snake.head.x].classList.add('snake-head');
  cells[snake.tail.y][snake.tail.x].classList.add('snake-tail');
  snake.grow('left');
  checkCollisions(true);
}

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
  displaySprites();
  console.log(snake.head);
  const titi = setInterval(snake.autoTarget, 1000);
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

function spriteMove(sprite, targetX, targetY, spriteType) {
  cells[sprite.y][sprite.x].className = 'cell';
  sprite.x = targetX;
  sprite.y = targetY;
  cells[targetY][targetX].classList.add(spriteType);
  checkCollisions();
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
