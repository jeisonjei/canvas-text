
function setMode(mode) {
    var modeElement = document.querySelector('#mode');
    modeElement.textContent = 'mode: ' + mode;
}

function getMode() {
    var modeElement = document.querySelector('#mode');
    var mode = modeElement.textContent.split(' ').pop();
    return mode;
}

export { getMode, setMode }