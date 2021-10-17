//This <script></script> tag is replaced by the contents of the file in the "url" attribute of the <script> tag. Scripts inside file will not be started!
(async (script) => {
    try {
        script.insertAdjacentHTML("beforebegin", await (await fetch(script.getAttribute("url"))).text());
        script.parentElement.removeChild(script);
    } catch (error) {
        console.error(error);
    }
})(document.currentScript);