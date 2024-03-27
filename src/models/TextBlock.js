import { cnv } from "../shared/cnv";
import {g as np} from "../shared/common";
export class TextBlock{



    constructor(start, textArray, fontSize) {
        this.start = {...start};
        this.textArray = [...textArray];
        this.fontSize = fontSize;
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
        return [p1, p2, p3, p4];

    }

}
