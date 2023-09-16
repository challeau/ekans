class Sprite {
  constructor(x, y, dir, type) {
    this.x = x;
    this.y = y;
    this.dir = dir;
    this.type = type;
    cells[y][x].classList.add(this.type);
  }

  /* Moves a sprite: resets the current cell's class and moves to target. */
  move(targetX, targetY, dir=undefined) {
    cells[this.y][this.x].className = 'cell';
    cells[this.y][this.x].setAttribute('curve', 'false');

    this.x = targetX;
    this.y = targetY;
    cells[targetY][targetX].classList.add(this.type, 'cell');

    if (dir){
      this.dir = dir;
      cells[this.y][this.x].setAttribute('direction', dir);
    }
  }
}

export {Sprite};