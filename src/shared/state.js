import { TextBlock } from "../models/TextBlock";
import { Subject, fromEvent, map } from "rxjs";
import { getId } from "./common";
import { Cursor } from "../models/Cursor";

// ****************************************************************
var a = {
    curTextLine: new TextBlock({}, [], null, 'black'),
    cursor: new Cursor(null),
    zl: 1,
    zlc: 1,
    pan: false,
    isPanning: false,
    pan_tx: 0,
    pan_ty: 0,

    magnet: null,

    initFontSize: 60
}

var magnet$ = new Subject();

var fontSize$ = new Subject();

var textLinesCollection = [];

var fontSizeStep = 4;

var textLinesCollection$ = new Subject();

var selectedText$ = new Subject();


// ****************************************************************
magnet$.subscribe((v) => {
    a.magnet = {...v};
})
textLinesCollection$.subscribe((v) => {
    if (v.fnName === 'push') {
        if (v.line.textArray.length > 0) {
            v.line.id = getId();
            textLinesCollection.push(v.line);
        }
    }
    else if (v.fnName === 'pop') {
        let index = textLinesCollection.indexOf(v.line);
        textLinesCollection = [...textLinesCollection.slice(0, index), ...textLinesCollection.slice(index + 1)];
    }
});

function addLine(line) {
    textLinesCollection$.next({ fnName: 'push', line: line });
}
function deleteLine(line) {
    textLinesCollection$.next({ fnName: 'pop', line: line });
}

// ****************************************************************

export { a, textLinesCollection, fontSizeStep, textLinesCollection$, addLine, deleteLine, magnet$, fontSize$, selectedText$ };
