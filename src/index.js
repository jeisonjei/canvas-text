import { fromEvent } from "rxjs";
import { map } from "rxjs";
import { Subject } from 'rxjs';
import { TextBlock } from './models/TextBlock.js';
import { Point } from './models/Point.js';
import { g as np, isEmpty } from './shared/common.js';
import { cnv } from "./shared/cnv.js";
import { registerModeChangeEventListener } from "./handlers/keyboard/mode.js";
import { getId } from "./shared/common.js";
import { textLinesCollection, textLinesCollection$, curTextLine, fontSizeStep, addLine } from "./shared/state.js";


import { getMode } from "./shared/mode.js";

/**
 * # Описание программы
 * --------------------
 * Редактор текста на canvas.
 * Заметки по структуре программы:
 * - В целом что глубоко вложенные функции стараемся не использовать, так как часто это больше запутывает, чем помогает. Иногда
 * длинная функция может быть понятнее, чем короткая со множеством вложенных функций. По возможности
 * вложенные функции используются только если они имеют ясное, однозначное имя и делают что-то одно. Например 
 * вместо того, чтобы включать вызов cnv.clear() внутрь функций printLine() и rerender(), она вызывается явно,
 * рядом с этими функциями, для того, чтобы было понятно, что происходит.
 *  
 */

// ---------------------------------------------------------------- OTHER EVENT LISENERS REGISTRATION
registerModeChangeEventListener();

// ---------------------------------------------------------------- OBSERVERABLES

var functionCalled$ = new Subject();
functionCalled$.subscribe(fn => {
    if (['handleTyping', 'handleMousedown', 'handleButtondownClick', 'handleButtonupClick'].includes(fn.self)) {
        // оказывается, что текущая позиция всегда рассчитывается одним и тем же способом
        let curPosition = np(curTextLine.start.x + cnv.getLineWidth(curTextLine), curTextLine.start.y);

        drawCursor(curPosition);
    }
});


// ---------------------------------------------------------------- INITIALIZATION

(function () {
    cnv.init('canvas', window.innerWidth - 50, window.innerHeight - 50);

    curTextLine.fontSize = 60;
    cnv.setFontSize(curTextLine.fontSize);

})();


// ---------------------------------------------------------------- MOUSE AND KEYBOARD EVENT HANDLERS



function handleMousedown(mouse) {
    if (getMode() === 'select') {
        textLinesCollection.forEach(line => {
            if (line.isinBoundary(mouse)) {
                line.selected = !line.selected;
            }
        })

    }

    else if (getMode() === 'text') {

        addLine(curTextLine.clone());

        curTextLine.start = { ...mouse };
        curTextLine.textArray = [];
    }

    cnv.clear();
    rerender();

    // --- functionCalled$ emmition
    functionCalled$.next({
        self: 'handleMousedown',
    });
};
function handleTyping(event) {
    if (getMode() !== 'text') return;

    if (event.key === 'Enter') {

        addLine(curTextLine.clone());
        curTextLine.textArray = [];
        curTextLine.start = np(curTextLine.start.x, curTextLine.start.y + cnv.getLineSpace(curTextLine));

        cnv.clear();
        rerender();

    }
    else if (event.key === 'Backspace') {
        curTextLine.textArray.pop();

        cnv.clear();
        printLine(curTextLine);

        rerender();
    }
    else {

        if (isEmpty(curTextLine.start)) return;  /** Когда этот объект пустой? При инициализации программы и при нажатии Escape */

        curTextLine.textArray.push(event.key);

        cnv.clear();
        printLine(curTextLine);

        rerender();
    }


    // --- functionCalled$ emmition
    functionCalled$.next({
        self: 'handleTyping'
    });
}

function handleMousemove(mouse) {

    if (getMode() === 'text') return;

    if (getMode() === 'select') {
        textLinesCollection.forEach(line => {
            if (line.isinBoundary(mouse)) {
                cnv.clear();
                rerender();
                drawBoundary(line);
            }
        });
        let a = textLinesCollection.some(line=>line.isinBoundary(mouse));
        if (!a) {
            cnv.clear();
            rerender();
        }
    }
    if (getMode() === 'edit') {

    }
}



