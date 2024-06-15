import { fontSize$ } from "./state";

export class cnv{
    static context = null;
    static fontName = 'Arial';

    static init(selector, width, height, fontName) {
        var canvas = document.querySelector(selector);
        canvas.width = width;
        canvas.height = height;
        cnv.context = canvas.getContext('2d');
        cnv.context.textBaseline = 'bottom';
        cnv.fontName = fontName;
    }
    static clear() {
        cnv.context.save();
        cnv.context.setTransform(1, 0, 0, 1, 0, 0);

        cnv.context.clearRect(0, 0, cnv.context.canvas.width, cnv.context.canvas.height);
        cnv.context.restore();
    }

    static setFontSize(size) {
        cnv.context.font = size + `px ${cnv.fontName}`;
        fontSize$.next(size);
    }
    static getFontSize() {
        return cnv.context.font.split('px')[0];
    }

    static getLineSpace(line) {
        var font = cnv.context.font;
        cnv.context.font = line.fontSize + `px ${cnv.fontName}`;
        var lineSpace = cnv.context.measureText('M').fontBoundingBoxAscent;
        cnv.context.font = font;
        return lineSpace;
    }

    static getLineWidth(line) {
        var font = cnv.context.font;
        cnv.context.font = line.fontSize + `px ${this.fontName}`;
        var lineWidth =  cnv.context.measureText(line.textArray.join('')).width;
        cnv.context.font = font;
        return lineWidth;
    }

    static getCursorHeight() {
        return cnv.context.measureText('M').actualBoundingBoxAscent;
    }
}