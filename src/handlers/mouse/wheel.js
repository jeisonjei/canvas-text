import { a } from "../../shared/state";
import { mat3 } from "gl-matrix";
import { cnv } from "../../shared/cnv";
import { applyTransformationToPoint } from "../../shared/common";
import { textLinesCollection$ } from "../../shared/state";

// --- rxjs
import { fromEvent } from "rxjs";

function handleMouseWheel(ev) {
    a.zl = ev.deltaY > 0 ? 0.90 : 1.1;
    a.zlc *= a.zl;

    const scalingMatrix = mat3.fromScaling(mat3.create(), [a.zl, a.zl]);
    const translationMatrix = mat3.fromTranslation(mat3.create(), [
        -(a.zl - 1) * cnv.canvas.width / 2,
        -(a.zl - 1) * cnv.canvas.height / 2
    ]);
    const transformationMatrix = mat3.multiply(mat3.create(), translationMatrix, scalingMatrix);
    console.log(`** transformationMatrix: `, transformationMatrix);


}

function registerMouseWheelEvent() {
    const wheel$ = fromEvent(document, 'wheel');
    wheel$.subscribe(handleMouseWheel);
}

export {handleMouseWheel, registerMouseWheelEvent}