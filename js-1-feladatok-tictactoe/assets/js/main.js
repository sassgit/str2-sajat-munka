const aiWorkerFN = 'assets/js/aiworker.js';
const gameDiv = document.querySelector("#game");
const cellDivs = new Array(9).fill(null);
const cellSpans = new Array(9).fill(null);
const spanResult = document.querySelector("#result");
const playersymbol = document.querySelector("#playersymbol");
const checkAi1 = document.querySelector("#aiplayer1");
const checkAi2 = document.querySelector("#aiplayer2");
const checkQmode = document.querySelector("#qmark");
const checkBlind = document.querySelector("#blind");
//powers of 2
const pow2 = [1, 2, 4, 8, 16, 32, 64, 128, 256];
//Numpad controls
const numpad = [7, 8, 9, 4, 5, 6, 1, 2, 3];
//Class Names
const cellCN = 'cell';
const freeCN = 'freecell';
const numpadCN = 'numpad';
const player1CN = 'player1';
const player2CN = 'player2';
const blindCN = 'blind';
const winCN = 'win';
const aiStepCN = 'aistep';
//Player class name selector
const playerCN = [player1CN, player2CN]

const winStatesDefault = [
    1 << 0 | 1 << 1 | 1 << 2,
    1 << 3 | 1 << 4 | 1 << 5,
    1 << 6 | 1 << 7 | 1 << 8,
    1 << 0 | 1 << 3 | 1 << 6,
    1 << 1 | 1 << 4 | 1 << 7,
    1 << 2 | 1 << 5 | 1 << 8,
    1 << 0 | 1 << 4 | 1 << 8,
    1 << 2 | 1 << 4 | 1 << 6
];

//Akár meg is lehetne változtatni!
let winStates = winStatesDefault;
///zero based, 0: player1 , 1: player2
let currentPlayer = 0;
let startPlayer = 0;
let qmark = null;
let blindmode = false;
let symbol = ['X', '0'];

let gameState = [0, 0];

let gameHistory = [];

let numpadEnable = true;
let numpadPressed = 0;

let aiWorker = null;
let aiPlayer = [false, false];
let aiTimeout = [200, 200];
let aiDepth = [9, 5];
let maxDepth = 9;
let looseChooseDepth = 5;
let stopper = [0, 0];
let winCounter = [0, 0];
let drawCounter = 0;
let stopWatch = 0;

init();

function init() {
    console.log("Initialize");
    cellDivs.forEach((div, i) => {
        div = document.createElement('div');
        let span = document.createElement('span');
        div.appendChild(span);
        div.id = 'cell' + i;
        div.classList.add(cellCN);
        div.classList.add(freeCN);
        div.addEventListener("click", click);
        div.addEventListener("mousedown", mousedown);
        div.addEventListener("mouseleave", mouseleave);
        div.addEventListener("mouseup", mouseup);
        gameDiv.appendChild(div);
        cellDivs[i] = div;
        cellSpans[i] = span;
        return div;
    });
    document.addEventListener('keydown', keydown);
    document.addEventListener('keyup', keyup);
    gameReset();
    setInterval(nextShow, 50);
}

function keydown(ev) {
    if (numpadEnable) {
        let idx = numpad.indexOf(parseInt(ev.key));
        if (idx >= 0) {
            let nidx = 1 << idx;
            numpadPressed |= nidx;
            if (numpadPressed == nidx) {
                let cell = cellDivs[idx];
                mousedonwCell(cell);
                if (!aiPlayer[currentPlayer])
                    cell.classList.add(numpadCN);
            }
        }
    }
    if (ev.keyCode == 13 && ev.target.nodeName == 'BUTTON') {
        ev.preventDefault();
    }
}

function keyup(ev) {
    if (numpadEnable) {
        let idx = numpad.indexOf(parseInt(ev.key));
        if (idx >= 0) {
            let nidx = 1 << idx;
            if (numpadPressed == nidx) {
                let cell = cellDivs[idx];
                clickCell(cell);
            } else {
                cell = cellDivs[idx];
                if (isFree(cell))
                    getSpan(cell).textContent = "";
            }
            numpadPressed &= ~(nidx);
            delnumpadclass()
        }
    }
}

function delnumpadclass() {
    cellDivs.forEach(cell => cell.classList.remove(numpadCN));
}

function replayButtonClick() {
    gameReset();
}

function isFree(cell) {
    return cell.classList.contains(freeCN);
}

function freeAllCells() {
    cellDivs.forEach(e => freeCell(e));
}

function freeCell(cell) {
    cell.classList.add(freeCN);
    cell.classList.remove(player1CN);
    cell.classList.remove(player2CN);
    cell.classList.remove(winCN);
    cell.classList.remove(aiStepCN);
    getSpan(cell).textContent = "";
}

function occupyCell(cell, player) {
    cell.classList.remove(freeCN);
    cell.classList.add(playerCN[player]);
    if (blindmode)
        cell.classList.add(blindCN);
    getSpan(cell).textContent = qmark || symbol[currentPlayer];
}


function flipPlayer() {
    currentPlayer ^= 1;
}

function getstopper(player) {
    return (stopWatch == 0 || player != currentPlayer ? 0 : Date.now() - stopWatch) + stopper[player];
}

