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
      if ((target.type === 'food' && Math.min(dist.y, dist.x) < 3) || target.type === 'kiki'){
	min = Math.min(dist.y, dist.x);
	closest = target;
      }
    }
  }
  return (closest);
}
