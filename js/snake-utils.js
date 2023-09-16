import {compareCoordinates} from "./utils.js";


/* Sets bodypart.direction according to the snkae's general direction. */
function setCurveDirection(bodyPart, bodyDirection, headDirection) {
  let direction;

  switch (bodyDirection+headDirection){
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


/* Sets tail.dir according to the snake's body direction. */
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
}


/* Returns the closest Sprite to the srcSprite.  */
function getClosestSprite(srcSprite, potentialTargets) {
  let min = Infinity;
  let dist = { x: 0, y: 0 };
  let closest;

  for (const target of potentialTargets){
    dist.x = Math.abs(srcSprite.x - target.x);
    dist.y = Math.abs(srcSprite.y - target.y);

    if (dist.x > min && dist.y > min)
      continue;

    // we don't want to target food unless it's close by
    if (target.type == "kiki" || Math.min(dist.y, dist.x) < 4){
      min = Math.min(dist.y, dist.x);
      closest = target;
    }
  }

  return (closest);
}


/* Computes and returns the coordinates to move the snake closer to the target. */
function getNextCoordinates(target, snake) {
  const dist2Target = { x: snake.head.x - target.x, y: snake.head.y - target.y };
  const stepX = dist2Target.x > 0 ? snake.head.x - 1 : snake.head.x + 1;
  const stepY = dist2Target.y > 0 ? snake.head.y - 1 : snake.head.y + 1;
  const furthest = Math.abs(dist2Target.x) >= Math.abs(dist2Target.y) ? 'x' : 'y';

  // check if the snake can move along the x or y axis
  let canMoveX = (stepX <= 9 && !compareCoordinates(snake.head, {x: stepX, y: snake.head.y}));
  let canMoveY = (stepY <= 9 && !compareCoordinates(snake.head, {x: snake.head.x, y: stepY}));

  snake.body.forEach(bodyPart => {
    if (compareCoordinates(bodyPart, {x: stepX, y: snake.head.y}) === true)
      canMoveX = false;
    if (compareCoordinates(bodyPart, {x: snake.head.x, y: stepY}) === true)
      canMoveY = false;
  });

  // determine next move
  if (canMoveX && furthest == 'x' || !canMoveY)
    return ({ x: stepX, y: snake.head.y, dir: dist2Target.x > 0 ? "left" : "right"});

  if (canMoveY && furthest == 'y')
    return ({ x: snake.head.x, y: stepY, dir: dist2Target.y > 0 ? "up" : "down"});

  return null;
}


export {setCurveDirection, setTailDirection, getClosestSprite, getNextCoordinates};
