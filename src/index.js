import { fromEvent } from "rxjs";
import { map } from "rxjs";
import { Subject } from 'rxjs';
import { TextBlock } from './models/TextBlock.js';
import { Point } from './models/Point.js';
import { g as np } from './shared/common.js';
import { createCanvas } from "canvas";
import { cnv } from "./shared/cnv.js";


// ---------------------------------------------------------------- GLOBALS


var curTextLine = new TextBlock(new Point(0, 0), [], null);
var textLinesCollection = [];



// ---------------------------------------------------------------- INITIALIZATION

(function () {
    cnv.init('canvas', window.innerWidth - 50, window.innerHeight - 50);

    curTextLine.fontSize = 60;
    cnv.setFontSize(curTextLine.fontSize);

})();




// ---------------------------------------------------------------- EVENT HANDLERS



function handleMousedown(mouse) {
    if (curTextLine.textArray.length > 0) {
        // если в текущей строке есть текст, то добавляем добавляем текущую строку в коллекцию
        textLinesCollection.push(curTextLine.clone());
    }
    curTextLine.start = mouse;
    curTextLine.textArray = [];

    cnv.clear();
    drawCursor(np(mouse));
    rerender();
}
function handleTyping(event) {
    if (event.key === 'Enter') {
        
        textLinesCollection.push(curTextLine.clone());
        curTextLine.textArray = [];
        curTextLine.start = np(curTextLine.start.x, curTextLine.start.y + cnv.getLineSpace());

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

    var curPosition = np(curTextLine.start.x + cnv.getLineWidth(curTextLine), curTextLine.start.y);
    drawCursor(curPosition);
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
}

function drawCursor(position) {
    
    cnv.context.strokeStyle = 'blue';
    cnv.context.lineWidth = 2;

    cnv.context.beginPath();
    cnv.context.moveTo(position.x, position.y);
    cnv.context.lineTo(position.x, position.y - cnv.getCursorHeight());
    cnv.context.stroke();

}





// ---------------------------------------------------------------- EVENTS BINDING

fromEvent(cnv.context.canvas, 'mousedown').pipe(map(v => np(v.clientX - cnv.context.canvas.offsetLeft, v.clientY - cnv.context.canvas.offsetTop))).subscribe(handleMousedown);
fromEvent(document, 'keydown').subscribe(handleTyping);


document.querySelector('#font-size-up').addEventListener('click', () => {

    cnv.setFontSize(curTextLine.fontSize + 2);
    curTextLine.fontSize = curTextLine.fontSize + 2;

    cnv.clear();
    printLine(curTextLine);
    rerender();


    var curWidth = cnv.context.measureText(curTextLine.textArray.join('')).width;
    var curPos = np(curTextLine.start.x + curWidth, curTextLine.start.y);
    drawCursor(curPos);


    buttonUp.blur();

});

document.querySelector('#font-size-down').addEventListener('click', () => {
    cnv.setFontSize(curTextLine.fontSize - 2);
    curTextLine.fontSize = curTextLine.fontSize - 2;

    cnv.clear();
    printLine(curTextLine);
    rerender();

    var curWidth = cnv.context.measureText(curTextLine.textArray.join('')).width;
    var curPos = np(curTextLine.start.x + curWidth, curTextLine.start.y);
    drawCursor(curPos);


    buttonDown.blur();
});

// ----------------------------------------------------------------
