import { cnv } from "../shared/cnv.js";
import { g as np } from "../shared/common.js";

export class TextBlock {

    get selected() {
        return this._selected;   
    }
    set selected(value) {
        this._selected = value;
        if (this._selected) {
            this.color = '#919191';
        }
        else {
            this.color = 'black';
        }
    }

    constructor(start, textArray, fontSize, color) {
        this.id = 0;
        this.start = { ...start };
        this.textArray = [...textArray];
        this.fontSize = fontSize;
        this._selected = false;
        this.color = color;
    }


    clone() {
        var text = this.textArray.join('');
        return new TextBlock(this.start, text, this.fontSize);
    }

    getBoundary() {
        var width = cnv.getLineWidth(this);
        var height = cnv.getLineSpace(this);
        var p1 = np(this.start.x, this.start.y - height);
        var p2 = np(this.start.x + width, this.start.y - height);
        var p3 = np(this.start.x + width, this.start.y);
        var p4 = np(this.start.x, this.start.y);
        return { p1, p2, p3, p4 };

    }

    isinBoundary(mouse) {
        var { p1, p2, p3, p4 } = this.getBoundary();
        return (p1.x <= mouse.x && p2.x >= mouse.x && p4.y >=mouse.y && p1.y<=mouse.y);
    }

}
