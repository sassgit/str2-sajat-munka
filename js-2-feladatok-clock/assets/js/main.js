const hourDigits = document.querySelectorAll("#hours .digit");
const minuteDigits = document.querySelectorAll("#minutes .digit");
const secondDigits = document.querySelectorAll("#seconds .digit");
const writeDigits = (elements, value) => (elements[0].textContent = Math.floor(value / 10), elements[1].textContent = value % 10);
const pad0 = value => value.toString().padStart(2, '0');
const writeTime = () => {
    let date = new Date();
    writeDigits(hourDigits, date.getHours());
    writeDigits(minuteDigits, date.getMinutes());
    writeDigits(secondDigits, date.getSeconds());
    document.title = `${pad0(date.getHours())}:${pad0(date.getMinutes())}:${pad0(date.getSeconds())}`;
}
writeTime();
setTimeout(() => (writeTime(), setInterval(writeTime, 1000)), 1000 - new Date().getMilliseconds());
