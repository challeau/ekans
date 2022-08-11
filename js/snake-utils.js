function setCurveDirection(bodyPart, bodyDirection, headDirection) {
  let direction = '';
  if ((bodyDirection === 'left'&& headDirection === 'down')
      || (bodyDirection === 'up'&& headDirection === 'right'))
    direction = 'right';
    if ((bodyDirection === 'right'&& headDirection === 'down')
      || (bodyDirection === 'up'&& headDirection === 'left'))
    direction = 'down';
  if ((bodyDirection === 'right'&& headDirection === 'up')
      || (bodyDirection === 'down'&& headDirection === 'left'))
    direction = 'left';
  if ((bodyDirection === 'down'&& headDirection === 'right')
      || (bodyDirection === 'left'&& headDirection === 'up'))
    direction = 'up';

  cells[bodyPart.y][bodyPart.x].setAttribute('direction', direction);
  bodyPart.dir = direction;
}


function getClosestSprite(srcSprite, potentialTargets) {
  let min = Infinity;
  let dist = { x: 0, y: 0 };
  let closest = {};
  for (const target of potentialTargets){
    dist.x = Math.abs(srcSprite.x - target.x);
    dist.y = Math.abs(srcSprite.y - target.y);
    if (dist.x < min || dist.y < min){
      if (target.type === 'food' && Math.min(dist.y, dist.x) > 3)
	continue ;
      min = Math.min(dist.y, dist.x);
      closest = target;
    }
  }
  return (closest);
}

function getTargetSprite(snakePos, target) {
  const directions = ['left', 'right', 'up', 'down'];
  const dist2Target = { x: snakePos.x - target.x, y: snakePos.y - target.y };
  const stepX = dist2Target.x > 0 ? snakePos.x - 1 : snakePos.x + 1;
  const stepY = dist2Target.y > 0 ? snakePos.y - 1 : snakePos.y + 1;
  const canMoveX = (stepX <= 9 && !compareCoordinates(snakePos, {x: stepX, y: snakePos.y}));
  const canMoveY = (stepY <= 9 && !compareCoordinates(snakePos, {x: snakePos.x, y: stepY}));

  console.log(canMoveX, canMoveY);
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
  gameEnd(3);
}
