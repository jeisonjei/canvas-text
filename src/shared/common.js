import { Point } from '../models/Point.js';

function g(xOrPoint, y) {
    if (typeof xOrPoint === 'object') {
        return new Point(xOrPoint.x, xOrPoint.y);
    }
    return new Point(xOrPoint, y);
}

export { g }