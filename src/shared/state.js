import { TextBlock } from "../models/TextBlock";
import { Subject, fromEvent, map } from "rxjs";
import { getId } from "./common";

// ****************************************************************

var curTextLine = new TextBlock({}, [], null);
var textLinesCollection = [];

var fontSizeStep = 4;

var textLinesCollection$ = new Subject();


// ****************************************************************
textLinesCollection$.subscribe((v) => {
    if (v.fnName === 'push') {
        if (v.line.textArray.length > 0) {
            v.line.id = getId();
            textLinesCollection.push(v.line);
        }
    }
    else if (v.fnName === 'pop') {
        let index = textLinesCollection.indexOf(v.line.id);
        textLinesCollection = [...textLinesCollection.slice(0, index), ...textLinesCollection.slice(index + 1)];
    }
    console.log('textLinesCollection', textLinesCollection);
});

function addLine(line) {
    textLinesCollection$.next({ fnName: 'push', line: line });
}
function deleteLine(line) {
    textLinesCollection$.next({ fnName: 'pop', line: line });
}

// ****************************************************************

export { curTextLine, textLinesCollection, fontSizeStep, textLinesCollection$, addLine, deleteLine };