function nextShow() {
    let str = `player ${currentPlayer + 1} (${symbol[currentPlayer]}) next, `;
    str += ` player 1 time: " + ${(getstopper(0) / 1000).toFixed(4)} s, `;
    str += ` player 2 time: ${(getstopper(1) / 1000).toFixed(4)} s`;
    str += ` |   ${winCounter[0]}: ${winCounter[1]} | ${drawCounter} draw game.`;
    playersymbol.textContent = str;;
}

function getSpan(cell) {
    return cellSpans[cellDivs.indexOf(cell)];
}

function mousedown(ev) {
    mousedonwCell(ev.target);
}

function mousedonwCell(cell) {
    if (isFree(cell) && !aiPlayer[currentPlayer]) {
        getSpan(cell).textContent = qmark || symbol[currentPlayer];
    } else
        cell.classList.remove(aiStepCN); // if user click, do not animate aistep more.
}

function Step(cell) {
    if (isFree(cell)) {
        occupyCell(cell, currentPlayer);
        gameState[currentPlayer] |= 1 << cellDivs.indexOf(cell);
        gameHistory.push([gameState[0], gameState[1]]);
        if (stopWatch) {
            stopper[currentPlayer] += Date.now() - stopWatch;
        }
        stopWatch = Date.now();
        if (!checkEndGame()) {
            flipPlayer();
            aiStep();
        }
        nextShow();
    }
}


function mouseup(ev) {

}

function mouseleave(ev) {
    let cell = ev.target;
    if (isFree(cell))
        getSpan(cell).textContent = "";
}

function click(ev) {
    clickCell(ev.target);
}

function modeCheckbox(ev) {
    aiPlayer = [checkAi1.checked, checkAi2.checked];
    aiStep();
    qmark = checkQmode.checked ? "?" : null;
    blindmode = checkBlind.checked;
    cellDivs.forEach(cell => {
        if (blindmode && playerCN.some(cn => cell.classList.contains(cn)))
            cell.classList.add(blindCN);
        else
            cell.classList.remove(blindCN);
        let span = getSpan(cell);
        if (qmark) {
            if (span.textContent)
                span.textContent = qmark;
        } else
            playerCN.forEach((cn, i) => cell.classList.contains(cn) ? span.textContent = symbol[i] : null);
    });
}

function clickCell(cell) {
    if (isFree(cell) && !aiPlayer[currentPlayer]) {
        Step(cell);
    }
}

function checkEndGame() {
    let p1win = winState(gameState[0]) | 0;
    let p2win = winState(gameState[1]) | 0;
    if (p1win || p2win || gameState[0] + gameState[1] == 511) {
        if (p1win || p2win) {
            let winidx = p1win ? 0 : 1;
            winPlayer(winidx, p1win | p2win)
        } else
            drawGame();
        cellDivs.forEach(cell => {
            cell.classList.remove(freeCN);
            cell.classList.remove(blindCN);
            let span = getSpan(cell);
            playerCN.forEach((cn, i) => cell.classList.contains(cn) ? span.textContent = symbol[i] : null);
        });
        currentPlayer = startPlayer ^= 1;
        stopWatch = 0;
        nextShow();
        return true;
    } else
        return false;
}

function getplayerName(player) {
    if (aiPlayer[player])
        return `Computer #${player + 1}`;
    else
        return `Player #${player + 1}`;
}

function winPlayer(player, winline) {
    let msg = symbol[0] == symbol[1] ? // it may be possible, that the two sybol is same!
        `${getplayerName(player)} wins!` :
        `${getplayerName(player)} (${symbol[player]}) wins!`;
    winCounter[player]++;
    spanResult.textContent = msg;
    console.log(msg);
    cellDivs
        .filter((elem, i) => winline & 1 << i)
        .forEach(elem =>
            elem.classList.add(winCN)
        );
}

function drawGame() {
    let msg = "Draw!";
    drawCounter++;
    spanResult.textContent = msg;
    console.log(msg);
}

function gameReset() {
    currentPlayer = startPlayer;
    freeAllCells();
    delnumpadclass();
    gameState = [0, 0];
    spanResult.textContent = "";
    gameDiv.focus();
    stopper = [0, 0];
    stopWatch = 0;
    gameHistory = [];
    nextShow();
    aiStep();
}


function winState(state) {
    return winStates.find(win => (state & win) == win);
}

function log2i(x) {
    return pow2.indexOf(x);
}

function aiStepGui(stepPow2) {
    let step = log2i(stepPow2); // kettő hatvány formátumú lépést átkonvertáljuk index-re.
    let cell = cellDivs[step];
    cell.classList.add(aiStepCN);
    Step(cell);
}

function aiStepRandomGui(steps) { // véletlenszerűen kiválaszt egy lépést a lehetőségek közül
    aiStepGui(steps[Math.floor(Math.random() * steps.length)]);
}


function aiStep() {
    if (aiWorker == null) {
        aiWorker = new Worker(aiWorkerFN);
        aiWorker.onmessage = aiWorkerOnMessage;
    }
    aiWorker.postMessage({
        gState: gameState,
        player: currentPlayer,
        depth: aiDepth[currentPlayer],
        winStates: winStates,
        looseChooseDepth: looseChooseDepth,
        timeout: aiTimeout[currentPlayer]
    });
}

function aiWorkerOnMessage(e) {
    let obj = e.data;
    if (obj.gState[0] == gameState[0] && obj.gState[1] == gameState[1] && obj.player == currentPlayer && aiPlayer[currentPlayer] && obj.depth == aiDepth[currentPlayer])
        aiStepRandomGui(obj.result);
}
