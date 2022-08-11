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

    this.orient(direction, newBodyPart);
    checkCollisions();
  },
  orient(headDirection) {
    let bodyDirection = cells[this.body[0].y][this.body[0].x].getAttribute('direction');
    if (bodyDirection !== headDirection){
      cells[this.body[0].y][this.body[0].x].setAttribute('curve', 'true');
      if ((bodyDirection === 'left'&& headDirection === 'down')
    	  || (bodyDirection === 'up'&& headDirection === 'right'))
    	cells[this.body[0].y][this.body[0].x].setAttribute('direction', 'right');
      if ((bodyDirection === 'right'&& headDirection === 'down')
    	  || (bodyDirection === 'up'&& headDirection === 'left'))
    	cells[this.body[0].y][this.body[0].x].setAttribute('direction', 'down');
      if ((bodyDirection === 'right'&& headDirection === 'up')
    	  || (bodyDirection === 'down'&& headDirection === 'left'))
    	cells[this.body[0].y][this.body[0].x].setAttribute('direction', 'left');
      if ((bodyDirection === 'down'&& headDirection === 'right')
    	  || (bodyDirection === 'left'&& headDirection === 'up'))
    	cells[this.body[0].y][this.body[0].x].setAttribute('direction', 'up');
    }
    cells[this.head.y][this.head.x].setAttribute('direction', headDirection);
  },
  autoTarget() {
    const directions = ['left', 'right', 'up', 'down'];
    const dist2Target = { x: snake.head.x - kiki.x, y: snake.head.y - kiki.y };
    const stepX = dist2Target.x > 0 ? snake.head.x - 1 : snake.head.x + 1;
    const stepY = dist2Target.y > 0 ? snake.head.y - 1 : snake.head.y + 1;
    const canMoveX = !checkCoords(snake.body[0], {x: stepX, y: snake.head.y});
    const canMoveY = !checkCoords(snake.body[0], {x: snake.head.x, y: stepY});
    // furthest on X axis
    if (Math.abs(dist2Target.x) > Math.abs(dist2Target.y) && canMoveX)
      snake.move(stepX, snake.head.y, directions[dist2Target.x > 0 ? 0 : 1]);
    // furthest on Y axis OR can't move on X axis
    else if (canMoveY)
      snake.move(snake.head.x, stepY, directions[dist2Target.y > 0 ? 2 : 3]);
    // furthest on Y axis but can't move on Y axis
    else if (canMoveX)
      snake.move(stepX, snake.head.y, directions[dist2Target.x > 0 ? 0 : 1]);
  }
};
