
import { getMode, setMode } from "../../shared/mode.js";
import { curTextLine} from "../../index.js";
import { textLinesCollection$ } from "../../index.js";

function registerModeChangeEventListener(event) {
    if (!event) {
        setMode('select');
        document.addEventListener('keydown', registerModeChangeEventListener);
        return;
    };
    if (getMode() !== 'text') {
        if (event.key === 's' || event.key === 'S' || event.key === 'ы') {
            setMode('select');
        }
        else if (event.key === 'e' || event.key === 'E' || event.key === 'у') {
            setMode('edit');
        }
        else if (event.key === 't' || event.key === 'T' || event.key === 'е') {
            setMode('text');
        }
    }
    else {
        if (event.key === 'Escape' || event.key === 'Esc') {
            setMode('select');

            if (curTextLine.textArray.length > 0) {
                textLinesCollection$.next({fnName:'push',line:curTextLine.clone()});    
            }
            curTextLine.start = {};
            curTextLine.textArray = [];
        }
    }
}


export { registerModeChangeEventListener }