// DUNGEON CRAWLER GAME
// Christine Frances Betten
// Run in node.js

// npm install colors
// npm install prompt-sync
const prompt = require("prompt-sync")({ sigint: true });
const colors = require("colors/safe");

// MAP OF CURRENT DUNGEON
const TILE_TYPES = {
  S: "start",
  X: "wall",
  o: "path",
  E: "end",
};

let level = `
SXXooo
ooooXo
XXXXXo
ooooXo
oXXooo
EXXXXX`;

level = level
  .split("\n")
  .slice(1)
  .map((row) => row.split(""));

const dungeon = level.map((row) =>
  row.map((symbol) => {
    const type = TILE_TYPES[symbol];
    return {
      symbol,
      type,
      isRevealed: false,
    };
  })
);

const maxRow = dungeon.length - 1;
const maxCol = dungeon[0].length - 1;

// Starting position
let row = 0;
let col = 0;
dungeon[row][col].isRevealed = true;
console.log(colors.cyan(`\nStarting position - Row: ${row}, Col: ${col}`));

// Logs the dungeon map you input to command prompt
function printMap() {
  let rows = [];
  for (const [tileRow, arrRow] of dungeon.entries()) {
    const rowTiles = [];
    for (const [tileCol, tile] of arrRow.entries()) {
      if (tile.isRevealed) {
        const character = tile.type === "wall" ? "X" : "o";
        const colored =
          row === tileRow && col === tileCol
            ? colors.red(character)
            : character;
        rowTiles.push(colored);
      } else {
        rowTiles.push("?");
      }
    }
    rows.push(rowTiles);
  }
  console.log(rows.map((row) => row.join(" ")).join("\n"));
}

// Checks if player is currently at the end of the dungeon, thus winning
function checkEnd(row, col) {
  console.log(row, col);
  if (dungeon[row][col].type === "end") {
    console.log(
      colors.rainbow("\nCongratulations!"),
      colors.green("You made it out of the dungeon alive!")
    );
    return true;
  }
  return false;
}

// Reveals another square of the map when you try moving to it
function revealSquare(row, col) {
  if (row >= 0 && col >= 0 && row <= maxRow && col <= maxCol) {
    dungeon[row][col].isRevealed = true;
  }
}

function isWall(row, col) {
  // Outer boundaries
  if (col < 0 || col > maxCol || row < 0 || row > maxRow) {
    return true;
  }
  if (dungeon[row][col].type === "wall") {
    return true;
  }
  return false;
}

// MAIN GAME FUNCTION - tracks player movement through the dungeon
function move(input) {
  let lowerCaseInput = input.toLowerCase();
  const possibleInput = ["right", "left", "up", "down"];

  if (typeof input !== "string" || !possibleInput.includes(lowerCaseInput)) {
    console.log("Pick a direction to move - right, left, up or down.");
    return;
  }

  console.clear();

  let oldRow = row;
  let oldCol = col;

  switch (input) {
    case "left":
      col--;
      break;
    case "right":
      col++;
      break;
    case "up":
      row--;
      break;
    case "down":
      row++;
      break;
  }

  if (isWall(row, col)) {
    revealSquare(row, col);
    row = oldRow;
    col = oldCol;
    console.log(colors.red(`You can't move ${lowerCaseInput}, pick another direction.`));
  }

  revealSquare(row, col);
}


printMap();
// Prompts user for movement input as long as user has not reached the dungeon exit
while (!checkEnd(row, col)) {
  const playerMove = prompt(
    colors.yellow("Pick a direction! (Exit with Ctrl+C) ")
  );

  move(playerMove);
  printMap();

  let currentPosition = `Current position - Row: ${row}, Col: ${col}`;
  console.log(currentPosition);
}
