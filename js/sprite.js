import {game} from "./main.js";


/**
 * A Sprite - represents an object in the game.
 * @classdesc
 */
class Sprite {
  /**
   * @class - Creates a new Sprite.
   * @param {number} x - the X coordinates of the sprite.
   * @param {number} y - the Y coordinates of the sprite.
   * @param {string} type - the type of sprite.
   * @param {string} dir - the direction the sprite is going.
   */
  constructor(x, y, type, dir=undefined) {
    this.x = x;
    this.y = y;
    this.dir = dir;
    this.type = type;
    game.cells[y][x].classList.add(this.type);
  }

  /**
   * Moves a sprite: resets the current cell's class and moves to target.
   * @param {number} targetX - the target's X coordinate.
   * @param {number} targetY - the target's Y coordinate.
   * @param {string} dir - the direction the sprite is going.
   */
  move(targetX, targetY, dir=undefined) {
    game.cells[this.y][this.x].classList.remove(this.type);
    game.cells[this.y][this.x].setAttribute('curve', 'false');

    this.x = targetX;
    this.y = targetY;
    game.cells[targetY][targetX].classList.add(this.type, 'cell');

    if (dir){
      this.dir = dir;
      game.cells[this.y][this.x].setAttribute('direction', dir);
    }

    if (this.type == "kiki")
      game.checkForCollisions();
  }
}

export {Sprite};