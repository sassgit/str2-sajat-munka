const feetInput = document.querySelector("#feet");
const inchesInput = document.querySelector("#inches");
const resultsOutput = document.querySelector("#results");
const calculatorForm = document.querySelector("#calculator");
calculatorForm.onsubmit = (event) => {
    const feet = parseFloat(feetInput.value.replace(',','.'));
    const inches = parseFloat(inchesInput.value.replace(',','.'));
    if (isNaN(feet) || isNaN(inches))
        resultsOutput.textContent = "Please enter a valid number!";
    else if (feet < 0)
        resultsOutput.textContent = "Please enter a feet value > 0";
    else if (inches < 0 || inches >= 12)
        resultsOutput.textContent = "Please enter an inch value between 0 and 12";
    else {
        resultsOutput.textContent = `${Math.round((feet * 12 + inches) * 2.54)} cm`;
        feetInput.value = "";
        inchesInput.value = "";
    }
    event.preventDefault();
}