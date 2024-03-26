import { Point } from '../models/Point.js';

function g(xOrPoint, y) {
    if (xOrPoint instanceof Point) {
        return new Point(xOrPoint.x, yOrPoint.y);
    }
    return new Point(xOrPoint, y);
}

export {g}