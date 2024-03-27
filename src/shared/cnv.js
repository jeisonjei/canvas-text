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

    static getLineSpace() {
        return cnv.context.measureText('M').width;
    }

    static getLineWidth(line) {
        return cnv.context.measureText(line.textArray.join('')).width;
    }

    static getCursorHeight() {
        return cnv.context.measureText('M').actualBoundingBoxAscent;
    }
}