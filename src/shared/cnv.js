export class cnv{
    static context = null;

    static init(selector, width, height) {
        var canvas = document.querySelector(selector);
        canvas.width = width;
        canvas.height = height;
        cnv.context = canvas.getContext('2d');
        cnv.context.textBaseline = 'bottom';
    }
    static clear() {
        cnv.context.clearRect(0, 0, cnv.context.canvas.width, cnv.context.canvas.height);
    }

    static setFontSize(size) {
        cnv.context.font = size + "px Arial";
    }
    static getFontSize() {
        return cnv.context.font.split('px')[0];
    }

    static getLineSpace(line) {
        var font = cnv.context.font;
        cnv.context.font = line.fontSize + "px Arial";
        var lineSpace = cnv.context.measureText('M').fontBoundingBoxAscent;
        cnv.context.font = font;
        return lineSpace;
    }

    static getLineWidth(line) {
        var font = cnv.context.font;
        cnv.context.font = line.fontSize + "px Arial";
        var lineWidth =  cnv.context.measureText(line.textArray.join('')).width;
        cnv.context.font = font;
        return lineWidth;
    }

    static getCursorHeight() {
        return cnv.context.measureText('M').actualBoundingBoxAscent;
    }
}