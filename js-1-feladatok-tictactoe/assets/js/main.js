// ai Worker kód fájl neve.
const aiWorkerFN = 'assets/js/aiworker.js';

// elemek kiválasztása.
const gameDiv = document.querySelector("#game");
const cellDivs = new Array(9).fill(null);
const cellSpans = new Array(9).fill(null);
const spanResult = document.querySelector("#result");
const checkQmode = document.querySelector("#qmark");
const checkBlind = document.querySelector("#blind");
const checkLoop = document.querySelector("#loop");
const checkFlipP = document.querySelector("#flipp");
const player1Selector = document.querySelector("#p1mode");
const player2Selector = document.querySelector("#p2mode");
const ai1DepthSelector = document.querySelector("#ai1depth");
const ai2DepthSelector = document.querySelector("#ai2depth");
const fastComuterCheck = document.querySelector("#fastai");
const p1TimeDiv = document.querySelector('.player1 .time');
const p2TimeDiv = document.querySelector('.player2 .time');
const p1WinsDiv = document.querySelector('.player1 .wins');
const p2WinsDiv = document.querySelector('.player2 .wins');
const drawsDiv = document.querySelector('.players .draws');
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

//Alapértelmezett nyertes kombinációk (0-bázisú cellaszámok szerint: sorok: 012, 345, 678, oszlopok: 036, 147, 258, és az átlók: 048, 246)
const winStatesDefault = [
    1 << 0 | 1 << 1 | 1 << 2,
    1 << 3 | 1 << 4 | 1 << 5,
    1 << 6 | 1 << 7 | 1 << 8,
    1 << 0 | 1 << 3 | 1 << 6,
    1 << 1 | 1 << 4 | 1 << 7,
    1 << 2 | 1 << 5 | 1 << 8,
    1 << 0 | 1 << 4 | 1 << 8,
    1 << 2 | 1 << 4 | 1 << 6
    // ezeket a nyerő pattern-eket bekapcsolva a kezdő játékos mindig nyerhet.
    // , 1 << 0 | 1 << 4 | 1 << 2
    // , 1 << 6 | 1 << 4 | 1 << 8
];

//Maximális ai erősség. 8 elég, mert a lehetséges lépések utántól számít.
const maxAiDepth = 8;

//Ha ez a kapcsoló true, mindig új játékot lehet kezdeni a "Start a new game" gombbal, akkor is ha még nem ért véget szabályosan a játék.
//Nem egyértelmű a feladat kiírásból, hogy úgy kell-e működnie hogy ez a kapcsoló bekapcsolt vagy úgy, amikor kikapcsolt állapotú.
//Ha kikacsolt, akkor viszont lehet, hogy hibaüzenetet kellene küldeni akkor, ha mégis aktiválni akarja. Vagy a gombot csak akkor láthatóvá tenni, ha 
//vége a játéknak. Én a teszteknél mindig bekapcsolt működéssel használtam (nem volt sokáig ez a kapcsoló benne a kódban)
let StartNewGameAlwaysEnabled = false;


//A console diagnosztikai üzenetek engedélyezése
let logEnable = false;

//Az ai worker console üzeneteinek engedélyezése.
let logEnableAi = false;

//ha true, vége van a játéknak. A gameReset() false-ra állítja.
let gameEnd = false;

//Ezt akár meg is lehetne változtatni, itt most az alapértelmezett!
let winStates = winStatesDefault;

///Aktuális játákos melyik. Zero based, 0: player1 , 1: player2
let currentPlayer = 0;
//Kezdő játékos, játék vége után csere van.
let startPlayer = 0;
// kérdőjel string, ha az az üzemmód van.
let qmark = null;
//Vakjáték üzemmód kapcsoló
let blindmode = false;
//A játékosok által használt karakter, akár meg is lehetne változtatni.
let symbol = ['0', 'X'];

