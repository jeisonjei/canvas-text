
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


}
