// OBJECTS
let playfield = {
  element: document.getElementById('playfield'),
  columns: 10,
  rows: 10
};

let player = { pos: 15 };

let snake = {
  head: { pos: 0 },
  tail: { pos: 0 }
};

let cells = [];

// START/END GAME
function displaySprites() {
  cells[player.pos].classList.add('player');
  snake.head.pos = getRandomNumber(0, playfield.columns * playfield.rows);
  while (snake.head.pos === player.pos || snake.head.pos === player.pos - 1)
    snake.head.pos = getRandomNumber(0, playfield.columns * playfield.rows);
  snake.tail.pos = snake.head.pos - 1;
  cells[snake.head.pos].classList.add('snake', 'snake-head');
  cells[snake.tail.pos].classList.add('snake', 'snake-tail');
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
  snake.head.pos = 0;
}


function spriteMove(elem, target, class1, class2) {
  cells[elem.pos].classList.remove(class1, class2);
  elem.pos = target;
  cells[target].classList.add(class1, class2);
}


// SNAKE
function snakeGrow() {
  cells[snake.tail.pos].classList.remove('snake', 'snake-tail');
  cells[snake.tail.pos].classList.add('snake', 'snake-body');
  snake.tail.pos -= 1;
  cells[snake.tail.pos].classList.add('snake', 'snake-tail');
}

function snakeMove(target) {
  if (cells[target].classList.contains('player'))
    gameEnd();
  spriteMove(snake.head, target, 'snake', 'snake-head');
  spriteMove(snake.tail, target - 1, 'snake', 'snake-tail');
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
//     if (player.pos % playfield.columns !== 0)
//       elemMove(player, player.pos - 1, 'player');
//     break;
//   case 38:		// up
//     if (player.pos >= playfield.rows)
//       elemMove(player, player.pos - playfield.columns, 'player');
//     break;
//   case 39:		// right
//     if ((player.pos + 1) % playfield.columns !== 0)
//       elemMove(player, player.pos + 1, 'player');
//     break;
//   case 40:		// down
//     if (player.pos < playfield.rows * playfield.columns - playfield.rows)
//       elemMove(player, player.pos + playfield.columns, 'player');
//     break;
//   case 32:
//     snakeGrow('left');
//   }
// };

document.onkeydown = function (event) {
  switch (event.keyCode) {
  case 37:		// left
    if (snake.head.pos % playfield.columns !== 0)
      snakeMove(snake.head.pos - 1);
    break;
  case 38:		// up
    if (snake.head.pos >= playfield.rows)
      snakeMove(snake.head.pos - playfield.columns);
    break;
  case 39:		// right
    if ((snake.head.pos + 1) % playfield.columns !== 0)
      snakeMove(snake.head.pos + 1);
    break;
  case 40:		// down
    if (snake.head.pos < playfield.rows * playfield.columns - playfield.rows)
      snakeMove(snake.head.pos + playfield.columns);
    break;
  case 32:
    snakeGrow('left');
  }
};

