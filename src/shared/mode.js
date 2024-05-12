
import { cnv } from "./cnv";
function setModeCanvasText(mode) {
    var modeElement = document.querySelector('#mode');
    modeElement.textContent = 'mode: ' + mode;
    if (mode === 'text') {
        cnv.context.canvas.style.cursor = 'default';
    }
    else if (mode === 'textEdit') {
        cnv.context.canvas.style.cursor = 'text';
    }

    console.log('** setmode text **');
}

function getModeCanvasText() {
    var modeElement = document.querySelector('#mode');
    var mode = modeElement.textContent.split(' ').pop();
    return mode;
}

export { getModeCanvasText, setModeCanvasText }