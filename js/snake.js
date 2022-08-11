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
    const newBodyPart = { x: this.tail.x, y: this.tail.y };
    spriteMove(this.tail, tailTarget.x, tailTarget.y, 'snake-tail');
    cells[newBodyPart.y][newBodyPart.x].classList.add('cell', 'snake-body');
    this.body.push(newBodyPart);
  },

  move(targetX, targetY, direction) {
    const bodyLen = this.body.length;
    const newBodyPart = new Sprite(this.head.x, this.head.y, this.head.dir, 'snake');
    const lastBodyPart = new Sprite(this.body[bodyLen -1].x, this.body[bodyLen -1].y, this.body[bodyLen -1].dir, snake);

    // move head to target
    spriteMove(this.head, targetX, targetY, 'snake-head');
    // change last body part to tail
    cells[lastBodyPart.y][lastBodyPart.x].classList.remove('snake-body');
    spriteMove(this.tail, lastBodyPart.x, lastBodyPart.y, 'snake-tail');
    this.body.pop();
    // change old head spot to a body part
    cells[newBodyPart.y][newBodyPart.x].classList.add('cell', 'snake-body');
    this.body.unshift(newBodyPart);
    this.orient(direction, newBodyPart);
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
    snake.move(target.x, target.y, target.dir);
    for (const food of foods){
      if (compareCoordinates(snake.head, food) === true)
	snake.grow(snake.tail.dir);
    }
    gameEnd(checkCollisions());
  }
};
