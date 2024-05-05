import { Point } from '../models/Point.js';

function g(xOrPoint, y) {
    if (typeof xOrPoint === 'object') {
        return new Point(xOrPoint.x, xOrPoint.y);
    }
    return new Point(xOrPoint, y);
}

function isEmpty(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}

// --- unique identifier ---
var getId = (function () {
    var counter = 0;
    return function uniqueId() {
        return counter++;
    }
})();

function applyTransformationToPoint(x, y, matrix) {
    const newX = matrix[0] * x + matrix[3] * y + matrix[6];
    const newY = matrix[1] * x + matrix[4] * y + matrix[7];
    return new Point(newX, newY);
  }
  

export { g, isEmpty, getId, applyTransformationToPoint}