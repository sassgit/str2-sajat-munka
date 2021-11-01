const resultSpan = document.querySelector('#result');
const modalContents = document.querySelectorAll('.modal-content')
Array.from(document.querySelectorAll('.button-container button')).forEach(btn => btn.addEventListener('click', () => resultSpan.textContent = ''));

const modalbtnClick = index => showModal(modalContents[index])
    .then(msg => resultSpan.textContent = `Modal #${index + 1} close reason: ${msg}, id: ${msg.id}`);

let testAsync = async () => {
    while (true) {
        let result = await showModal(modalContents[3]);
        if (result.id < 100)
            break;
        modalContents[4].querySelector('main p').textContent = `You have choosen option ${result.id - 99}`;
        if ((await showModal(modalContents[4])).id || (await showModal(modalContents[5])).id)
            break;
    }
}