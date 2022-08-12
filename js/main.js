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

// generates new food items randomly
function generateFood() {
  let newFly = new Food();
  cells[newFly.y][newFly.x].classList.add('fly');
  foods.push(newFly);
}

// generates sprites at random and display them
function setUpSprites() {
  cells[kiki.y][kiki.x].classList.add('kiki');
  do {
    snake.head.x = getRandomNumber(2, playfield.columns);
    snake.head.y = getRandomNumber(0, playfield.rows);
    snake.tail.x = snake.head.x - 1;
    snake.tail.y = snake.head.y;
  } while (checkCollisions() !== 2);
  cells[snake.head.y][snake.head.x].classList.add('snake-head');
  cells[snake.tail.y][snake.tail.x].classList.add('snake-tail');
  snake.grow('left');
}

// move sprite to target coordinates
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
  updateScore();
}

// GAME
// setup the playfield
function updateScore() {
  for (const food of foods){
    if (compareCoordinates(kiki, food) === true){
      console.log('collision');
      score.textContent = Number(score.textContent) + food.points;
      let id = foods.find(e => (e.x === kiki.x && e.y === kiki.y));
      foods.splice(id);
    }
  }
}

let intervals = [];
// set up board and sprites
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
  playfield.element.style.display = 'grid';
  EOGpannel.style.display = 'none';
  let snakeInterval = setInterval(snake.autoTarget, 500);
  let foodInterval = setInterval(generateFood, getRandomNumber(600, 2000));
  intervals = [snakeInterval, foodInterval];
}

// reset the playfield, unless there are no collisions
// outcome : return of checkCollisions
//	--> 0 if snake/kiki collision, 1 if snake/snake collision, 2 if no collision
function gameEnd(outcome) {
  if (outcome === 2)
    return ;
  const msg = ['Kiki died a painful death! You should be ashamed of yourself.',
	       'The snake has eaten itself. Here\'s an extra 200 points.'];
  playfield.element.innerHTML = '';
  cells = [];
  cells.forEach(cell => cell.className = '');
  foods = [];
  kiki = new Sprite(5, 1, null, 'kiki');
  snake.head = new Sprite(0, 0, null, 'snake');
  snake.body = [];
  if (outcome === 1)
    score.textContent = Number(score.textContent) + 200;
  EOGscore.textContent = score.textContent;
  EOGmessage.textContent = msg[outcome];
  playfield.element.style.display = 'none';
  EOGpannel.style.display = 'flex';
  clearInterval(intervals[0]);
  clearInterval(intervals[1]);
  startBtn.textContent = 'Restart';
}

// EVENTS
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