//Játék aktuális állapota binárisan. A két játékos külön szám, a megfelelő bit jelzi a foglalt mezőt, ezért gameState[0] & gameState[1] == 0, mivel egy mezőt nem foglalhat két játokos.
//A JS képességei miatt (32 bites számként kezeli a bináris műveleteket) jelen kód némi kiegészítéssel  akár (az ai is) 32 mezőt tudna lekezelni max (pl 8x4-es tábla).
//Ennél nagyobb táblához a gameState-nek, és a többi változónak kettő vagy több számból kellene állnia, és külön megírni a több bites ÉS illetve VAGY fv-eket.
let gameState = [0, 0];
//A játékmenet tárolása (gameState-eket tárol), visszalépés gombhoz kellene.
let gameHistory = [];
//Ha true, a megfelelő játékosnál, engedélyezi a numpad-et.
let numpadEnable = [true, true];
//Ha true, a megfelelő játékosnál, engedélyezi a egeret.
let mouseEnable = [true, true];
//ide gyűjti be, mely numpad billentyűk vannak lenyomva. Az egyes bitek ebben a számban a numpad számokhoz rendelt mezőket jelentik!
let numpadPressed = 0;
//A gépi jétékos Worker-ben dolgozik, itt van a Worker. Csak akkor hozom létre, ha kell gépi játékos.
let aiWorker = null;
//Melyik játékos a gépi játákos. Akár mindkettől is lehet.
let aiPlayer = [false, false];
//1 Depth egységenként mennyi gondolkodási időt töltsön el a gép minimum. Ez csak a játékélmény miatt érdekes effekt, hogy úgy tűnjön, "mintha" gondolkodna.
//Amúgy az ai elég gyors, Max depth mellett 2.2Ghz-es ~74ms az első lépés ~9 a második, ~1 a harmadik, a többi már nem mérhető.
//A lenti alapértelmezett értéke, a "Fast Computer" kikapcsolásával ez az érték fog beállni.
let aiTimeoutPerDepthDefault = [50, 50];
//Ha a "Fast Computer" be van kapcsolva, akkor ez [0, 0]
let aiTimeoutPerDepth = aiTimeoutPerDepthDefault;
//Az egyes jétékosokhoz rendelt gépi játákos erőssége (8-nél már az első lépésnél miden lépésig elmegy az elemzésben)
let aiDepth = [maxAiDepth, maxAiDepth];
//Az ai, ha "látja", hogy az ellenfél mindenképpen tud nyerni, azért, hogy még "küzdjön", a Math.min(loseChooseDepth, depth) szerint indulva csökkenő depth-el kalkulálva keres olyan depth-el
// még döntetlennek latszó partit. Enélkül a számára már egyaránt vereségnek látszó szituációk küzül választana random, így nem elég "emberszerű" a reakciója, pl egy most jelentkező 3-ast nem
// akadályoz meg, csak azért, mert tudja, hogy az ellenfél a következő lépésekben úgyis tud nyerni. Ám lehet, hogy az ellenfél nem is tudja, hogy tud nyerni.
let loseChooseDepth = 6;
//Az egyes játékosok játékidejének mérése.
let stopper = [0, 0];
//Az egyes játékosok győzelmeinek száma.
let winCounter = [0, 0];
//Döntetlen játékok száma.
let drawCounter = 0;
//Stopper változó a játékidő mérésére. A Date.now() értéke kerül ide.
let stopWatch = 0;

//Kezdeti inicializálás.
init();

//-------------------------------------------------------------------------------------------------------
// Itt befejeződik a konstansok, kezdeti változók deklarálása és definiálása és init() függvényhívás.
// Ez alatt már csak olyan függvények vannak amelyek a GUI által callback, illetve egymásból hívódik meg.
//-------------------------------------------------------------------------------------------------------


/**
 * Ha logEnable, akkor logoljuk a konzolra az üzeneteket, különben nem.
 */
