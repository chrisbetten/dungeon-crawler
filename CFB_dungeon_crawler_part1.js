// DUNGEON CRAWLER GAME
// Christine Frances Betten
// Run in node.js

// npm install colors
// IMPORTS COLOURS USED FOR STYLING IN COMMAND PROMPT
const colors = require("colors/safe");

/*
// MAP OF CURRENT DUNGEON
* oXXooo
* ooooXo
* XXXXXo
* ooooXo
* oXXooo
* oXXXXX
*/

const dungeon = [
    [{ type: 'start' }, null, null, { type: 'path' }, { type: 'path' }, { type: 'path' }],
    [{ type: 'path' }, { type: 'path' }, { type: 'path' }, { type: 'path' }, null, { type: 'path' }],
    [null, null, null, null, null, { type: 'path' }],
    [{ type: 'path' }, { type: 'path' }, { type: 'path' }, { type: 'path' }, null, { type: 'path' }],
    [{ type: 'path' }, null, null, { type: 'path' }, { type: 'path' }, { type: 'path' }],
    [{ type: 'end' }, null, null, null, null, null],
];


const maxRow = dungeon.length - 1;
const maxCol = dungeon[0].length - 1;


// Starting position
let row = 0;
let col = 0;
console.log(colors.cyan(`\nStarting position - Row: ${row}, Col: ${col}`));


// Converts a dungeon array to a map with revealed paths and walls
function dungeonMap(arr) {
    let tempArray = arr.reduce((a, b) => a.concat(b)).map(item => (item) ? item = 'o' : item = 'X');
    
    let dungeonMap = [], chunk;
    while (tempArray.length > 0) {
       chunk = tempArray.splice(0, arr[0].length);
       dungeonMap.push(chunk);
    };
 
    return dungeonMap;
}


// Converts a dungeon array to a map with hidden tiles
function hiddenDungeonMap(arr) {
    let tempArray =  arr.reduce((a, b) => a.concat(b)).map(item => item = '?');
    
    let hiddenDungeonMap = [], chunk;
    while (tempArray.length > 0) {
        chunk = tempArray.splice(0, arr[0].length);
        hiddenDungeonMap.push(chunk);
    };
    
    return hiddenDungeonMap;
}


// Prepares the hidden and revealed maps for the current dungeon
let hiddenMap = hiddenDungeonMap(dungeon);
let exposedMap = dungeonMap(dungeon);


// Logs the dungeon map you input to command prompt
function printMap(arr) {
    console.log('');
    for (let arrRow of arr)
        console.log(arrRow.join(' '));
    console.log('');
}


// Checks if player is currently at the end of the dungeon, thus winning
function checkEnd(row, col) {
    if (dungeon[row][col].type === 'end') {
        console.log(colors.rainbow('\nCongratulations!'), colors.green('You made it out of the dungeon alive!'));
        return true;
    };
    return false;
}


// Logs the hidden map at the beginning of the game, with starting position highlighted in red
function printStartingPosition(row, col) {
    revealSquare(row, col);
    hiddenMap[row][col] = colors.red(hiddenMap[row][col]);
    printMap(hiddenMap);
}


// Reveals another square of the map when you try moving to it
function revealSquare(row, col) {
    if (row >= 0 && col >= 0 && row <= maxRow && col <= maxCol)
        hiddenMap[row][col] = exposedMap[row][col];
}


// MAIN GAME FUNCTION - tracks player movement through the dungeon
function move(input) {
    let lowerCaseInput = input.toLowerCase();
    const possibleInput = ['right', 'left', 'up', 'down'];

    if (typeof input !== 'string' || !possibleInput.includes(lowerCaseInput)) {
        console.log('Pick a direction to move - right, left, up or down.');
        return;
    }
    let hitWall = colors.red(`You can't move ${input}, pick another direction.`);

    if (input === 'right') {
        if (col < maxCol && dungeon[row][col + 1])
            col++;
        else {
            console.log(`\n${hitWall}`);
            revealSquare(row, (col + 1));
        }
    };

    if (input === 'left') {
        if (col > 0 && dungeon[row][col - 1])
            col--;
        else {
            console.log(`\n${hitWall}`);
            revealSquare(row, (col - 1));
        }
    };

    if (input === 'down') {
        if (row < maxRow && dungeon[row + 1][col])
            row++;
        else {
            console.log(`\n${hitWall}`);
            revealSquare((row + 1), col);
        }
    };

    if (input === 'up') {
        if (row > 0 && dungeon[row - 1][col])
            row--;
        else {
            console.log(`\n${hitWall}`);
            revealSquare((row - 1), col);
        }
    };

    revealSquare(row, col);
    // Highlights current position with red colour
    hiddenMap[row][col] = colors.red('o');
    printMap(hiddenMap);
    // Resets former red 'current position' to white
    hiddenMap[row][col] = colors.white('o');

    let currentPosition = `Current position - Row: ${row}, Col: ${col}`;
    console.log(currentPosition);
    return;
}


printStartingPosition(row, col);

const prompt = require('prompt-sync')({sigint: true});

// Prompts user for movement input as long as user has not reached the dungeon exit
while (!checkEnd(row, col)) {
    const playerMove = prompt(colors.yellow('Pick a direction! (Exit with Ctrl+C) '));
    move(playerMove);

// SHORTER VERSION - direct input without playerMove variable
//    move(prompt(colors.yellow('Pick a direction! (Exit with Ctrl+C) ')));
}

