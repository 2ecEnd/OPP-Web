export class GeometryController {
    static getCenter(element) {
        const left = parseInt(element.dataset.x ?? '0');
        const top = parseInt(element.dataset.y ?? '0');
        const width = element.offsetWidth;
        const height = element.offsetHeight;
        return {
            x: left + width / 2,
            y: top + height / 2
        };
    }
    static getEdgePoint(start, end, element) {
        const width = element.offsetWidth;
        const height = element.offsetHeight;
        const left = parseInt(element.dataset.x ?? '0');
        const top = parseInt(element.dataset.y ?? '0');
        const angle = GeometryController.calculateAngleDegrees(start, end);
        const line1 = {
            x1: start.x,
            y1: start.y,
            x2: end.x,
            y2: end.y
        };
        let line2;
        if (angle <= 42 || angle > 317.5) {
            const bottom = top + height;
            line2 = {
                x1: left,
                y1: top,
                x2: left,
                y2: bottom
            };
            return GeometryController.findLineIntersection(line1, line2);
        }
        else if (angle > 42 && angle <= 138) {
            const right = left + width;
            line2 = {
                x1: left,
                y1: top,
                x2: right,
                y2: top
            };
            return GeometryController.findLineIntersection(line1, line2);
        }
        else if (angle > 138 && angle <= 223) {
            const right = left + width;
            const bottom = top + height;
            line2 = {
                x1: right,
                y1: top,
                x2: right,
                y2: bottom
            };
            return GeometryController.findLineIntersection(line1, line2);
        }
        else if (angle > 223 && angle <= 317.5) {
            const right = left + width;
            const bottom = top + height;
            line2 = {
                x1: left,
                y1: bottom,
                x2: right,
                y2: bottom
            };
            return GeometryController.findLineIntersection(line1, line2);
        }
        return GeometryController.getCenter(element);
    }
    static calculateAngleDegrees(start, end) {
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const radians = Math.atan2(dy, dx);
        const degrees = radians * (180 / Math.PI);
        return (degrees + 360) % 360;
    }
    static findLineIntersection(line1, line2) {
        const A1 = line1.y2 - line1.y1;
        const B1 = line1.x1 - line1.x2;
        const C1 = A1 * line1.x1 + B1 * line1.y1;
        const A2 = line2.y2 - line2.y1;
        const B2 = line2.x1 - line2.x2;
        const C2 = A2 * line2.x1 + B2 * line2.y2;
        const determinant = A1 * B2 - A2 * B1;
        const x = (B2 * C1 - B1 * C2) / determinant;
        const y = (A1 * C2 - A2 * C1) / determinant;
        return { x, y };
    }
}
//# sourceMappingURL=GeometryController.js.map