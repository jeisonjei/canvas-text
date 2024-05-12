import { cnv } from "../../shared/cnv.js";
import { getModeCanvasText, setModeCanvasText } from "../../shared/mode.js";
import { textLinesCollection$, a, textLinesCollection, deleteLine } from "../../shared/state.js";
import { rerender } from "../../index.js";



function registerModeChangeEventListener(event) {
    /**
     * Регистрирует событие нажатия клавиш. Только для смены режимов.
     * Основная регистрация событий нажатия клавиш осуществляется в модуле index.js
     */
    if (!event) {
        setModeCanvasText('select');
        document.addEventListener('keydown', registerModeChangeEventListener);
        return;
    };
    
    if (getModeCanvasText() !== 'text') {
        if (event.key === 's' || event.key === 'S' || event.key === 'ы') {
            setModeCanvasText('select');
        }
        else if (event.key === 'x' || event.key === 'X' || event.key === 'ч') {
            setModeCanvasText('textEdit');
        }
        else if (event.key === 't' || event.key === 'T' || event.key === 'е') {
            setModeCanvasText('text');
        }
        else if (event.key === 'Delete') {
            let selected = textLinesCollection.filter(line => line.selected);
            selected.forEach(line => deleteLine(line));
            cnv.clear();
            rerender();
        }
        else if (event.key === 'Escape') {
            setModeCanvasText('select');
        }

    }
    else {
        
        if (event.key === 'Escape' || event.key === 'Esc') {
            setModeCanvasText('select');

            if (a.curTextLine.textArray.length > 0) {
                textLinesCollection$.next({ fnName: 'push', line: a.curTextLine.clone() });
            }
            a.curTextLine.start = {};
            a.curTextLine.textArray = [];
            
        }
    }
}


export { registerModeChangeEventListener }