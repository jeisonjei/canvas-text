import { a } from "../../shared/state";
import { mat3 } from "gl-matrix";
import { cnv } from "../../shared/cnv";
import { applyTransformationToPoint } from "../../shared/common";
import { textLinesCollection$, textLinesCollection } from "../../shared/state";

// --- rxjs
import { fromEvent } from "rxjs";
import { rerender } from "../..";

function handleMouseWheel(ev) {
    a.zl = ev.deltaY > 0 ? 0.90 : 1.1;
    a.zlc *= a.zl;

    const scalingMatrix = mat3.fromScaling(mat3.create(), [a.zl, a.zl]);
    const translationMatrix = mat3.fromTranslation(mat3.create(), [
        -(a.zl - 1) * cnv.context.canvas.width / 2,
        -(a.zl - 1) * cnv.context.canvas.height / 2
    ]);
    const transformationMatrix = mat3.multiply(mat3.create(), translationMatrix, scalingMatrix);
    var fontSize = cnv.context.font.split('px')[0] * a.zlc;
    // cnv.setFontSize влияет только на текущую строку
    cnv.setFontSize(Number.parseFloat(fontSize));

    textLinesCollection.forEach(line => {
        line.start = applyTransformationToPoint(line.start.x, line.start.y, transformationMatrix);
        line.fontSize = line.fontSize * a.zl;
    });

    cnv.clear();
    rerender();


}

function registerMouseWheelEvent() {
    const wheel$ = fromEvent(document, 'wheel');
    wheel$.subscribe(handleMouseWheel);
}

export {handleMouseWheel, registerMouseWheelEvent}