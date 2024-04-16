import { cnv } from "../../shared/cnv.js";
import { getMode, setMode } from "../../shared/mode.js";
import { textLinesCollection$, a, textLinesCollection, deleteLine } from "../../shared/state.js";
import { rerender } from "../../index.js";



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
        else if (event.key === 'Delete') {
            let selected = textLinesCollection.filter(line => line.selected);
            selected.forEach(line => deleteLine(line));
            cnv.clear();
            rerender();
        }

    }
    else {
        if (event.key === 'Escape' || event.key === 'Esc') {
            setMode('select');

            if (a.curTextLine.textArray.length > 0) {
                textLinesCollection$.next({ fnName: 'push', line: a.curTextLine.clone() });
            }
            a.curTextLine.start = {};
            a.curTextLine.textArray = [];
        }
    }
}


export { registerModeChangeEventListener }