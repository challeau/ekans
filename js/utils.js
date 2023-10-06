/**
 * Returns a random number between two bounds.
 * @param {number} lowBound - lower limit.
 * @param {number} highBound - higher limit.
 * @returns {number}
 */
function getRandomNumber(lowBound, highBound) {
  const rand = Math.floor(Math.random() * (highBound - lowBound) + lowBound);
  return (rand);
}


/**
 * Checks if a cell is empty.
 * @param {number} x - the X coordinate of the cell.
 * @param {number} y - the Y coordinate of the cell.
 * @returns {boolean}
 */
function isCellEmpty(x, y, cells) {
  let cellClassList = cells[y][x].classList.value.replaceAll('cell', '').trim();
  return (cellClassList == "");
}


export {getRandomNumber, isCellEmpty};
