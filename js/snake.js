import {Sprite} from "./sprite.js";
import {getRandomNumber} from "./utils.js";
import * as utils from "./snake-utils.js";
import {game} from "./main.js";


/**
 * A Snake - set of Sprites that follows the player.
 * @classdesc
 */
export class Snake {

  /**
   * @class - Creates a new Snake.
   * @param { {columns: number, rows: number} } game.playfield.
   */
  constructor() {
    let x = getRandomNumber(2, game.playfield.columns);
    let y = getRandomNumber(0, game.playfield.rows);

    this.head = new Sprite(x, y, 'snake-head', dir.right);
    this.tail = new Sprite(this.head.x - 1, this.head.y, 'snake-tail', dir.right);
    this.body = [];
  }

  /**
   * Adds a body part to the snake according to the direction.
   * @param {string} direction - the direction where the snake is headed.
   */
  grow(direction) {
    console.log('grow', this.tail.dir);
    let tailTarget;

    switch (direction){
    case dir.right:
      tailTarget = {x: this.tail.x - 1, y: this.tail.y};
      break;
    case dir.left:
      tailTarget = {x: this.tail.x + 1, y: this.tail.y};
      break;
    case dir.down:
      tailTarget = {x: this.tail.x, y: this.tail.y - 1};
      break;
    case dir.up:
      tailTarget = {x: this.tail.x, y: this.tail.y + 1};
      break;
    }

    // create a new body part where the tail is
    const newBodyPart = new Sprite(this.tail.x, this.tail.y, 'snake-body', this.tail.dir);
    this.body.push(newBodyPart);

    // move the tail 1 tile torwards direction
    this.tail.move(tailTarget.x, tailTarget.y, direction);

    // set new tail direction
    utils.setTailDirection(this.tail, this.body, game.cells);
  }

  /**
   * Moves the snake to the target.
   * @param {number} targetX - the X coordinate of the target.
   * @param {number} targetY - the Y coordinate of the target.
   */
  move(targetX, targetY) {
    const newBodyPart = new Sprite(this.head.x, this.head.y, 'snake-body', this.head.dir);
    const lastBodyPart =  this.body.pop();

    // change last body part to tail
    game.cells[lastBodyPart.y][lastBodyPart.x].classList.remove('snake-body');
    this.tail.move(lastBodyPart.x, lastBodyPart.y);

    // move head to target
    this.head.move(targetX, targetY);
 
    // change old head spot to a body part
    game.cells[newBodyPart.y][newBodyPart.x].classList.add('cell', 'snake-body');
    this.body.unshift(newBodyPart);

    utils.setTailDirection(this.tail, this.body, game.cells);
  }

  /**
   * Sets the orientation of the first body part. If the head changed direction,
   * set it to a curve too.
   * @param {string} headDirection - the direction of the head after moving.
   */
  orient(headDirection) {
    if (this.body[0].dir !== headDirection){
      game.cells[this.body[0].y][this.body[0].x].setAttribute('curve', 'true');
      utils.setCurveDirection(this.body[0], headDirection, game.cells);
    }

    game.cells[this.head.y][this.head.x].setAttribute('direction', headDirection);
    this.head.dir = headDirection;
  }

  /**
   * Determines the snake's target and computes the next step to get closer to the target.
   * @param {Sprite} kiki - the Kiki object.
   * @param {[Sprite]} foods - an array of the game.playfield's food objects.
   */
  autoTarget() {
    const potentialTargets = [game.kiki, ...game.foods];
    const target = utils.getClosestSprite(this.head, potentialTargets);

    const nextCell = utils.getNextCoordinates(target, this.head, game.cells, game.playfield);
    if (!nextCell)
      game.end(2);  // no target cell == snake is stuck == outcome 3

    console.log(`targetting ${target.type} at ${target.y}:${target.x}
    curr: ${this.head.y}:${this.head.x}, nxt stp ${nextCell.y}:${nextCell.x}`);

    this.move(nextCell.x, nextCell.y);
    this.orient(this.head.dir);
  }
}
