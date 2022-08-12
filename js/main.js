// SPRITES  
// check if the snake is colliding with kiki or itself
function checkCollisions() {
  let ret = 0;
  const snakeCoords = [snake.head, snake.body, snake.tail].flat();

  // any collision with food
  for (const food of foods){
    if (compareCoordinates(kiki, food) === true){
      let id = foods.find(sprite => (sprite.x === kiki.x && sprite.y === kiki.y));
      updateScore(food);
      foods.splice(id, 1);
    }
    if (compareCoordinates(snake.head, food) === true){
      let id = foods.find(sprite => (sprite.x === snake.head.x && sprite.y === snake.head.y));
      snake.grow(snake.tail.dir);
      foods.splice(id, 1);
    }
  }
  // snake collision with Kiki
  if (snakeCoords.some(snakePart => compareCoordinates(snakePart, kiki)))
    ret = 1;
  snakeCoords.shift();
  // snake collision with self
  if (snakeCoords.some(snakePart => compareCoordinates(snakePart, snake.head)))
    ret = 2;
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
  } while (checkCollisions() !== 0);
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
}

// GAME
// setup the playfield
function updateScore(food) {
  if (food !== undefined)
    score.textContent = Number(score.textContent) + food.points;    
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
//	--> 0 if no collisions,  1 if snake/kiki collision, 2 if snake/snake collision, 3 if the snake gets stuck
function gameEnd(outcome) {
  if (outcome === 0)
    return ;
  const msg = ['Kiki died a painful death! You should be ashamed of yourself.',
	       'The snake has eaten itself. Here\'s an extra 200 points.',
	      'The snake got stuck !'];
  playfield.element.innerHTML = '';
  cells = [];
  cells.forEach(cell => cell.className = '');
  foods = [];
  kiki = new Sprite(5, 1, null, 'kiki');
  snake.head = new Sprite(0, 0, null, 'snake');
  snake.body = [];
  if (outcome === 2)
    score.textContent = Number(score.textContent) + 200;
  EOGscore.textContent = score.textContent;
  EOGmessage.textContent = msg[outcome - 1];
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
