// OBJECTS
let playfield = {
  element: document.getElementById('playfield'),
  columns: 10,
  rows: 10
};

let player = {
  pos: 15
};

let snake = {
  headPos: 0,
  tailPos: 1
};

let cells = [];

// SNAKE
function snakeGrow() {
  cells[snake.tailPos].classList.remove('snake-tail');
  cells[snake.tailPos].classList.add('snake-body');
  snake.tailPos -= 1;
  cells[snake.tailPos].classList.add('snake', 'snake-tail');
}

function snakeMove(target) {
  if (target === player.pos)
    endGame();
  cells[player.pos].classList.remove('player');
  player.pos = target;
  cells[target].classList.add('player');
}


// USER INTERACTIONS
function playerMove(target) {
  if (cells[target].classList.contains('snake') === true)
    gameEnd();
  cells[player.pos].classList.remove('player');
  player.pos = target;
  cells[target].classList.add('player');
}

// START/END GAME
function displaySprites() {
  cells[player.pos].classList.add('player');
  snake.headPos = getRandomNumber(0, playfield.columns * playfield.rows);
  while (snake.headPos === player.pos || snake.headPos === player.pos - 1)
    snake.headPos = getRandomNumber(0, playfield.columns * playfield.rows);
  snake.tailPos = snake.headPos - 1;
  cells[snake.headPos].classList.add('snake', 'snake-head');
  cells[snake.tailPos].classList.add('snake', 'snake-tail');
}

function gameStart() {
  for (let i = 0; i < playfield.rows * playfield.columns; i++) {
    let div = document.createElement('div');
    div.classList.add('cell');
    div.dataset.index = i;
    playfield.element.append(div);
    cells.push(div);
  }
  displaySprites();
}

function gameEnd() {
  alert('HA! Loser.');
  playfield.element.innerHTML = '';
  cells = [];
  player.pos = 15;
  snake.headPos = 0;
}

// EVENTS
const startBtn = document.getElementById('start-btn');
startBtn.addEventListener('click', () => {
  if (playfield.element.childElementCount === 0)
    gameStart();
});

document.onkeydown = function (event) {
  switch (event.keyCode) {
  case 37:
    if (player.pos % playfield.columns !== 0)
      playerMove(player.pos - 1);
    break;
  case 38:
    if (player.pos > playfield.rows)
      playerMove(player.pos - playfield.columns);
    break;
  case 39:
    if ((player.pos + 1) % playfield.columns !== 0)
      playerMove(player.pos + 1);
    break;
  case 40:
    if (player.pos < playfield.rows * playfield.columns - playfield.rows)
      playerMove(player.pos + playfield.columns);
    break;
  case 32:
    snakeGrow('left');
  }
};

