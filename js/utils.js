// return a random normal between lowBound and highBound
function getRandomNumber(lowBound, highBound) {
  const rand = Math.floor(Math.random() * (highBound - lowBound) + lowBound);
  return (rand);
}

// return true if both sprites have the same coordiantes
function compareCoordinates(sprite1, sprite2) {
  return ((sprite1.x === sprite2.x && sprite1.y === sprite2.y));
}

function isCellEmpty(cells, x, y) {
  let ret = cells[y][x].classList.length <= 1 ? true : false;
  console.log(ret, cells[y][x].classList);
  return (ret);
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
