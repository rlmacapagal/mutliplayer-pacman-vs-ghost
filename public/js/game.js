import TileMap from "./TileMap.js"; //import class TileMap

const tileSize = 32;
const velocity = 2;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const tileMap = new TileMap(tileSize);
const pacman = tileMap.getPacman(velocity);
const enemies = tileMap.getEnemies(velocity);

let gameOver = false;
let gameWin = false;
const gameOverSound = new Audio('../sounds/gameOver.wav');
const gameWinSound = new Audio('../sounds/gameWin.wav');

function gameLoop()
{
  tileMap.draw(ctx);
  drawGameEnd();
  pacman.draw(ctx, enemies);     // dito nakapaloob ung this.move sa pacman.js
  enemies.forEach(enemy => enemy.draw(ctx, pacman)); // may reference kay pacman para maccess ung powerdot functions
  checkGameOver();
  checkGameWin();
}

function checkGameWin()
{
  if(!gameWin)
  {
    gameWin = tileMap.didWin();
    if(gameWin)
    {
      gameWinSound.play();
      console.log('win!');
    }
  }
}

function checkGameOver()
{
  if(!gameOver)
  {
    gameOver = isGameOver();
    if(gameOver)
    {
      gameOverSound.play();
    }
  }
}

function isGameOver()
{
  return enemies.some(enemy => !pacman.powerDotActive && enemy.collideWith(pacman));
  //check if powerdot is active and if bumangga si pacman sa kalaban

}

function drawGameEnd()
{
  if(gameOver || gameWin )
  {
    let text = "You Win!";
    if(gameOver)
    {
      text = "Game Over!!!";
    }

    document.getElementById("status").innerHTML = text;
    

  }
}

console.log("yo");
tileMap.setCanvasSize(canvas);

setInterval(gameLoop, 1000/75);