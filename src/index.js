/**
 * TODO:
 * ДОДЕЛАТЬ ЭТОТ ПАКЕТ И ВЕРНУТЬСЯ К РАЗРАБОТКЕ ОСНОВНОЙ ПРОГРАММЫ tomat.sapr
 */

import { fromEvent, tap } from "rxjs";
import { map, filter } from "rxjs";
import { Subject } from "rxjs";
import { g as np, isEmpty } from "./shared/common.js";
import { cnv } from "./shared/cnv.js";
import { registerModeChangeEventListener } from "./handlers/keyboard/mode.js";
import {
  textLinesCollection,
  a,
  fontSizeStep,
  addLine,
  deleteLine,
} from "./shared/state.js";

import { getModeCanvasText, setModeCanvasText } from "./shared/mode.js";
import { filterText } from "./services/textFilter.js";
import { registerMouseWheelEvent } from "./handlers/mouse/wheel.js";
import { registerSpacebarEvents } from "./handlers/keyboard/spacebar.js";

import { mat3 } from "gl-matrix";

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
 * При использовании этой библиотеки извне и потребности перемещать и копировать текст - функциональность,
 * которая в текущей версии не предусмотрена, нужно импортировать коллекцию textLinesCollection.
 * Причём извне допускается только изменение объектов коллекции,
 * а добавление и удаление строк нужно производить через издатель textLinesCollection$.
 *
 */

function initCanvasText(canvasSelector, canvasWidth, canvasHeight, fontName) {
  cnv.init(canvasSelector, canvasWidth, canvasHeight, fontName);
  fromEvent(document, "mousedown")
    
    .pipe(
      map((v) =>
        np(
          v.clientX - cnv.context.canvas.offsetLeft,
          v.clientY - cnv.context.canvas.offsetTop
        )
      )
    )
    .subscribe(handleMousedown);

  fromEvent(document, "mousemove")
    .pipe(
      map((v) =>
        np(
          v.clientX - cnv.context.canvas.offsetLeft,
          v.clientY - cnv.context.canvas.offsetTop
        )
      )
    )
    .subscribe(handleMousemove);
  fromEvent(document, "keydown")
    .pipe(filter((event) => filterText(event)))
    .subscribe(handleTyping);
  
  registerModeChangeEventListener();
  registerMouseWheelEvent();
  registerSpacebarEvents();

  a.curTextLine.fontSize = a.initFontSize;
  cnv.setFontSize(a.curTextLine.fontSize);

}

// initCanvasText('canvas', window.innerWidth - 50, window.innerHeight - 50, "Arial");


// ---------------------------------------------------------------- OBSERVERABLES

var functionCalled$ = new Subject();
functionCalled$.subscribe((fn) => {
  if (
    [
      "handleTyping",
      "handleArrowLeft",
      "handleArrowRight",
      "handleArrowUp",
      "handleArrowDown",
      "letterInTheMiddle",
      "handleBackspaceInTheMiddle",
      "handleMousedown",
      "handleButtondownClick",
      "handleButtonupClick",
      "setFont"
    ].includes(fn.self)
  ) {
    /**
     * Вспомогательные функции будут располагаться здесь, в одном месте. Это удобно, так как сразу можно видеть
     * из каких функций эти вспомогательные операции вызываются.
     * Ко вспомогательным функциям относится всё, что напрямую не связано с главными функциями, коими являются
     * операции ввода - то есть взаимодействия пользователя с полотном посредством мыши или клавиатуры
     */
    if (
      [
        "handleTyping",
        "handleMousedown",
        "handleButtondownClick",
        "handleButtonupClick",
        "handleArrowUp",
        "handleArrowDown",
        "setFont"
      ].includes(fn.self)
    ) {
      a.cursor.pos = np(
        a.curTextLine.start.x + cnv.getLineWidth(a.curTextLine),
        a.curTextLine.start.y
      );
      a.cursor.index = a.curTextLine.textArray.length;
    } else if (fn.self === "handleArrowLeft") {
      a.cursor.index = a.cursor.index - 1;
      let letter = a.curTextLine.textArray[a.cursor.index];
      if (letter === undefined) {
        a.cursor.pos = a.cursor.pos;
        a.cursor.index = a.cursor.index + 1;
        return;
      }
      let letterWidth = cnv.context.measureText(letter).width;
      a.cursor.pos = a.cursor.pos.subtract(np(letterWidth, 0));
    } else if (fn.self === "handleArrowRight") {
      a.cursor.index = a.cursor.index + 1;
      let letter = a.curTextLine.textArray[a.cursor.index - 1];
      if (letter === undefined) {
        a.cursor.pos = a.cursor.pos;
        a.cursor.index = a.cursor.index - 1;
        return;
      }
      let letterWidth = cnv.context.measureText(letter).width;
      a.cursor.pos = a.cursor.pos.add(np(letterWidth, 0));
    }
    else if (fn.self === "letterInTheMiddle") {
      a.cursor.index = a.cursor.index + 1;
      let letter = a.curTextLine.textArray[a.cursor.index - 1];
      if (letter === undefined) {
        a.cursor.pos = a.cursor.pos;
        a.cursor.index = a.cursor.index - 1;
        return;
      }
      let letterWidth = cnv.context.measureText(letter).width;
      a.cursor.pos = a.cursor.pos.add(np(letterWidth, 0));
    } else if (fn.self === "handleBackspaceInTheMiddle") {
      if (a.cursor.index <= 0) {
        a.cursor.pos = np(a.curTextLine.start.x, a.curTextLine.start.y);
        a.cursor.index = 0;
        return;
      }
      a.cursor.index = a.cursor.index - 1;
      let letter = a.curTextLine.textArray.splice(a.cursor.index, 1);
      let letterWidth = cnv.context.measureText(letter).width;

      a.cursor.pos = a.cursor.pos.subtract(np(letterWidth, 0));
    }
  }
});

