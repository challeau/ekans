import {Sprite} from "./sprite.js";
import {getRandomNumber} from "./utils.js";
import * as utils from "./snake-utils.js";
import {game} from "./main.js";


/**
 * A Snake - Set of Sprites that follows the player.
 * @classdesc
 */
export class Snake {

    constructor() {
	let x = getRandomNumber(2, game.playfield.columns - 1);
	let y = getRandomNumber(2, game.playfield.rows);

	this.head = new Sprite(x, y, "snake-head", dir.right);
	this.tail = new Sprite(this.head.x - 1, this.head.y, "snake-tail", dir.right);
	this.body = [];
    }

    /**
     * Adds a body part to the snake.
     * @param {string} direction - The direction where the Snake is headed.
     */
    grow(direction) {
	let tailTarget;
	const bodyTarget = {x: this.tail.x, y: this.tail.y};

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

	// move the tail 1 tile torwards direction
	this.tail.move(tailTarget.x, tailTarget.y, direction);

	// create a new body part where the tail is
	const newBodyPart = new Sprite(bodyTarget.x, bodyTarget.y, "snake-body", direction);
	this.body.push(newBodyPart);

	// set new tail direction
	utils.setTailDirection(this.tail, this.body, game.cells);

	// speed up the snake
	game.speedModifier -= 0.5;
    }

    /**
     * Moves the snake to the target.
     * @param {number} targetX - The X coordinate of the target.
     * @param {number} targetY - The Y coordinate of the target.
     */
    move(targetX, targetY, direction) {
	// move head to target
	const headPos = {x: this.head.x, y: this.head.y, dir: this.head.dir};
	this.head.move(targetX, targetY, direction);

	// change last body part to tail
	const lastBodyPart =  this.body.pop();
	game.cells[lastBodyPart.y][lastBodyPart.x].classList.remove("snake-body");
	this.tail.move(lastBodyPart.x, lastBodyPart.y);
	
	// change old head spot to a body part
	const newBodyPart = new Sprite(headPos.x, headPos.y, "snake-body", headPos.dir);
	game.cells[newBodyPart.y][newBodyPart.x].classList.add("cell", "snake-body");
	this.body.unshift(newBodyPart);
    }

    /**
     * Sets the orientation of the first body part and the tail.
     * If the head changed direction, set the first body part to a curve.
     * @param {number} headDirection - The direction of the head after moving.
     */
    orient(headDirection) {
	utils.setTailDirection(this.tail, this.body, game.cells);

	if (this.body[0].dir !== headDirection){
	    game.cells[this.body[0].y][this.body[0].x].setAttribute("curve", "true");
	    utils.setCurveDirection(this.body[0], headDirection, game.cells);
	}
    }

    /**
     * Determines the Snake's target and computes the next step to get closer to the target.
     */
    autoTarget() {
	const potentialTargets = [game.kiki, ...game.foods];
	const target = utils.getClosestSprite(this.head, potentialTargets);

	const nextCell = utils.getNextCoordinates(target, this.head, game.cells, game.playfield);

	if (!nextCell){
	    game.end(2);  // no target cell == snake is stuck
	    return;
	}

	console.log(`targetting ${target.type} at ${target.y}:${target.x}
    curr: ${this.head.y}:${this.head.x}, nxt stp ${nextCell.y}:${nextCell.x}`);

	this.move(nextCell.x, nextCell.y, nextCell.dir);
	this.orient(this.head.dir);
    }
}
