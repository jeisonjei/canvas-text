
import { cnv } from "./cnv";
import { a as b } from "../../../../shared/globalState/a";
function setModeCanvasText(mode) {
    b.mode = mode;
    b.mode$.next(mode);
    if (mode === 'text') {
        cnv.context.canvas.style.cursor = 'default';
    }
    else if (mode === 'textEdit') {
        cnv.context.canvas.style.cursor = 'text';
    }
    else if (mode === 'select') {
        cnv.context.canvas.style.cursor = 'pointer';
    }
}

function getModeCanvasText() {
    var modeElement = document.querySelector('#mode');
    var mode = modeElement.textContent.split(' ').pop();
    return b.mode;
}

export { getModeCanvasText, setModeCanvasText }