import {compareCoordinates} from "./utils.js";


/**
 * Sets a body part's direction according to the snkae's general direction.
 * @param {Sprite} bodyPart - the body part to curve.
 * @param {string} headDirection - the direction the snake's head is going.
 */
function setCurveDirection(bodyPart, headDirection) {
  let direction;

  switch (bodyPart[0]+headDirection){
  case "left"+"down":
  case "up"+"right":
    direction = "right";
    break;
  case "right"+"down":
  case "up"+"left":
    direction = "down";
    break;
  case "right"+"up":
  case "down"+"left":
    direction = "left";
    break;
  case "down"+"right":
  case "left"+"up":
    direction = "up";
    break;
  }

  cells[bodyPart.y][bodyPart.x].setAttribute('direction', direction);
  bodyPart.dir = direction;
}


/**
 * Sets the tail's direction according to the snake's body direction.
 * @param {Sprite} tail - the snake's tail.
 * @param {[Sprite]} body - the snake's body.
 */
function setTailDirection(tail, body) {
  let direction = "";
  let diffX = tail.x - body[body.length - 1].x;
  let diffY = tail.y - body[body.length - 1].y;

  if (diffX === 0)
    direction = diffY > 0 ? "up" : "down";
  else if (diffY === 0)
    direction = diffX > 0 ? "left" : "right";

  cells[tail.y][tail.x].setAttribute('direction', direction);
  tail.dir = direction;

  if (!cells[tail.y][tail.x].classList.contains('snake-tail'))
    cells[tail.y][tail.x].classList.add('snake-tail');
}


/**
 * Returns the closest Sprite to the source Sprite from a list.
 * @param {Sprite} srcSprite - the source Sprite.
 * @param {[Sprite]} potentialtargets - the list of Sprites to pick from.
 */
function getClosestSprite(srcSprite, potentialTargets) {
  let min = Infinity;
  let deltaX = 0;
  let deltaY = 0;
  let closest;

  for (const target of potentialTargets){
    deltaX = Math.abs(srcSprite.x - target.x);
    deltaY = Math.abs(srcSprite.y - target.y);

    if (deltaX + deltaY > min)
      continue;

    // we don't want to target food unless it's close by
    if (target.type == "kiki" || deltaX + deltaY < 3){
      min = deltaX + deltaY;
      closest = target;
    }
  }

  return (closest);
}


/**
 * Computes and returns the next coordinates to reach  to move the snake closer
 * to the target.
 * @param {Sprite} target - the snake's target.
 * @param {Sprite} snakeHead - the snake's head.
 */
function getNextCoordinates(target, snakeHead) {
  const dist2Target = { x: snakeHead.x - target.x, y: snakeHead.y - target.y };
  let stepX = dist2Target.x > 0 ? snakeHead.x - 1 : snakeHead.x + 1;
  let stepY = dist2Target.y > 0 ? snakeHead.y - 1 : snakeHead.y + 1;
  let furthest = Math.abs(dist2Target.x) >= Math.abs(dist2Target.y) ? 'x' : 'y';

  // check if the snake can move along the x or y axis
  let canMoveX, canMoveY = false;
  let targetCellX = cells[snakeHead.y][stepX];
  let targetCellY = cells[stepY][snakeHead.x];

  if (stepX < playfield.columns && !targetCellX.classList.value.match(/snake/))
    canMoveX = true;

  if (stepY < playfield.rows && !targetCellY.classList.value.match(/snake/))
    canMoveY = true;

  if (!canMoveX && !canMoveY){
    stepX = dist2Target.x < 0 ? snakeHead.x - 1 : snakeHead.x + 1;
    stepY = dist2Target.y > 0 ? snakeHead.y - 1 : snakeHead.y + 1;
    furthest = Math.abs(dist2Target.x) >= Math.abs(dist2Target.y) ? 'x' : 'y';
    targetCellX = cells[snakeHead.y][stepX];
    targetCellY = cells[stepY][snakeHead.x];

    if (stepX <= playfield.columns && !targetCellX.classList.value.match(/snake/))
      canMoveX = true;

    if (stepY <= playfield.rows && !targetCellY.classList.value.match(/snake/))
      canMoveY = true;
  }

  // determine next move
  if (canMoveY && furthest == 'x' || !canMoveY)
    return ({ x: stepX, y: snakeHead.y, dir: dist2Target.x > 0 ? "left" : "right"});

  else if (canMoveY)
    return ({ x: snakeHead.x, y: stepY, dir: dist2Target.y > 0 ? "up" : "down"});

  return null;
}


export {setCurveDirection, setTailDirection, getClosestSprite, getNextCoordinates};
