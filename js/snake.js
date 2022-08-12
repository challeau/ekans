let snake = {
  head: new Sprite(0, 0, 'right', 'snake'),
  tail: new Sprite(0, 0, 'right', 'snake'),
  body: [],

  grow(direction) {
    let tailTarget;
    switch (direction){
    case 'left':
      tailTarget = new Sprite(this.tail.x - 1, this.tail.y);
      break;
    case 'right':
      tailTarget = new Sprite(this.tail.x + 1, this.tail.y);
      break;
    case 'up':
      tailTarget = new Sprite(this.tail.x, this.tail.y - 1);
      break;
    case 'down':
      tailTarget = new Sprite(this.tail.x, this.tail.y + 1);
      break;
    }
    const newBodyPart = new Sprite(this.tail.x, this.tail.y, 'snake', this.tail.dir);
    spriteMove(this.tail, tailTarget.x, tailTarget.y, 'snake-tail');
    cells[newBodyPart.y][newBodyPart.x].classList.add('cell', 'snake-body');
    this.body.push(newBodyPart);
  },

  move(targetX, targetY, direction) {
    const bodyLen = this.body.length;
    const newBodyPart = new Sprite(this.head.x, this.head.y, this.head.dir, 'snake');
    const lastBodyPart = new Sprite(this.body[bodyLen -1].x, this.body[bodyLen -1].y, this.body[bodyLen -1].dir, 'snake');

    // move head to target
    spriteMove(this.head, targetX, targetY, 'snake-head');
    // change last body part to tail
    cells[lastBodyPart.y][lastBodyPart.x].classList.remove('snake-body');
    spriteMove(this.tail, lastBodyPart.x, lastBodyPart.y, 'snake-tail');
    this.body.pop();
    // change old head spot to a body part
    cells[newBodyPart.y][newBodyPart.x].classList.add('cell', 'snake-body');
    this.body.unshift(newBodyPart);
    setTailDirection(this.tail, this.body);
    this.orient(direction);
  },

  orient(headDirection) {
    let bodyDirection = this.body[0].dir;
    if (bodyDirection !== headDirection){
      cells[this.body[0].y][this.body[0].x].setAttribute('curve', 'true');
      setCurveDirection(this.body[0], bodyDirection, headDirection);
    }
    cells[this.head.y][this.head.x].setAttribute('direction', headDirection);
    this.head.dir = headDirection;
  },

  autoTarget() {
    const potentialTargets = [... foods];
    potentialTargets.unshift(kiki);
    const closest = getClosestSprite(snake.head, potentialTargets);
    const target = getTargetSprite(snake.head, closest);
    console.log(`targetting ${closest.type} at ${closest.y}:${closest.x}
    curr: ${snake.head.y}:${snake.head.x}, nxt stp ${target.y}:${target.x}`);
    snake.move(target.x, target.y, target.dir);
    for (const food of foods){
      if (compareCoordinates(snake.head, food) === true){
	let id = foods.find(e => (e.x === snake.head.x && e.y === snake.head.y));
	foods.splice(id);
	snake.grow(snake.tail.dir);
      }
    }
    gameEnd(checkCollisions());
  }
};

function getTargetSprite(snakePos, target) {
  const directions = ['left', 'right', 'up', 'down'];
  const dist2Target = { x: snakePos.x - target.x, y: snakePos.y - target.y };
  const stepX = dist2Target.x > 0 ? snakePos.x - 1 : snakePos.x + 1;
  const stepY = dist2Target.y > 0 ? snakePos.y - 1 : snakePos.y + 1;
  let canMoveX = (stepX <= 9 && !compareCoordinates(snakePos, {x: stepX, y: snakePos.y}));
  let canMoveY = (stepY <= 9 && !compareCoordinates(snakePos, {x: snakePos.x, y: stepY}));

  snake.body.forEach(bodyPart => {
    if (compareCoordinates(bodyPart, {x: stepX, y: snakePos.y}) === true)
      canMoveX = false;
    if (compareCoordinates(bodyPart, {x: snakePos.x, y: stepY}) === true)
      canMoveY = false;
  });

  // furthest on X axis
  if (Math.abs(dist2Target.x) >= Math.abs(dist2Target.y)){
    if (canMoveX)
      return ({ x: stepX, y: snakePos.y, dir: directions[dist2Target.x > 0 ? 0 : 1] });
    else if (canMoveY)
      return ({ x: snakePos.x, y: stepY, dir: directions[dist2Target.y > 0 ? 2 : 3] });
  }
  // furthest on Y axis
  else {
    if (canMoveY)
      return ({ x: snakePos.x, y: stepY, dir: directions[dist2Target.y > 0 ? 2 : 3] });
    else if (canMoveX)
      return ({ x: stepX, y: snakePos.y, dir: directions[dist2Target.x > 0 ? 0 : 1] });
  }
  gameEnd(1);
}

