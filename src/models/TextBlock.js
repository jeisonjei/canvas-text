import { cnv } from "../shared/cnv.js";
import { g as np } from "../shared/common.js";
import { isPointInsideFrame } from "../shared/common.js";

// --- other libraries --------------------------------
import { v4 as uuidv4} from "uuid";

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
        this.id = uuidv4();
        this.start = { ...start };
        this.textArray = [...textArray];
        this.fontSize = fontSize;
        this._selected = false;
        this.color = color;
        this.type = 'text';
    }


    clone() {
        let newTextBlock =  new TextBlock(this.start, this.textArray, this.fontSize, this.color);
        newTextBlock.selected = this.selected;
        return newTextBlock;
    }

    getObject() {
        let json = JSON.stringify(this);
        let result = JSON.parse(json);
        result.id = this.id;
        return result;
    }


    getObject() {
        var json = JSON.stringify(this);
        var sealedObject = JSON.parse(json);
        sealedObject.id = this.id;
        return sealedObject;
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
    isinSelectFrame(frame) {
        var { p1, p2, p3, p4 } = this.getBoundary();
        if (
            isPointInsideFrame(frame, p1.x, p1.y) &&
            isPointInsideFrame(frame, p2.x, p2.y) &&
            isPointInsideFrame(frame, p3.x, p3.y) &&
            isPointInsideFrame(frame, p4.x, p4.y)
        ) {
            return true;
        }

        return false;
    }
    isinSelectFrameAtLeast(frame) {
        var { p1, p2, p3, p4 } = this.getBoundary();
        if (
            isPointInsideFrame(frame, p1.x, p1.y) ||
            isPointInsideFrame(frame, p2.x, p2.y) ||
            isPointInsideFrame(frame, p3.x, p3.y) ||
            isPointInsideFrame(frame, p4.x, p4.y)
        ) {
            return true;
        }

        return false;
    }

}
