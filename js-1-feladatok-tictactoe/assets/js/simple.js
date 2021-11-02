'use strict';

const gameDiv = document.querySelector("#game");
const spanResult = document.querySelector("#result");

const cellDivs = new Array(9).fill(null);
const cellSpans = new Array(9).fill(null);

const pow2 = [1, 2, 4, 8, 16, 32, 64, 128, 256];
const fullState = pow2.reduce((sum, e) => sum | e, 0);
const winStates = [
    1 << 0 | 1 << 1 | 1 << 2,
    1 << 3 | 1 << 4 | 1 << 5,
    1 << 6 | 1 << 7 | 1 << 8,
    1 << 0 | 1 << 3 | 1 << 6,
    1 << 1 | 1 << 4 | 1 << 7,
    1 << 2 | 1 << 5 | 1 << 8,
    1 << 0 | 1 << 4 | 1 << 8,
    1 << 2 | 1 << 4 | 1 << 6
];

const cellCN = 'cell';
const freeCN = 'freecell';
const winCN = 'win';

const symbol = ['O', 'X'];

let gameState = [0, 0];

let currentPlayer = 0;

let gameEnd = false;

init();

//------------------------------------------

function init() {
    cellDivs.forEach((div, i) => {
        div = document.createElement('div');
        ClassAdd(div, cellCN);
        let span = document.createElement('span');
        div.appendChild(span);
        gameDiv.appendChild(div);
        addEvents(div, {
            click: click,
            mousedown: mousedown,
            mouseleave: mouseleave
        });
        cellDivs[i] = div;
        cellSpans[i] = span;
    });
    gameReset();
}

function gameReset() {
    allCellClassRemove(winCN);
    allCellClassAdd(freeCN);
    cellSpans.forEach(span => span.textContent = "");
    gameState = [0, 0];
    gameEnd = false;
    currentPlayer = 0;
    nextShow();
}

function allCellClassAdd(...classes) {
    cellDivs.forEach(c => ClassAdd(c, ...classes));
}

function allCellClassRemove(...classes) {
    cellDivs.forEach(c => ClassRemove(c, ...classes));
}

function ClassAdd(elem, ...classes) {
    classes.forEach(c => elem.classList.add(c));
}

function ClassRemove(elem, ...classes) {
    classes.forEach(c => elem.classList.remove(c));
}

function addEvents(elem, handlerObj) {
    for (let key in handlerObj)
        elem.addEventListener(key, handlerObj[key]);
}

function getSpan(cell) {
    return cellSpans[cellDivs.indexOf(cell)];
}

function Step(cell) {
    let idx = cellDivs.indexOf(cell);
    cellSpans[idx].textContent = symbol[currentPlayer];
    ClassRemove(cell, freeCN);
    gameState[currentPlayer] |= pow2[idx];
    if (!gameCheckEnd())
        nextShow();
    currentPlayer ^= 1;
}

function mousedown(e) {
    if (isFree(e.target))
        getSpan(e.target).textContent = symbol[currentPlayer];
}

function click(e) {
    let cell = e.target;
    if (isFree(cell))
        Step(cell);
}


function mouseleave(e) {
    if (isFree(e.target))
        getSpan(e.target).textContent = "";
}


function isFree(cell) {
    return cell.classList.contains(freeCN);
}


function flipPlayer() {
    currentPlayer ^= 1;
}

function gameCheckEnd() {
    let win = winState(gameState[0]) | winState(gameState[1]);
    gameEnd = drawState() || win;
    if (gameEnd) {
        if (win)
            resultShow(`${getplayerName(currentPlayer)} wins!`);
        else
            resultShow('Draw!');
        cellDivs.forEach((cell, i) => {
            ClassRemove(cell, freeCN);
            if (pow2[i] & win)
                ClassAdd(cell, winCN);
        });
    }
    return gameEnd;
}


function winState(state) {
    return winStates.find(win => (state & win) == win) | 0;
}

function drawState(state) {
    return (gameState[0] | gameState[1]) == fullState;
}


function replayButtonClick() {
    if (gameEnd)
        gameReset();
}

function resultShow(resultStr) {
    spanResult.textContent = resultStr;
}

function nextShow() {
    resultShow(`${getplayerName(currentPlayer)} next`);
}

function getplayerName(player) {
    return `Player ${player + 1} (${symbol[player]})`
}