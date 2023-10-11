/**
 * Returns a random number between two bounds.
 * @param {number} lowBound - The lower limit.
 * @param {number} highBound - The higher limit.
 * @returns {number}
 */
function getRandomNumber(lowBound, highBound) {
    const rand = Math.floor(Math.random() * (highBound - lowBound) + lowBound);
    return (rand);
}


/**
 * Checks if a cell is empty.
 * @param {number} x - The X coordinate of the cell.
 * @param {number} y - The Y coordinate of the cell.
 * @param {[Element]} cells - The playfield's cells.
 * @returns {boolean}
 */
function isCellEmpty(x, y, cells) {
    let cellClassList = cells[y][x].classList.value.replaceAll("cell", "").trim();
    return (cellClassList == "");
}


export {getRandomNumber, isCellEmpty};
