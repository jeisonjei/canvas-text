import { textLinesCollection } from "../../index";
import { getMode } from "../../shared/mode";

function registerMouseMoveEventListener(event) {
    if (!event) {
        document.addEventListener('mousemove', registerMouseMoveEventListener);
        return;
    }
    if (getMode() === 'select') {
        
    }
    if (getMode() === 'edit') {

    }
}

export {registerMouseMoveEventListener}