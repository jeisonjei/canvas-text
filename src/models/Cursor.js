import { cnv } from "../shared/cnv";
import { a } from "../shared/state";
import { printLine, rerender } from "../index";

export class Cursor{
    get pos() {
        return this._pos;
    }
    set pos(value) {
        this._pos = value;
        this.draw(value);
    }
    get index() {
        return this._index;
    }
    set index(value) {
        this._index = value;
    }
    constructor(pos) {
        this._pos = pos;
        this._index = 0;
    }
    moveLeft(pos) {
    }
    moveRight(pos) {
    }
    moveStart(pos) {
    }
    moveEnd(pos) {
    }
    draw(pos) {
        cnv.clear();
        printLine(a.curTextLine);
        rerender();

        cnv.context.strokeStyle = 'blue';
        cnv.context.lineWidth = 2;
    
        cnv.context.beginPath();
        cnv.context.moveTo(pos.x, pos.y);
        cnv.context.lineTo(pos.x, pos.y - cnv.getCursorHeight());
        cnv.context.stroke();
    
    }
}