function log(...values) {
    if (logEnable)
        console.log(...values);
}


/**
 * Kezdeti inicializálás,  csak egyszer fut le.
 */
function init() {
    log("Initialize");
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
    let aioptionHTML = "";
    for (let i = 0; i <= maxAiDepth; i++)
        aioptionHTML += `<option value="${i}">AI${i}</option>`;
    ai1DepthSelector.innerHTML = aioptionHTML;
    ai2DepthSelector.innerHTML = aioptionHTML;
    ai1DepthSelector.addEventListener('change', selectorChange);
    ai2DepthSelector.addEventListener('change', selectorChange);
    player1Selector.addEventListener('change', selectorChange);
    player2Selector.addEventListener('change', selectorChange);
    document.addEventListener('keydown', keydown);
    document.addEventListener('keyup', keyup);
    gameEnd = true; // a gameReset állítja majd false-ra.
    selectorChange();
    gameReset();
    setInterval(nextShow, 50);
}

/**
 * A loop checkbox eseménykezelője.
 */
function checkLoopChange() {
    if (checkLoop.checked)
        gameReset();
}

/**
 * Az összes selector change eseménye ide fut be. Mindent beállítok a selectorok állása szerint.
 */
function selectorChange() {
    [ai1DepthSelector, ai2DepthSelector].forEach((sel, i) => aiDepth[i] = parseInt(sel.value));
    [player1Selector, player2Selector].forEach((sel, i) => {
        mouseEnable[i] = sel.value.includes('mouse');
        numpadEnable[i] = sel.value.includes('numpad');
        aiPlayer[i] = sel.value == 'computer';
    });
    aiStep();
}

/**
 * Bármelyik mód választó checkbox változott, ez a fv. kezeli le.
 * Játékmenet közben is tetszőlegesen változtathatók ezek.
 * @param {*} ev
 */