// ---------------------------------------------------------------- MOUSE AND KEYBOARD EVENT HANDLERS

function handleMousedown(mouse) {
  if (getModeCanvasText() === "select") {
    textLinesCollection.forEach((line) => {
      if (line.isinBoundary(mouse)) {
        line.selected = !line.selected;
      }
    });
  } else if (getModeCanvasText() === "textEdit") {
    let selectedLine = textLinesCollection.find((line) =>
      line.isinBoundary(mouse)
    );

    if (selectedLine) {
      a.curTextLine = selectedLine.clone();
      deleteLine(selectedLine);

      /**
       * При редактировании строка из коллекции удаляется, а текущая переназначается,
       * но далее устанавливается режим текст, выход из которого возможен нажатием Escape.
       * А при нажатии Escape текущая строка добавляется в коллекцию и обнуляется (см. модуль mode.js)
       *
       */
      setModeCanvasText("text");
    }
  } else if (getModeCanvasText() === "text") {
    addLine(a.curTextLine.clone());

    if (a.magnet) {
      a.curTextLine.start = a.magnet;
    }
    else {
      a.curTextLine.start = mouse;
    }
    a.curTextLine.textArray = [];

  }

  cnv.clear();
  printLine(a.curTextLine);
  rerender();

  // --- functionCalled$ emmition
  functionCalled$.next({
    self: "handleMousedown",
  });
}
function handleTyping(event) {

  if (getModeCanvasText() !== "text") return;

  if (event.key === "Enter") {
    addLine(a.curTextLine.clone());
    a.curTextLine.textArray = [];
    a.curTextLine.start = np(
      a.curTextLine.start.x,
      a.curTextLine.start.y + cnv.getLineSpace(a.curTextLine)
    );

    cnv.clear();
    rerender();
  } else if (event.key === "Backspace") {
    if (a.cursor.index === a.curTextLine.textArray.length) {
      a.curTextLine.textArray.pop();
    } else {
      functionCalled$.next({ self: "handleBackspaceInTheMiddle" });
      return;
    }

    cnv.clear();
    printLine(a.curTextLine);

    rerender();
  } else if (event.key === "ArrowLeft") {
    functionCalled$.next({ self: "handleArrowLeft" });
    return;
  } else if (event.key === "ArrowRight") {
    functionCalled$.next({ self: "handleArrowRight" });
    return;
  }
  else if (event.key === "ArrowUp") {
    cnv.setFontSize(a.curTextLine.fontSize + fontSizeStep);
    a.curTextLine.fontSize = a.curTextLine.fontSize + fontSizeStep;
  
    cnv.clear();
    printLine(a.curTextLine);
    rerender();
   functionCalled$.next({ self: "handleArrowUp" });
  }
  else if (event.key === "ArrowDown") {
    cnv.setFontSize(a.curTextLine.fontSize + fontSizeStep);
    a.curTextLine.fontSize = a.curTextLine.fontSize - fontSizeStep;
  
    cnv.clear();
    printLine(a.curTextLine);
    rerender();
    functionCalled$.next({ self: "handleArrowDown" });
    }
  else {
    /**
     * Собственно сама операция отрисовки нажимаемых символов
     */
    if (isEmpty(a.curTextLine.start))
      return; /** Когда этот объект start пустой? При инициализации программы и при нажатии Escape */

    if (a.cursor.index === a.curTextLine.textArray.length) {
      a.curTextLine.textArray.push(event.key);
    } else {
      let letter = a.curTextLine.textArray[a.cursor.index];
      a.curTextLine.textArray.splice(a.cursor.index, 1, event.key, letter);
      functionCalled$.next({self: "letterInTheMiddle"});

      return;
    }

    cnv.clear();
    printLine(a.curTextLine);

    rerender();
  }

  // --- functionCalled$ emmition
  functionCalled$.next({
    self: "handleTyping",
  });
}

