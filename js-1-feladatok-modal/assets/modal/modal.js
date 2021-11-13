const consoleLogEnable = false;

let resolveFunction;

class modalMessage {
    constructor(id, msg) {
        this.id = id;
        this.msg = msg;
    }
    toString() {
        return `(${this.id}) ${this.msg}`;
    }
}


function endModal(modalContainer, modalContent, id, message) {
    modalContainer.classList.add('modal-container-end');
    modalContent.classList.add('modal-content-end');
    let mObj = new modalMessage(id, message);
    resolveFunction(mObj);
    if (consoleLogEnable)
        console.log(modalContent, mObj);
}

function showModal(modalContent) {
    if (!modalContent)
        modalContent = document.querySelector('.modal-container .modal-content');
    const modalContainer = modalContent.parentElement;
    const xButton = modalContent.querySelector('.modal-close');
    const okButton = modalContent.querySelector('.modal-btn-ok');
    const cancelButton = modalContent.querySelector('.modal-btn-cancel');

    const builtinButtons = [xButton, okButton, cancelButton].filter(e => e);
    const customButtons = Array.from(modalContent.querySelectorAll('.modal-btn')).filter(butt => !builtinButtons.includes(butt));
    const allbuttons = [...builtinButtons, ...customButtons];

    const buttonHandler = (e) => {
        if (xButton && e.target == xButton)
            endModal(modalContainer, modalContent, 2, "X close");
        else if (cancelButton && e.target == cancelButton)
            endModal(modalContainer, modalContent, 1, "Cancel");
        else if (okButton && e.target == okButton)
            endModal(modalContainer, modalContent, 0, "Ok button");
        else if (customButtons.includes(e.target)) {
            let idx = customButtons.indexOf(e.target);
            endModal(modalContainer, modalContent, idx + 100, `Custom button ${idx}`);
        }
    }

    const containerHandler = (e) => {
        if (e.target == modalContainer)
            endModal(modalContainer, modalContent, 3, "External click close");
    }


    allbuttons.forEach(butt => butt.onclick = buttonHandler);
    modalContainer.onclick = containerHandler;

    modalContainer.onanimationend = () => {
        if (modalContainer.classList.contains("modal-container-end")) {
            modalContainer.style.display = "none";
            modalContainer.classList.remove("modal-container-end");
            modalContent.classList.remove("modal-content-end");        
            allbuttons.forEach(butt => butt.onclick = null);
            modalContainer.onclick = null;
        }
    }
    //ha egy előző megjelenítés animáció még nem zajlott volna le teljesen.
    modalContainer.onanimationend();

    modalContainer.style.display = "block";
    modalContent.focus();
    return new Promise(f => resolveFunction = f);
}