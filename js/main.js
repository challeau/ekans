// OBJECTS
let cells = [];

const playfield = {
  element: document.getElementById('playfield'),
  columns: 10,
  rows: 10
};

let kiki = { x: 5, y: 1 };

const snake = {
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
    let newBody = { x: this.tail.x, y: this.tail.y };
    spriteMove(this.tail, tailTarget.x, tailTarget.y, 'snake-tail');
    cells[newBody.y][newBody.x].classList.add('cell', 'snake-body');
    this.body.push(newBody);
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
    if (checkCollisions() === true){
      gameEnd();
      alert('You killed Kiki.....');
      gameStart();
    }
  },
  orient(direction) { cells[this.head.y][this.head.x].setAttribute('direction', direction); }
};

// GAME MECHANICS  
// check if the snake is colliding with kiki or itself
function checkCollisions() {
  const snakeCoords = [snake.head, snake.body, snake.tail].flat();
  if (snakeCoords.some(snakePart => checkCoords(snakePart, kiki)))
    return (true);	// snake collision with Kiki
  snakeCoords.shift();
  if (snakeCoords.some(snakePart => checkCoords(snakePart, snake.head)))
      return (true);	// snake collision with self
  return (false);
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
  if (checkCollisions() === true){
    gameEnd();
    gameStart();
  }
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
}

// reset the playfield
function gameEnd() {
  playfield.element.innerHTML = '';
  cells = [];
  kiki = { x: 5, y: 1 };
  snake.head = { x: 0, y: 0 };
  snake.tail = { x: 0, y: 0 };
  snake.body = [];
}

function spriteMove(sprite, targetX, targetY, spriteType) {
  cells[sprite.y][sprite.x].className = 'cell';
  sprite.x = targetX;
  sprite.y = targetY;
  cells[targetY][targetX].classList.add(spriteType);
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

// document.onkeydown = function (event) {
//   switch (event.keyCode) {
//   case 37:		// left
//     if (kiki.x > 0)
//       spriteMove(kiki, kiki.x - 1, kiki.y, 'kiki');
//     break;
//   case 38:		// up
//     if (kiki.y > 0)
//       spriteMove(kiki, kiki.x, kiki.y - 1, 'kiki');
//     break;
//   case 39:		// right
//     if (kiki.x < playfield.columns - 1)
//       spriteMove(kiki, kiki.x + 1, kiki.y, 'kiki');
//     break;
//   case 40:		// down
//     if (kiki.y < playfield.rows - 1)
//       spriteMove(kiki, kiki.x, kiki.y + 1, 'kiki');
//     break;
//   case 32:
//     snakeGrow('left');
//   }
// };

document.addEventListener('keydown', event => {
  switch (event.key) {
  case 'ArrowLeft':		// left
    if (snake.head.x > 0)
      snake.move(snake.head.x - 1, snake.head.y, 'left');
    break;
  case 'ArrowUp':		// up
    if (snake.head.y > 0)
      snake.move(snake.head.x, snake.head.y - 1, 'up');
    break;
  case 'ArrowRight':		// right
    if (snake.head.x < playfield.columns - 1)
      snake.move(snake.head.x + 1, snake.head.y, 'right');
    break;
  case 'ArrowDown':		// down
    if (snake.head.y < playfield.rows - 1)
      snake.move(snake.head.x, snake.head.y + 1, 'down');
    break;
  case 32:
    snake.grow('left');
  }
});
