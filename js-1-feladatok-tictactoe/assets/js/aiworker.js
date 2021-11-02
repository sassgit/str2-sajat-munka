'use strict';
//AI, mely lépések tömbjét adja, melyek már egyenrangú lépések a számítás szerint.
//A lépés számítás kulcsa a rekurzív stepQuality függvény!

/**
 * Bejövő üzenetek kezelése. Kimenet várakoztatása a megadott timeout szerint.
 */
onmessage = function (e) {
    let obj = e.data;
    let tim = Date.now();
    obj.result = aiCalc(obj.gState, obj.player, obj.depth, obj.winStates, obj.loseChooseDepth, obj.logEnable);
    obj.timeout = Math.min(obj.timeout, Math.max(0, obj.timeout - (Date.now() - tim)));
    setTimeout(() => {
        this.postMessage(obj);
    }, (obj.timeout));
}

/**
 * Megadja hogy egy adott lépés győzelem-re vezet-e.
 * @param {*} winStates 
 * @param {*} state 
 * @returns 
 */
function aiCheckWin(winStates, state) {
    return winStates.find(win => (state & win) == win);
}

/**
 * A bejövő adatokkal ez a fv hívódik meg. Kiszámolja a lehetséges lépéseket, és mindegyikre meghívja a rekurzív stepQuality fv-t.
 * Az eredmények szerint készíti el a válasz tömböt.
 * @param {*} gState 
 * @param {*} player 
 * @param {*} depth 
 * @param {*} winStates 
 * @param {*} loseChooseDepth 
 * @param {*} logEnable 
 * @returns 
 */
function aiCalc(gState, player, depth, winStates, loseChooseDepth, logEnable) {
    let tim = Date.now();
    let steps = getRegularSteps(gState[0], gState[1]);
    let diagcounterArray = [0];
    let stepsQualities = steps.map(step => stepQuality(gState[player] | step, gState[player ^ 1], depth, winStates, diagcounterArray)); // jellemzem az összes lehetséges lépést.
    if (logEnable)
        console.log(`${diagcounterArray[0]} function calls, ${Date.now() - tim} msec.`);
    let winSteps = steps.filter((step, index) => stepsQualities[index] > 0); // ezek a nyertes lépések
    let drawSteps = steps.filter((step, index) => stepsQualities[index] == 0); // ezek a döntetlen lépések
    if (winSteps.length > 0) // van nyertes lépés
        return winSteps; // valamelyik nyertes lépést meglépjük
    else if (drawSteps.length > 0) // van döntetlen lépés
        return drawSteps; // valamelyik döntetlenre vezető lépést meglépjük
    else { // valamelyik lépést meglépjük, mind vereséghez vezet(het). Azt kell kiválasztani, amive a legtovább lehet húzni..
        for (let d = Math.min(loseChooseDepth, depth - 1); d > 1; d--) { // fokozatosan kevesebb okossággal hátha valamelyik lépés még döntetlen az adott mélységig.
            stepsQualities = steps.map(step => stepQuality(gState[player] | step, gState[player ^ 1], d, winStates)); // d depth esetén a minősége az adott lépéseknek
            drawSteps = steps.filter((step, index) => stepsQualities[index] >= 0);
            if (drawSteps.length > 0)
                return drawSteps;
        }
        let steps1 = steps.filter(step => aiCheckWin(winStates, gState[player ^ 1] | step));
        if (steps1.length > 0)
            return steps1;
        else {
            if (logEnable)
                console.log('Curious situation...', steps)
            return steps; // elvileg ez nem lehet, mert azért került ide, mert több jó lépést tehet az ellenfél, hogy győzzön.
        }
    }
}

/**
 * Egy lehetséges lépést jellemez. A mystate már tartalmazza a lépést.
 * Ha nem lehet rögtön eldönteni, a fv meghívja rekurzívan saját magát
 * az ellenfél lehetséges lépéseivel, hogy az ellenfél számára milyenek 
 * az egyes lépések. A rekurzió a megoldásig, vagy a depth 0-vá válásáig 
 * tart. Ha depth csökkentés előtt már 0, akkor a fv 0 val tér vissza.
 * @param {*} myState 
 * @param {*} oppState 
 * @param {*} depth szabályozza a maximális rekurzív mélységet.
 * @param {*} winStates 
 * @param {*} counterArray 
 * @returns -1 ha vesztes lépés, mert az ellenfél alkalmas stratégiával nyerhet. 0 ha döntetlen, 1 ha ez nyerő lépés
 */
function stepQuality(myState, oppState, depth, winStates, counterArray) { // a myState már tartalmazza a vizsgálandó lépést is!
    if (counterArray)
        counterArray[0]++;
    if (depth-- == 0) // előrelátási mélység csökken, ha 0, akkor minden lépés mindegy lesz.
        return 0; // lejárt a mélység, nincs tovább figyelés.
    if (aiCheckWin(winStates, myState)) // ha ezzel nyerünk, akkor tuti lépés
        return 1;
    let oppSteps = getRegularSteps(myState, oppState); // milyen szabályos lépéseket léphet az ellenfél erre a lépésre.
    if (oppSteps.length == 0)
        return 0; // ha már nincs szabályos lépése, akkor döntentlen az állás.
    let oppQualities = oppSteps.map(st => stepQuality(oppState | st, myState, depth, winStates, counterArray)); // ő milyennek látja az ő lépéseit, rekurzív hívás!
    let oppWin = oppQualities.filter(q => q > 0); // az ő szempontjából nyertes lépések.
    if (oppWin.length > 0)
        return -1;
    let oppLose = oppQualities.filter(q => q < 0); // az ő szempontjából vesztes lépések.
    if (oppLose.length == oppQualities.length) // az ő szempontjából minden lépés számára vesztes.
        return 1;
    return 0;
}


/**
 * Egy tömb választ ad arról, hogy egy adott játékállásnál milyen szabályos lépések vannak.
 * @param {*} gState0 
 * @param {*} gState1 
 * @returns 
 */
function getRegularSteps(gState0, gState1) { // szabályos lépések egy adott játékállásból
    let retVal = [];
    let nostep = gState0 | gState1;
    for (let i = 1; i <= 256; i <<= 1)
        if (!(nostep & i))
            retVal.push(i);
    return retVal;
}