// ------------------------------------------------------------------ BUTTONS' EVENT HANDLERS


(function handleButtonupClick(event) {
    if (!event) {
        document.querySelector('#font-size-up').addEventListener('click', handleButtonupClick);
        return;
    }
    cnv.setFontSize(curTextLine.fontSize + fontSizeStep);
    curTextLine.fontSize = curTextLine.fontSize + fontSizeStep;

    cnv.clear();
    printLine(curTextLine);
    rerender();
    this.blur();

    // --- functionCalled$ emmition
    functionCalled$.next({
        self: 'handleButtonupClick'
    });
})();

(function handleButtondownClick(event) {
    if (!event) {
        document.querySelector('#font-size-down').addEventListener('click', handleButtondownClick);
        return;
    }
    cnv.setFontSize(curTextLine.fontSize - fontSizeStep);
    curTextLine.fontSize = curTextLine.fontSize - fontSizeStep;
    cnv.clear();
    printLine(curTextLine);
    rerender();
    this.blur();
    // --- functionCalled$ emmition
    functionCalled$.next({ self: 'handleButtondownClick' });
})();






// ------------------------------------------------------------------ RENDERING
function printLine(line) {
    /**
     * Функция отрисовывает текст аргумента line.
     * Принимает параметр line - объект TextBlock.
     * Сначала устанавливает шрифт текста из значения line.fontSize,
     * затем отрисовывает текст с заданным шрифтом,
     * а затем возвращает размер текста на значение размера текущей строки.
     * Если отрисовывается только одна текущая строка, то устанавливаемый и восстанавливаемый размер шрифта совпадают.
     */
    cnv.setFontSize(line.fontSize);
    cnv.context.fillStyle = line.color;
    cnv.context.fillText(line.textArray.join(''), line.start.x, line.start.y);
    cnv.setFontSize(curTextLine.fontSize);
    cnv.context.fillStyle = curTextLine.color;

    // --- functionCalled$ emmition
    functionCalled$.next({ self: 'printLine' });
}

function rerender() {
    /**
     * Массив textLines не содержит текущую строку. 
     * То есть в программе везде разделяется отрисовка текущей строки и коллекции уже существующих строк.
     * Для отрисовки текущей строки используется функция printLine(curTextLine),
     * а для отрисовки коллекции уже существующих строк используется та же функция, но в неё уже не передаётся текущая строка.
     */

    textLinesCollection.forEach(line => {
        printLine(line);
    });

    // --- functionCalled$ emmition
    functionCalled$.next({ self: 'rerender' });
}

function drawCursor(position) {

    cnv.context.strokeStyle = 'blue';
    cnv.context.lineWidth = 2;

    cnv.context.beginPath();
    cnv.context.moveTo(position.x, position.y);
    cnv.context.lineTo(position.x, position.y - cnv.getCursorHeight());
    cnv.context.stroke();

    // --- functionCalled$ emmition
    functionCalled$.next({ self: 'drawCursor' });

}

function drawBoundary(line) {
    var curColor = cnv.context.strokeStyle;
    var { p1, p2, p3, p4 } = line.getBoundary();
    cnv.context.strokeStyle = 'red';
    cnv.context.lineWidth = 2;
    cnv.context.beginPath();
    cnv.context.moveTo(p1.x, p1.y);
    cnv.context.lineTo(p2.x, p2.y);
    cnv.context.lineTo(p3.x, p3.y);
    cnv.context.lineTo(p4.x, p4.y);
    cnv.context.lineTo(p1.x, p1.y);
    cnv.context.stroke();
    cnv.context.strokeStyle = curColor;

    // --- functionCalled$ emmition
    functionCalled$.next({ self: 'drawBoundary' });
}



fromEvent(cnv.context.canvas, 'mousedown').pipe(map(v => np(v.clientX - cnv.context.canvas.offsetLeft, v.clientY - cnv.context.canvas.offsetTop))).subscribe(handleMousedown);
fromEvent(cnv.context.canvas, 'mousemove').pipe(map(v => np(v.clientX - cnv.context.canvas.offsetLeft, v.clientY - cnv.context.canvas.offsetTop))).subscribe(handleMousemove);
fromEvent(document, 'keydown').subscribe(handleTyping);


export { rerender}