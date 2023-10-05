import {startGame} from "./game.js";

// DOM objects
const score = document.querySelector('#score p');
const startBtn = document.getElementById('start-btn');

// Vars
let kiki, snake;


// Start button event
startBtn.addEventListener('click', () => {
  if (playfield.element.childElementCount === 0){
    // start the game
    [kiki, snake] = startGame(playfield, cells);
  }
});

// Player input listener
document.addEventListener('keydown', event => {
  if (!kiki)
    return ;

  switch (event.key) {
  case 'ArrowLeft':		// left
    if (kiki.x > 0)
      kiki.move(kiki.x - 1, kiki.y, 'left');
    break;
  case 'ArrowUp':		// up
    if (kiki.y > 0)
      kiki.move(kiki.x, kiki.y -1, 'up');
    break;
  case 'ArrowRight':		// right
    if (kiki.x < playfield.columns - 1)
      kiki.move(kiki.x + 1, kiki.y, 'right');
    break;
  case 'ArrowDown':		// down
    if (kiki.y < playfield.rows - 1)
      kiki.move(kiki.x, kiki.y + 1, 'down');
    break;
  }
});


export {score};
