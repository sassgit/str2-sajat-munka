const modalContainer = document.getElementById("myModal");
const modalContent = document.getElementById("myModal-content");
const modalXclose = document.getElementsByClassName("modal-close")[0];
const modalButtons = document.getElementsByClassName("modal-btn");
const idConversion = ['U', '0', 'O', 'C', 'X', 'E']; // null -> -1, undefined -> 0, "" -> 1, Ok -> 2, Cancel -> 3, Xbutton -> 4, External -> 5 
let resolveFunc;

function modalMessage(msg) {
    this.msg = msg;
    msg = (msg + "0").toString();
    this.id = idConversion.indexOf(msg.toUpperCase()[0]) - 2; // null -> -3, undefined -> -2, "" -> -1, Ok -> 0, Cancel -> 1, Xbutton -> 2, External -> 3
}
modalMessage.prototype.toString = function () {
    return this.msg;
}

function showModal() {
    modalContainer.style.display = "block";
    return new Promise(f => resolveFunc = f);
}

modalContainer.addEventListener("animationend", () => {
    if (modalContainer.classList.contains("modal-container-end")) {
        modalContainer.style.display = "none";
        modalContainer.classList.remove("modal-container-end");
        modalContent.classList.remove("modal-content-end");
    }
});

for (let e of modalButtons)
    (e.addEventListener("click", e => endmodal(e)));



function sendMessage(message) {
    let mObj = new modalMessage(message);
    resolveFunc(mObj);
    console.log(mObj);
}

function endmodal(e) {
    modalContainer.classList.add("modal-container-end");
    modalContent.classList.add("modal-content-end");
    if (typeof e != "object")
        sendMessage("External click close");
    else if (e.srcElement == modalXclose)
        sendMessage("X close");
    else if (e.srcElement == modalButtons[0])
        sendMessage("Cancel");
    else if (e.srcElement == modalButtons[1])
        sendMessage("Ok");
}

modalXclose.onclick = function (e) {
    endmodal(e);
}

window.addEventListener("click", function (event) {
    if (event.target == modalContainer) endmodal();
});