function handleMousemove(mouse) {
  if (getModeCanvasText() === "text") return;

  if (getModeCanvasText() === "select") {
    textLinesCollection.forEach((line) => {
      if (line.isinBoundary(mouse)) {
        cnv.clear();
        rerender();
        drawBoundary(line, "red");
      }
    });
    let a = textLinesCollection.some((line) => line.isinBoundary(mouse));
    if (!a) {
      cnv.clear();
      rerender();
    }
  }
  if (getModeCanvasText() === "textEdit") {
    textLinesCollection.forEach((line) => {
      if (line.isinBoundary(mouse)) {
        cnv.clear();
        printLine(a.curTextLine);
        rerender();
        drawBoundary(line, "blue");
      }
    });
    let t = textLinesCollection.some((line) => line.isinBoundary(mouse));
    if (!t) {
      cnv.clear();
      printLine(a.curTextLine);
      rerender();
    }
  }
  if (a.pan) {
    if (a.isPanning) {
      a.pan_start_x = mouse.x;
      a.pan_start_y = mouse.y;
      a.isPanning = false;
    }

    a.pan_tx = mouse.x - a.pan_start_x;
    a.pan_ty = mouse.y - a.pan_start_y;



    const pan_mat = mat3.fromTranslation(mat3.create(), [a.pan_tx, a.pan_ty, 0]);
    a.pan_mat = [...pan_mat];
    mat3.transpose(pan_mat, pan_mat);

    const tx = a.pan_tx;
    const ty = a.pan_ty;

    const matrix = new DOMMatrix([1, 0, 0, 1, tx, ty]);
    
    cnv.context.setTransform(matrix);
    
  }
}

// ------------------------------------------------------------------ BUTTONS' EVENT HANDLERS

// (function handleButtonupClick(event) {
//   if (!event) {
//     document
//       .querySelector("#font-size-up")
//       .addEventListener("click", handleButtonupClick);
//     return;
//   }
//   cnv.setFontSize(a.curTextLine.fontSize + fontSizeStep);
//   a.curTextLine.fontSize = a.curTextLine.fontSize + fontSizeStep;

//   cnv.clear();
//   printLine(a.curTextLine);
//   rerender();
//   this.blur();

//   // --- functionCalled$ emmition
//   functionCalled$.next({
//     self: "handleButtonupClick",
//   });
// })();

// (function handleButtondownClick(event) {
//   if (!event) {
//     document
//       .querySelector("#font-size-down")
//       .addEventListener("click", handleButtondownClick);
//     return;
//   }
//   cnv.setFontSize(a.curTextLine.fontSize - fontSizeStep);
//   a.curTextLine.fontSize = a.curTextLine.fontSize - fontSizeStep;
//   cnv.clear();
//   printLine(a.curTextLine);
//   rerender();
//   this.blur();
//   // --- functionCalled$ emmition
//   functionCalled$.next({ self: "handleButtondownClick" });
// })();

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
  cnv.context.fillText(line.textArray.join(""), line.start.x, line.start.y);
  cnv.setFontSize(a.curTextLine.fontSize);
  cnv.context.fillStyle = a.curTextLine.color;

  // --- functionCalled$ emmition
  functionCalled$.next({ self: "printLine" });
}

function rerender() {
  /**
   * Массив textLines не содержит текущую строку.
   * То есть в программе везде разделяется отрисовка текущей строки и коллекции уже существующих строк.
   * Для отрисовки текущей строки используется функция printLine(a.curTextLine),
   * а для отрисовки коллекции уже существующих строк используется та же функция, но в неё уже не передаётся текущая строка.
   */

  textLinesCollection.forEach((line) => {
    printLine(line);
  });

  // --- functionCalled$ emmition
  functionCalled$.next({ self: "rerender" });
}



function drawBoundary(line, color) {
  var curColor = cnv.context.strokeStyle;
  var { p1, p2, p3, p4 } = line.getBoundary();
  cnv.context.strokeStyle = color;
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
  functionCalled$.next({ self: "drawBoundary" });
}

export { rerender, printLine, initCanvasText, functionCalled$ };
