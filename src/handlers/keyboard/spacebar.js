import { a } from "../../shared/state";
import { cnv } from "../../shared/cnv";
import { textLinesCollection$, textLinesCollection } from "../../shared/state";
import { rerender } from "../..";

import { mat3 } from "gl-matrix";
import { getMode } from "../../shared/mode";


function handleSpacebarDown() {
    a.pan = true;
    a.isPanning = true;

    console.log(`** handleSpacebarDown **`);
}
function handleSpacebarUp() {

    console.log(`** handleSpacebarUp **`);

    a.pan = false;

    // --- text
    const tx = a.pan_tx ;
    const ty = a.pan_ty ;

    textLinesCollection.forEach(textLine => {
        console.log(textLine);
        textLine.start.x = textLine.start.x + tx;
        textLine.start.y = textLine.start.y + ty;

    });
    cnv.context.setTransform(new DOMMatrix([1, 0, 0, 1, 0, 0]));
    cnv.clear();
    rerender();

    console.log(`** textLinesCollection: ${textLinesCollection}`);

    // --- text

    a.pan_tx = 0;
    a.pan_ty = 0;


}


let spacebarPressed = false;

function registerSpacebarEvents() {
    document.addEventListener('keydown', (ev) => {
        if (ev.key === ' ' && !spacebarPressed && getMode()!=='text') {
            handleSpacebarDown();
            spacebarPressed = true;
        }
    });
    
    document.addEventListener('keyup', (ev) => {
        if (ev.key === ' ' && getMode()!== 'text') {
            handleSpacebarUp();
            spacebarPressed = false;
        }
    });
}

export { handleSpacebarDown, handleSpacebarUp, registerSpacebarEvents }