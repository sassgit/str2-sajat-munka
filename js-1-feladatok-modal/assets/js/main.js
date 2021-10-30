const resultSpan = document.querySelector('#result');
function modalbtnClick(mode) {
    resultSpan.textContent = "";
    let p = showModal();
    if (mode)
        p.then(msg => resultSpan.textContent = `Modal close reason: ${msg}, id: ${msg.id}`);
}