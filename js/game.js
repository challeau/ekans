import {Sprite} from "./sprite.js";
import {Snake} from "./snake.js";
import {getRandomNumber, isCellEmpty} from "./utils.js";


/**
 * Set of objects and mecanics for a game.
 * @classdesc
 */
export class Game {
    constructor(){
	// DOM OBJECTS
	this.startBtn = document.getElementById("start-btn");
	this.score = document.querySelector("#score");
	this.EOGpannel = document.getElementById("EOG-pannel");
	this.EOGmessage = document.getElementById("msg");
	this.EOGscore = document.querySelector("#EOG-pannel h2 span");

	// playfield
	this.playfield = {
	    element: document.getElementById("playfield"),
	    background: document.getElementById("playfield-background"),
	    columns: 10,
	    rows: 10
	};
	
	this.cells = [];

	// food Sprites
	this.foods = [];

	this.setUpBackground();
    }

    setUpBackground() {
	let backgrounds = ["grass", "white", "grass", "grass", "grass",
			   "grass", "grass", "pink1", "grass", "grass", "pink2"];
	for (let y = 0; y < 5; y++) {
	    for (let x = 0; x < 5; x++){
		let div = document.createElement("div");
		let bg = backgrounds[getRandomNumber(0, 200) % 11];
		div.classList.add(bg);

		this.playfield.background.append(div);
	    }
	}
    }

    /**
     * Fills the playfield grid with cells.
     */
    setUpGrid() {
	for (let y = 0; y < this.playfield.rows; y++) {
	    this.cells.push([]);

	    for (let x = 0; x < this.playfield.columns; x++){
		let div = document.createElement("div");
		div.classList.add("cell");
		div.dataset.x = x;
		div.dataset.y = y;

		this.playfield.element.append(div);
		this.cells[y].push(div);
	    }
	}
    }

    /**
     * Generates the Snake and Kiki sprites and places them on the board.
     */
    setUpSprites() {
	this.kiki = new Sprite(5, 1, "kiki", dir.right);

	this.snake = new Snake();
	this.snake.grow(dir.right);
    }


    /**
     * Checks for collisions between the Snake and Kiki, the Snake and food
     * and Kiki and food.
     * @param {boolean} snakeMove - Do we check collisions after a Snake move?
     */
    checkForCollisions(snakeMove=false) {
	for (let x of Array(this.playfield.columns).keys()){
	    for (let y of Array(this.playfield.rows).keys()){
		let classList = this.cells[y][x].classList.value;
		let kikiMatch = classList.match(/kiki/);
		let foodMatch = classList.match(/carrot|apple/);
		let snakeMatch = classList.match(/snake-head|snake-tail|snake-body/g);

		if (!kikiMatch && !foodMatch && !snakeMatch)
		    continue;

		if (foodMatch && (kikiMatch || snakeMatch)){
		    if (kikiMatch){
			let points = foodMatch == "apple" ? 10 : 20;
			this.score.textContent = Number(score.textContent) + points;
		    }
		    else if (snakeMove)
			this.snake.grow(this.snake.tail.dir);

		    let id = this.foods.findIndex(f => f.x == x && f.y == y);
		    this.cells[y][x].classList.remove(foodMatch);
		    this.foods = this.foods.toSpliced(id, 1);
		}

		else if (kikiMatch && snakeMatch)
		    this.end(0);

		else if (snakeMove && snakeMatch && snakeMatch.length > 1)
		    this.end(1);
	    }
	}
    }

    /**
     * Ends a game by clearing the intervals and resetting the display.
     * @param {number} outcome - The end-of-game scenario.
     */
    end(outcome) {
	const msgs = ["Kiki died a painful death! You should be ashamed of yourself.",
		      "The snake has eaten itself. Here's an extra 200 points.",
		      "The snake got stuck !"];

	clearInterval(this.snakeInterval);
	clearInterval(this.foodInterval);

	this.playfield.element.innerHTML = "";
	this.playfield.element.style.display = "none";

	this.cells.forEach(cell => cell.className = "");
	this.cells = [];

	this.foods = [];
	this.kiki = this.snake = undefined;

	if (outcome === 2)
	    this.score.textContent = Number(this.score.textContent) + 200;

	this.EOGscore.textContent = score.textContent;
	this.EOGmessage.textContent = msgs[outcome];
	this.EOGpannel.style.display = "flex";
	
	this.startBtn.textContent = "Restart";
    }

    
    /**
     * Starts a game:
     *    - set up the playfield grid and the sprites,
     *    - set up the food generation and Snake targetting intervals,
     *    - display the gird.
     * @returns {[Sprite, Snake]} The Kiki and Snake objects.
     */
    start(){
	// setup
	this.setUpGrid();
	this.setUpSprites();

	// intervals
	this.foodInterval = setInterval(() => {
	    let foodType = getRandomNumber(0, 4) ? "apple" : "carrot";
	    let x, y;

	    do {
		x = getRandomNumber(0, this.playfield.columns);
		y = getRandomNumber(0, this.playfield.rows);
	    } while (isCellEmpty(x, y, this.cells) === false);

	    let newFood = new Sprite(x, y, foodType);
	    this.foods.push(newFood);
	}, getRandomNumber(2500, 3500));

	this.snakeInterval = setInterval(() => {
	    this.snake.autoTarget(this.kiki, this.foods);
	    this.checkForCollisions(true);
	}, 500);

	// playfield display
	this.playfield.element.style.display = "grid";
	this.EOGpannel.style.display = "none";
	this.score.textContent = 0;

	return [this.kiki, this.snake];
    }
}
