import { Point } from '../models/Point.js';

// --- comment example --------------------------------
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

  function isPointInsideFrame(frame, x, y) {
    const { point1, point2, point3 } = frame;
    if (x > point1.x && x < point2.x && ((y > point3.y && y < point2.y) || (y > point2.y && y < point3.y))) {
      return true;
    }
    return false;
  }
  

export { g, isEmpty, getId, applyTransformationToPoint, isPointInsideFrame}