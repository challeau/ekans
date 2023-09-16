import {Food} from "./food.js";
import {Sprite} from "./sprite.js";
import {Snake} from "./snake.js";
import {getRandomNumber, checkForCollisions} from "./utils.js";

// DOM OBJECTS
const startBtn = document.getElementById("start-btn");
const score = document.querySelector('#score p');
const EOGpannel = document.getElementById("EOG-pannel");
const EOGmessage = document.getElementById("msg");
const EOGscore = document.querySelector("#EOG-pannel h2 span");

// GAME INTERVALS
let snakeInterval;
let foodInterval;

let foods = [];


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
  let kiki = new Sprite(5, 1, "right", "kiki");
  cells[kiki.y][kiki.x].classList.add("kiki");

  let snake = new Snake(playfield);
  
  cells[snake.head.y][snake.head.x].classList.add("snake-head");
  cells[snake.tail.y][snake.tail.x].classList.add("snake-tail");
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
    let newFood = new Food(cells);
    foods.push(newFood);
  }, getRandomNumber(2000, 6000));

  snakeInterval = setInterval(() => {
    let collision = snake.autoTarget(kiki, foods);
    if (collision){
      endGame(collision, kiki, snake);
    }
  }, 500);
  
  playfield.element.style.display = "grid";
  EOGpannel.style.display = "none";
  score.textContent = 0;

  return [kiki, snake];
}


export {startGame, endGame};