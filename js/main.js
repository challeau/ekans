import {Game} from "./game.js";

// Vars
let kiki, snake;
let game = new Game();

// Dark/light mode switch
game.modeBtn.addEventListener("click", () => game.toggleMode());

// Start button event
game.startBtn.addEventListener("click", () => {
  if (game.playfield.element.childElementCount === 0){
    // start the game
    [kiki, snake] = game.start();
  }
});

// Player input listener
document.addEventListener("keydown", event => {
  if (!kiki)
    return ;

  switch (event.key) {
  case "ArrowLeft":		// left
    if (kiki.x > 0)
      kiki.move(kiki.x - 1, kiki.y, dir.left);
    break;
  case "ArrowUp":		// up
    if (kiki.y > 0)
      kiki.move(kiki.x, kiki.y -1, dir.up);
    break;
  case "ArrowRight":		// right
    if (kiki.x < game.playfield.columns - 1)
      kiki.move(kiki.x + 1, kiki.y, dir.right);
    break;
  case "ArrowDown":		// down
    if (kiki.y < game.playfield.rows - 1)
      kiki.move(kiki.x, kiki.y + 1, dir.down);
    break;
  }
});


export {game};
