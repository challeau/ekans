// DOM ELEMENTS
const startBtn = document.getElementById('start-btn');

let playfield = {
  element: document.getElementById('playfield'),
  columns: 10,
  rows: 10
};

let player = {
  pos: 15
};

let snake = {
  headPos: 0
};

let cells = [];

function getRandomNumber(lowBound, highBound) {
  const rand = Math.floor(Math.random() * (highBound - lowBound) + lowBound);
  return (rand);
}

function displaySprites() {
  let playerDiv = cells[player.pos];
  playerDiv.classList.add('player');

  snake.headPos = getRandomNumber(0, playfield.columns * playfield.rows);
  let snakeDiv = cells[snake.headPos];
  snakeDiv.classList.add('snake-head');
}

function startGame() {
  for (let i = 0; i < playfield.rows * playfield.columns; i++) {
    let div = document.createElement('div');
    div.classList.add('cell');
    div.dataset.index = i;
    playfield.element.append(div);
    cells.push(div);
  }
  displaySprites();
}

function endGame() {
  alert('HA! Loser.');
  playfield.element.innerHTML = '';
  cells = [];
  player.pos = 15;
  snake.headPos = 0;
}

function movePlayer(target) {
  if (target === snake.headPos)
    endGame();
  cells[player.pos].classList.remove('player');
  player.pos = target;
  cells[target].classList.add('player');
}

// EVENTS
startBtn.addEventListener('click', () => {
  if (playfield.element.childElementCount === 0)
    startGame();
});

document.onkeydown = function (event) {
  switch (event.keyCode) {
  case 37:
    if (player.pos % playfield.columns !== 0)
      movePlayer(player.pos - 1);
    break;
  case 38:
    if (player.pos > playfield.rows)
      movePlayer(player.pos - playfield.columns);
    break;
  case 39:
    if ((player.pos + 1) % playfield.columns !== 0)
      movePlayer(player.pos + 1);
    break;
  case 40:
    if (player.pos < playfield.rows * playfield.columns - playfield.rows)
      movePlayer(player.pos + playfield.columns);
    break;
  }
};