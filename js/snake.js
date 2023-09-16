import {Sprite} from "./sprite.js";
import {getRandomNumber, compareCoordinates, checkForCollisions} from "./utils.js";
import * as utils from "./snake-utils.js";
import {endGame} from "./game.js";

export class Snake {
  constructor(playfield) {
    let x = getRandomNumber(2, playfield.columns);
    let y = getRandomNumber(0, playfield.rows);

    this.head = new Sprite(
      x,
      y,
      'right',
      'snake-head');

    this.tail = new Sprite(
      this.head.x - 1,
      this.head.y,
      'right',
      'snake-tail');

    this.body = [];
  }

  /* Adds a body part to the snake to make him longer according to the direction.  */
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

    // put a new body part instead of the tail
    const newBodyPart = new Sprite(this.tail.x, this.tail.y, this.tail.dir, 'snake-body');
    this.body.push(newBodyPart);

    // move the tail 1 tile torwards direction
    this.tail.move(tailTarget.x, tailTarget.y);
    utils.setTailDirection(this.tail, this.body);
  }

  move(targetX, targetY, direction) {
    const bodyLen = this.body.length;
    const newBodyPart = new Sprite(this.head.x, this.head.y, this.head.dir, 'snake');
    const lastBodyPart = new Sprite(this.body[bodyLen -1].x, this.body[bodyLen -1].y, this.body[bodyLen -1].dir, 'snake');

    // move head to target
    this.head.move(targetX, targetY);

    // change last body part to tail
    cells[lastBodyPart.y][lastBodyPart.x].classList.remove('snake-body');
    this.tail.move(lastBodyPart.x, lastBodyPart.y);
    this.body.pop();

    // change old head spot to a body part
    cells[newBodyPart.y][newBodyPart.x].classList.add('cell', 'snake-body');
    this.body.unshift(newBodyPart);

    utils.setTailDirection(this.tail, this.body);
    this.orient(direction);
  }

  orient(headDirection) {
    let bodyDirection = this.body[0].dir;

    if (bodyDirection !== headDirection){
      cells[this.body[0].y][this.body[0].x].setAttribute('curve', 'true');
      utils.setCurveDirection(this.body[0], bodyDirection, headDirection);
    }

    cells[this.head.y][this.head.x].setAttribute('direction', headDirection);
    this.head.dir = headDirection;
  }

  autoTarget(kiki, foods) {
    const potentialTargets = [... foods];
    potentialTargets.unshift(kiki);

    const closest = utils.getClosestSprite(this.head, potentialTargets);

    const target = utils.getNextCoordinates(closest, this);
    if (!target)
      return (3);  // no target == snake is stuck == outcome 3

    console.log(`targetting ${closest.type} at ${closest.y}:${closest.x}
    curr: ${this.head.y}:${this.head.x}, nxt stp ${target.y}:${target.x}`);

    this.move(target.x, target.y, target.dir);

    return (checkForCollisions(kiki, this, foods));
  }
}
