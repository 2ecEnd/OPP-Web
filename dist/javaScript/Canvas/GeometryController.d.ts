export interface Point {
    x: number;
    y: number;
}
export interface Line {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}
export declare class GeometryController {
    static getCenter(element: HTMLElement): Point;
    static getEdgePoint(start: Point, end: Point, element: HTMLElement): Point;
    static calculateAngleDegrees(start: Point, end: Point): number;
    static findLineIntersection(line1: Line, line2: Line): Point;
}
//# sourceMappingURL=GeometryController.d.ts.map