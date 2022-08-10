// return a random normal between lowBound and highBound
function getRandomNumber(lowBound, highBound) {
  const rand = Math.floor(Math.random() * (highBound - lowBound) + lowBound);
  return (rand);
}

// return true if both sprites have the same coordiantes
function checkCoords(sprite1, sprite2) {
  return (sprite1.x === sprite2.x && sprite1.y === sprite2.y);
}