function modeCheckbox() {
    aiTimeoutPerDepth = fastComuterCheck.checked ? [0, 0] : aiTimeoutPerDepthDefault;
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



/**
 * Billentyűlenyomás esetére, a numpad billentyűinek érzékelése. (Nem csak a numpad, a normál számbillenyűire is működik)
 * Ezen felül szerepe, hogy az enter billentyűt letiltsa a nyomógombra, mert azzal véletlenül új játékot lehet indítani, ha
 * a focus az új játék gombon van.
 */
function keydown(ev) {
    if (numpadEnable[currentPlayer]) {
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

/**
 * Billentyű felengedés érzékelése.
 */
function keyup(ev) {
    if (numpadEnable[currentPlayer]) {
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

/**
 * numpad osztály (animációért felel) megszüntetése valamennyi celláról
 */
function delnumpadclass() {
    cellDivs.forEach(cell => cell.classList.remove(numpadCN));
}

/**
 * Újrajátszás gomb click eseménye
 */
function replayButtonClick() {
    if (StartNewGameAlwaysEnabled || gameEnd)
        gameReset();
}

/**
 * szabad-e az adott cella (még nem foglalt). Ennek csak vizualizációs szerepe van, a játékmenet a gameState változó alapján van kezelve.
 */
function isFree(cell) {
    return cell.classList.contains(freeCN);
}

/**
 * Összes cella felszabadítása (Új játék esetén hívódik meg)
 */
function freeAllCells() {
    cellDivs.forEach(e => freeCell(e));
}

/**
 * Egy adott cella felszabadítása (csak az összes cella felszabadítása hívja meg)
 */
function freeCell(cell) {
    cell.classList.add(freeCN);
    cell.classList.remove(player1CN);
    cell.classList.remove(player2CN);
    cell.classList.remove(winCN);
    cell.classList.remove(aiStepCN);
    getSpan(cell).textContent = "";
}

/**
 * Egy adott játékos elfoglal egy adott cellát, ez akkor hívódik meg.
 * Csak a cellát kezeli (vizualizáció végett), a játékmenetet (gameState) nem!
 * Csak a Step() fv hívja meg, amely a játékmenetet is kezeli.
 * @param {*} cell
 * @param {*} player
 */
function occupyCell(cell, player) {
    cell.classList.remove(freeCN);
    cell.classList.add(playerCN[player]);
    if (blindmode)
        cell.classList.add(blindCN);
    getSpan(cell).textContent = qmark || symbol[currentPlayer];
}

/**
 * Megcseréli az aktuális játékost (ha Player 1-volt akkor 2 lesz és viszont.)
 * Csak a Step() fv hívja meg, amely a játékmenetet is kezeli.
 */
function flipPlayer() {
    currentPlayer ^= 1;
}

/**
 * A megadott játékos stopper állását adja vissza. Csak a nextShow() hívja meg.
 * @param {*} player
 * @returns
 */
function getstopper(player) {
    return (stopWatch == 0 || player != currentPlayer ? 0 : Date.now() - stopWatch) + stopper[player];
}

/**
 * Kijelzi, hogy ki a következő játékos, és az időket, a játékállást. (ki hány partit nyert, hány a döntetlen.)
 */
function nextShow() {
    p1WinsDiv.textContent = winCounter[0];
    p2WinsDiv.textContent = winCounter[1];
    p1TimeDiv.textContent = (getstopper(0) / 1000).toFixed(2);
    p2TimeDiv.textContent = (getstopper(1) / 1000).toFixed(2);
    drawsDiv.textContent = `Draw: ${drawCounter} game${drawCounter> 1 ? 's' :''}`;
    if (!gameEnd)
        spanResult.textContent = `${getplayerName(currentPlayer)} next`;
}

/**
 * Visszaadja a cellában található span elemet.
 * @param {*} cell
 * @returns
 */
function getSpan(cell) {
    return cellSpans[cellDivs.indexOf(cell)];
}

/**
 * Cellára bal egérgomb kattintás kelezése, ha az egér engedélyezett az adott felhasználónak.
 * @param {*} ev
 */
function mousedown(ev) {
    if (ev.button == 0 && mouseEnable[currentPlayer])
        mousedonwCell(ev.target);
}

/**
 * A cella bal egérgomb lenyomás vagy numpad billentyű lenyomás, ez a fv. csak a vizualizációért felel.
 * a megfelelő jel megjelenítése, és az osztály hozzáadása, ha a cella szabad.
 * @param {*} cell
 */
function mousedonwCell(cell) {
    if (isFree(cell) && !aiPlayer[currentPlayer]) {
        getSpan(cell).textContent = qmark || symbol[currentPlayer];
    } else
        cell.classList.remove(aiStepCN); // Ha a felhasználó kattintott ne menjen tovább az aistep animáció.
}

/**
 * Ha a cella szabad, a lépés végrehajtása, játékmenet kezelése, és aktív játékos csere.
 * @param {*} cell
 */
function Step(cell) {
    if (isFree(cell)) {
        occupyCell(cell, currentPlayer);
        gameState[currentPlayer] |= 1 << cellDivs.indexOf(cell);
        gameHistory.push([gameState[0], gameState[1]]);
        if (stopWatch) {
            stopper[currentPlayer] += Date.now() - stopWatch;
        }
        stopWatch = Date.now();
        if (!(gameEnd = checkEndGame())) {
            flipPlayer();
            aiStep();
            nextShow();
        } else
            endGameWorks();
    }
}

/**
 * Ide akkor kerül amikor vége van a játéknak és ezzel kapcsolatban már mindent megcsinált.
 * A Step(cell) hívja meg, hiszen úgy lesz vége a játéknak, hogy valamelyik lépés utolsó.
 * A checkEndGame() már minden egyebet elvégzett, itt vizsgálom, hogy a másik játékosnak kell-e
 * kezdenie a kapcsoló szerint (ez csak akkor érvényes, ha rendesen ért véget a játék), és hogy loop kapcsoló
 * be van-e kapcsolva, mert ha igen, akkor új játékot kell azonnal kezdeni.
 */
function endGameWorks() {
    if (checkFlipP.checked)
        currentPlayer = startPlayer ^= 1;
    else
        currentPlayer = 0;
    if (checkLoop.checked)
        gameReset();
}

/**
 * Egérgomb felengedése. Későbbi funkciók esetén használatos lehet.
 * @param {*} ev
 */
function mouseup(ev) {

}

/**
 * Egér elhagyja a játékmezőt, ennek lekezelése. (Ne maradjon ott az X vagy 0)
 * @param {*} ev
 */
function mouseleave(ev) {
    let cell = ev.target;
    if (isFree(cell))
        getSpan(cell).textContent = "";
}

/**
 * Egérkattintás a cellán. Csak akkor számít, ha engedélyezve van az egér ennek a játékosnak
 * @param {*} ev
 */
function click(ev) {
    if (mouseEnable[currentPlayer])
        clickCell(ev.target);
}

/**
 * Ezt kell csinálni cellára egérkattintás esetén. A numpad keyup után is ide jön.
 * @param {*} cell
 */
function clickCell(cell) {
    if (isFree(cell) && !aiPlayer[currentPlayer]) {
        Step(cell);
    }
}



/**
 * Megvizsgálja, hogy vége-e a játékak. Ha igen, el is végzi a szükséges teendőket, és visszatér true-val
 * Ha nincs vége, akkor false-al tér vissza.
 * @returns
 */
function checkEndGame() {
    let p1win = winState(gameState[0]) | 0;
    let p2win = winState(gameState[1]) | 0;
    if (p1win || p2win || (gameState[0] | gameState[1]) == 511) {
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
        stopWatch = 0;
        return true;
    } else
        return false;
}

/**
 * Játékos kiírt nevét adja meg, ha gép játszik az adott játékosként, akkor Computer. A jelet is odateszi,
 * kivéve akkor, ha a két jel azonos (jelenleg a kódban nincs ilyen lehetőség, de később lehet akár ilyen)
 * @param {*} player
 * @returns
 */
function getplayerName(player) {
    let symstr = symbol[0] == symbol[1] ? "" : ` (${symbol[player]})`;
    if (aiPlayer[player])
        return `Computer #${player + 1}` + symstr;
    else
        return `Player #${player + 1}` + symstr;
}

/**
 * Elvégzi a teendőket ha az egyik játékos nyer. checkEndGame hívja meg, ha a játék véget ért az egyik játékos győzelmével.
 * @param {*} player
 * @param {*} winline
 */
function winPlayer(player, winline) {
    let msg = `${getplayerName(player)} wins!`;
    winCounter[player]++;
    spanResult.textContent = msg;
    log(msg);
    cellDivs
        .filter((elem, i) => winline & 1 << i)
        .forEach(elem =>
            elem.classList.add(winCN)
        );
}

/**
 * Teendők elvégzése, ha a játék döntetlen.
 */
function drawGame() {
    let msg = "Draw!";
    drawCounter++;
    spanResult.textContent = msg;
    log(msg);
}

/**
 * Játék újraindítása, a megfelelő gomb megnyomására hívódik meg.
 * A nyert és döntetlen állásokat jelző érékek nem törlődnek.
 */
function gameReset() {
    currentPlayer = startPlayer;
    freeAllCells();
    delnumpadclass();
    gameState = [0, 0];
    spanResult.textContent = "";
    gameDiv.focus();
    stopper = [0, 0];
    stopWatch = Date.now();
    gameHistory = [];
    gameEnd = false;
    nextShow();
    aiStep();
}


/**
 * két játékállás azonos-e
 * @param {*} gState1 
 * @param {*} gState2 
 */
function sameGameState(gState1, gState2) {
    return gState1[0] == gState2[0] && gState1[1] == gState2[1];
}

/**
 * Az adott bináris játékállás győztes állás-e.
 * @param {*} state
 * @returns
 */
function winState(state) {
    return winStates.find(win => (state & win) == win);
}

/**
 * 2 x szerinti logaritmusa a konstans tömb szerint. (minden más értékre -1)
 * Ez a függvény csak arra szolgál, hogy megmondja, hogy egy adott lépés
 * (amely  binárisan egy darab 1-es a megadott mező bitjén) melyik cellát jelenti.
 * Csak aiStepGui fv. hívja meg.
 * @param {*} x
 * @returns
 */
function log2i(x) {
    return pow2.indexOf(x);
}

/**
 * A gépi lépés végrehajtásáért felel
 * @param {*} stepPow2
 */
function aiStepGui(stepPow2) {
    let step = log2i(stepPow2); // kettő hatvány formátumú lépést átkonvertáljuk index-re.
    let cell = cellDivs[step];
    cell.classList.add(aiStepCN);
    Step(cell);
}

/**
 * Kiválaszt véletlenszerűen a gép (ai) által adott tömbből, mely a gép által kiszámított lehetséges (egyenrangú) lépéseket tartalmazza.
 * @param {*} steps
 */
function aiStepRandomGui(steps) { // véletlenszerűen kiválaszt egy lépést a lehetőségek közül
    aiStepGui(steps[Math.floor(Math.random() * steps.length)]);
}

/**
 * Elkészíti azt az objektumot, amely az ai-nak lesz elküldve.
 * Az ai visszajövő üzenetének ellenőrző objektumát is ezzel hozzom létre.
 * @returns Az objektum
 */
function createPostObj() {
    return {
        gState: gameState,
        player: currentPlayer,
        isAI: aiPlayer[currentPlayer],
        depth: aiDepth[currentPlayer],
        winStates: winStates,
        loseChooseDepth: loseChooseDepth,
        timeout: aiTimeoutPerDepth[currentPlayer] * (aiDepth[currentPlayer] + 1),
        logEnable: logEnableAi
    }
}

/**
 * Gépi lépés vezérlése. Csak akkor csinál valamit ha az aktuális user gépi user. Ez a fv sok helyez meghívódik, ahol előállhat olyan
 * változás, hogy a gépnek lépnie kell.
 * Ha a gép van soron, létrehoza a Worker-t (persze csak akkor ha még nincs), és utána üzenetet továbbít PostMessage-el.
 */
function aiStep() {
    if (!gameEnd && aiPlayer[currentPlayer]) {
        if (aiWorker == null) {
            aiWorker = new Worker(aiWorkerFN);
            aiWorker.onmessage = aiWorkerOnMessage;
        }
        aiWorker.postMessage(createPostObj());
    }
}

/**
 * A Worker-ben futó ai válaszát ez a fv fogadja, és adja át a GUI-nak. Mivel a gép függetlenül dolgozik,
 * (és timer is van benne a gondolkodási idő szimulálására) ezért le kell ellenőrizni, hogy a viszsajött
 * válasz még az aktuális állásra vonatkozik-e. Az ai a válaszban visszaküldi az objektumot, amit neki küldtünk,
 * mely tartalmazza ezen ellenőrzés elvégzéséhez szükséges adatokat.
 * Az ai az objektum result kulcsában helyezi el a kiszámított lépések töbjét.
 * @param {*} e
 */
function aiWorkerOnMessage(e) {
    let obj = e.data; // bejövő üzenet objektum.
    let now = createPostObj(); // mostani állapot.
    if (now.isAI && sameGameState(obj.gState, now.gState) && obj.player == now.player && obj.depth == now.depth)
        aiStepRandomGui(obj.result);
    else {
        log('Wasted call', obj, now);
    }
}