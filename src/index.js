import { fromEvent } from "rxjs";
import { map } from "rxjs";
import { Subject } from 'rxjs';
import { TextBlock } from './models/TextBlock.js';
import { Point } from './models/Point.js';
import { g as np } from './shared/common.js';
import { createCanvas } from "canvas";
import { cnv } from "./shared/cnv.js";

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

// ---------------------------------------------------------------- OBSERVERABLES

var functionCalled$ = new Subject();
functionCalled$.subscribe(fn => {
    if (['handleTyping', 'handleMousedown', 'handleMouseup'].includes(fn.self)) {
        // оказывается, что текущая позиция всегда рассчитывается одним и тем же способом
        let curPosition = np(curTextLine.start.x + cnv.getLineWidth(curTextLine), curTextLine.start.y);
        drawCursor(curPosition);
        drawBoundary();
    }
});

// ---------------------------------------------------------------- GLOBALS


var curTextLine = new TextBlock(new Point(0, 0), [], null);
var textLinesCollection = [];

var fontSizeStep = 4;



// ---------------------------------------------------------------- INITIALIZATION

(function () {
    cnv.init('canvas', window.innerWidth - 50, window.innerHeight - 50);

    curTextLine.fontSize = 60;
    cnv.setFontSize(curTextLine.fontSize);

})();


// ---------------------------------------------------------------- MOUSE AND KEYBOARD EVENT HANDLERS



function handleMousedown(mouse) {
    if (curTextLine.textArray.length > 0) {
        // если в текущей строке есть текст, то добавляем добавляем текущую строку в коллекцию
        textLinesCollection.push(curTextLine.clone());
    }
    curTextLine.start = {...mouse};
    curTextLine.textArray = [];

    cnv.clear();
    rerender();

    // --- functionCalled$ emmition
    functionCalled$.next({
        self: 'handleMousedown',
    });
}
function handleTyping(event) {
    if (event.key === 'Enter') {

        textLinesCollection.push(curTextLine.clone());
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


// ------------------------------------------------------------------ BUTTONS' EVENT HANDLERS
function handleButtonupClick(event) {
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
}

function handleButtondownClick(event) {
    cnv.setFontSize(curTextLine.fontSize - fontSizeStep);
    curTextLine.fontSize = curTextLine.fontSize - fontSizeStep;

    cnv.clear();
    printLine(curTextLine);
    rerender();

    this.blur();

    // --- functionCalled$ emmition
    functionCalled$.next({self:'handleButtondownClick'});
}






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
    cnv.context.fillText(line.textArray.join(''), line.start.x, line.start.y);
    cnv.setFontSize(curTextLine.fontSize);

    // --- functionCalled$ emmition
    functionCalled$.next({self:'printLine'});
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
    functionCalled$.next({self:'rerender'});
}

function drawCursor(position) {

    cnv.context.strokeStyle = 'blue';
    cnv.context.lineWidth = 2;

    cnv.context.beginPath();
    cnv.context.moveTo(position.x, position.y);
    cnv.context.lineTo(position.x, position.y - cnv.getCursorHeight());
    cnv.context.stroke();

    // --- functionCalled$ emmition
    functionCalled$.next({self:'drawCursor'});

}

function drawBoundary() {
    var [p1, p2, p3, p4] = curTextLine.getBoundary();
    cnv.context.strokeStyle = 'red';
    cnv.context.lineWidth = 2;
    cnv.context.beginPath();
    cnv.context.moveTo(p1.x, p1.y);
    cnv.context.lineTo(p2.x, p2.y);
    cnv.context.lineTo(p3.x, p3.y);
    cnv.context.lineTo(p4.x, p4.y);
    cnv.context.lineTo(p1.x, p1.y);
    cnv.context.stroke();

    // --- functionCalled$ emmition
    functionCalled$.next({self:'drawBoundary'});
}





// ---------------------------------------------------------------- EVENTS BINDING

fromEvent(cnv.context.canvas, 'mousedown').pipe(map(v => np(v.clientX - cnv.context.canvas.offsetLeft, v.clientY - cnv.context.canvas.offsetTop))).subscribe(handleMousedown);
fromEvent(document, 'keydown').subscribe(handleTyping);

document.querySelector('#font-size-up').addEventListener('click', handleButtonupClick);
document.querySelector('#font-size-down').addEventListener('click', handleButtondownClick);

// ----------------------------------------------------------------

