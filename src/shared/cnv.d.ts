export declare class cnv {
  static context: CanvasRenderingContext2D | null;
  static fontName: string;

  static init(selector: string, width: number, height: number, fontName: string): void;
  static clear(): void;

  static setFontSize(size: number): void;
  static getFontSize(): string;

  static getLineSpace(line: { fontSize: number }): number;
  static getLineWidth(line: { fontSize: number; textArray: readonly string[] }): number;
  static getCursorHeight(): number;
}
