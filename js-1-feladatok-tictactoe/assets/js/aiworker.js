onmessage = function (e) {
    let obj = e.data;
    setTimeout(() => {
        // for (let i = 0; i < 10; i++)
        //     aiCalc(obj.gState, obj.player, obj.depth, obj.winStates, obj.looseChooseDepth);
        let result = aiCalc(obj.gState, obj.player, obj.depth, obj.winStates, obj.looseChooseDepth);
        obj.result = result;
        this.postMessage(obj);
    }, (obj.setTimeout));
}

function aiCheckWin(winStates, state) {
    return winStates.find(win => (state & win) == win);
}

function aiCalc(gState, player, depth, winStates, looseChooseDepth) {
    let tim = Date.now();
    let steps = getRegularSteps(gState[0], gState[1]);
    let stepsQualities = steps.map(step => stepQuality(gState[player] | step, gState[player ^ 1], depth, winStates)); // jellemzem az összes lehetséges lépést.
    let winSteps = steps.filter((step, index) => stepsQualities[index] > 0); // ezek a nyertes lépések
    let drawSteps = steps.filter((step, index) => stepsQualities[index] == 0); // ezek a döntetlen lépések
    if (depth == 9)
        console.log(Date.now() - tim);
    if (winSteps.length > 0) // van nyertes lépés
        return winSteps; // valamelyik nyertes lépést meglépjük
    else if (drawSteps.length > 0) // van döntetlen lépés
        return drawSteps; // valamelyik döntetlenre vezető lépést meglépjük
    else { // valamelyik lépést meglépjük, mind vereséghez vezet(het). Azt kell kiválasztani, amive a legtovább lehet húzni..
        for (let d = Math.min(looseChooseDepth, depth - 1); d > 1; d--) { // fokozatosan kevesebb okossággal hátha valamelyik lépés még döntetlen az adott mélységig.
            stepsQualities = steps.map(step => stepQuality(gState[player] | step, gState[player ^ 1], d, winStates)); // d depth esetén a minősége az adott lépéseknek
            drawSteps = steps.filter((step, index) => stepsQualities[index] >= 0);
            if (drawSteps.length > 0)
                return drawSteps;
        }
        let steps1 = steps.filter(step => aiCheckWin(winStates, gState[player ^ 1] | step));
        if (steps1.length > 0)
            return steps1;
        else
            return step; // elvileg ez nem lehet, mert azért került ide, mert több jó lépést tehet az ellenfél, hogy győzzön.
    }
}


function stepQuality(myState, oppState, depth, winStates) { // a myState már tartalmazza a vizsgálandó lépést is!
    if (depth-- == 0) // előrelátási mélység csökken, ha 0, akkor minden lépés mindegy lesz.
        return 0; // lejárt a mélység, nincs tovább figyelés.
    if (aiCheckWin(winStates, myState)) // ha ezzel nyerünk, akkor tuti lépés
        return 1;
    let oppSteps = getRegularSteps(myState, oppState); // milyen szabályos lépéseket léphet az ellenfél erre a lépésre.
    if (oppSteps.length == 0)
        return 0; // ha már nincs szabályos lépése, akkor döntentlen az állás.
    let oppQualities = oppSteps.map(st => stepQuality(oppState | st, myState, depth, winStates)); // ő milyennek látja az ő lépéseit, rekurzív hívás!
    let oppWin = oppQualities.filter(q => q > 0); // az ő szempontjából nyertes lépések.
    if (oppWin.length > 0)
        return -1;
    let oppLose = oppQualities.filter(q => q < 0); // az ő szempontjából vesztes lépések.
    if (oppLose.length == oppQualities.length) // az ő szempontjából minden lépés számára vesztes.
        return 1;
    return 0;
}


function getRegularSteps(gState0, gState1) { // szabályos lépések egy adott játékállásból
    let retVal = [];
    let nostep = gState0 | gState1;
    for (let i = 1; i <= 256; i <<= 1)
        if (!(nostep & i))
            retVal.push(i);
    return retVal;
}