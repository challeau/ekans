import {Food} from "./food.js";
import {Sprite} from "./sprite.js";
import {Snake} from "./snake.js";
import {getRandomNumber, checkForCollisions, isCellEmpty} from "./utils.js";

// DOM OBJECTS
const startBtn = document.getElementById("start-btn");
const score = document.querySelector('#score p');
const EOGpannel = document.getElementById("EOG-pannel");
const EOGmessage = document.getElementById("msg");
const EOGscore = document.querySelector("#EOG-pannel h2 span");

// GAME INTERVALS
let snakeInterval;
let foodInterval;


/* Fills the playfield grid with cells. */
function setUpGrid() {
  for (let y = 0; y < playfield.rows; y++) {
    cells.push([]);

    for (let x = 0; x < playfield.columns; x++){
      let div = document.createElement("div");
      div.classList.add("cell");
      div.dataset.x = x;
      div.dataset.y = y;

      playfield.element.append(div);
      cells[y].push(div);
    }
  }
}


/* Generates the snake and Kiki sprites and places them at random on the board. */
function setUpSprites() {
  let kiki = new Sprite(5, 1, "kiki", "right");

  let snake = new Snake(playfield);
  snake.grow("left");

  return [kiki, snake];
}


/*
** Ends a game:
*/
function endGame(outcome, kiki, snake) {
  if (outcome === 0)
    return ;

  const msgs = ["Kiki died a painful death! You should be ashamed of yourself.",
		"The snake has eaten itself. Here's an extra 200 points.",
		"The snake got stuck !"];

  clearInterval(snakeInterval);
  clearInterval(foodInterval);

  playfield.element.innerHTML = "";
  playfield.element.style.display = "none";

  cells.forEach(cell => cell.className = "");
  cells = [];

  foods = [];
  kiki = snake = undefined;

  if (outcome === 2)
    score.textContent = Number(score.textContent) + 200;

  EOGscore.textContent = score.textContent;
  EOGmessage.textContent = msgs[outcome - 1];
  EOGpannel.style.display = "flex";
  
  startBtn.textContent = "Restart";
}

/*
** Starts a game:
**    - set up the playfield grid,
**    - set up the sprites,
**    - set up the food and snake's intervals,
**    - display the gird.
**
** Return: the kiki and snake objects.
*/
function startGame() {
  setUpGrid(playfield, cells);

  let [kiki, snake] = setUpSprites(playfield, cells);

  foodInterval = setInterval(() => {
    let foodType = getRandomNumber(0, 4) ? "apple" : "carrot";
    let x, y;

    do {
      x = getRandomNumber(0, playfield.columns);
      y = getRandomNumber(0, playfield.rows);
    } while (isCellEmpty(x, y) === false);

    let newFood = new Sprite(x, y, foodType);
    foods.push(newFood);
  }, getRandomNumber(5000, 6000));

  snakeInterval = setInterval(() =>  snake.autoTarget(kiki, foods), 600);
  
  playfield.element.style.display = "grid";
  EOGpannel.style.display = "none";
  score.textContent = 0;

  return [kiki, snake];
}


export {startGame, endGame};
