/**
 * Sets a body part's direction according to the Snake's general direction.
 * @param {Sprite} bodyPart - The body part to curve.
 * @param {number} headDirection - The direction the Snake's head is going.
 * @param {[Element]} cells - The playfield's cells.
 */
function setCurveDirection(bodyPart, headDirection, cells) {
    let curveDirection;

    switch (bodyPart.dir){
    case dir.left:
	if (headDirection == dir.up)
	    curveDirection = dir.up;
	if (headDirection == dir.down)
	    curveDirection = dir.right;
	break;
    case dir.right:
	if (headDirection == dir.up)
	    curveDirection = dir.left;
	if (headDirection == dir.down)
	    curveDirection = dir.down;
	break;
    case dir.up:
	if (headDirection == dir.right)
	    curveDirection = dir.right;
	else if (headDirection == dir.left)
	    curveDirection = dir.down;
	break;
    case dir.down:
	if (headDirection == dir.left)
	    curveDirection = dir.left;
	else if (headDirection == dir.right)
	    curveDirection = dir.up;
	break;
    }

    cells[bodyPart.y][bodyPart.x].setAttribute("direction", curveDirection);
    bodyPart.dir = curveDirection;
}


/**
 * Sets the tail's direction according to the Snake's body direction.
 * @param {Sprite} tail - the snake's tail.
 * @param {[Sprite]} body - the snake's body.
 * @param {[Element]} cells - The playfield's cells.
 */
function setTailDirection(tail, body, cells) {
    let direction = "";
    let diffX = tail.x - body[body.length - 1].x;
    let diffY = tail.y - body[body.length - 1].y;

    if (diffX === 0)
	direction = diffY > 0 ? dir.up : dir.down;
    else if (diffY === 0)
	direction = diffX > 0 ? dir.left : dir.right;

    cells[tail.y][tail.x].setAttribute("direction", direction);
    tail.dir = direction;
}


/**
 * Returns the closest Sprite to the source Sprite from a list.
 * @param {Sprite} srcSprite - the source Sprite.
 * @param {[Sprite]} potentialtargets - the list of Sprites to pick from.
 * @returns {Sprite}
 */
function getClosestSprite(srcSprite, potentialTargets) {
    let min = Infinity;
    let deltaX = 0;
    let deltaY = 0;
    let closest;

    for (const target of potentialTargets){
	deltaX = Math.abs(srcSprite.x - target.x);
	deltaY = Math.abs(srcSprite.y - target.y);

	if (deltaX + deltaY > min || (deltaX == 0 && deltaY == 0))
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
 * Returns the cells around the snake's head that are free of snake parts.
 * @param {Sprite} head - The snake's head.
 * @param {[Element]} cells - The playfield's cells.
 * @returns {[{x: number, y: number, dir: number}]} The free cells coordinates.
 *  _____  _____  _____  _____
 * |A .  ||A ^  ||A _  ||A_ _ |
 * | / \ || / \ || ( ) ||( v )|
 * |(_ _)|| \ / ||(_'_)|| \ / |
 * |  |  ||  v  ||  |  ||  v  |
 * |____V||____V||____V||____V|
 */
function getSurroundingFreeCells(head, cells, playfield) {
    let surroundingCells = [];

    if (head.x > 0)
	surroundingCells.push({x: head.x - 1, y: head.y, dir: dir.left});
    if (head.x < playfield.rows -1)
	surroundingCells.push({x: head.x + 1, y: head.y, dir: dir.right});
    if (head.y > 0)
	surroundingCells.push({x: head.x, y: head.y - 1, dir: dir.up});
    if (head.y < playfield.rows -1)
	surroundingCells.push({x: head.x, y: head.y + 1, dir: dir.down});

    let freeCells = surroundingCells.filter(cell => {
	let classList = cells[cell.y][cell.x].classList.value;
	return classList.match(/snake/) == null;
    });

    return freeCells;
}

/**
 * Computes and returns the next coordinates to reach to move the Snake closer
 * to the target.
 * @param {Sprite} target - The snake's target.
 * @param {Sprite} head - The snake's head.
 * @param {[Element]} cells - The playfield's cells.
 * @param {Object} playfield.
 * @returns { {x: number, y: number, dir: string} } The coordinates and
 *						direction of the next move,
 *						or null if the snake is stuck.
 */
function getNextCoordinates(target, head, cells, playfield) {
    let freeCells = getSurroundingFreeCells(head, cells, playfield);

    if (!freeCells)
	return null;

    let targetCell = freeCells.find(cell => cell.x == target.x && cell.y == target.y);
    if (targetCell)
	return targetCell;

    let closest = null;
    let deltaX, deltaY = 0;
    let min = Infinity;
    for (const cell of freeCells){
	deltaX = Math.abs(cell.x - target.x);
	deltaY = Math.abs(cell.y - target.y);

	if (deltaX + deltaY > min || (deltaX == 0 && deltaY == 0))
	    continue;

	min = deltaX + deltaY;
	closest = cell;
    }

    return closest;
}


export {setCurveDirection, setTailDirection, getClosestSprite, getNextCoordinates};
