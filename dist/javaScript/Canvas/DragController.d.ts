import type { Canvas } from "./Canvas.js";
export declare class DragController {
    private canvas;
    isDraggingObject: boolean;
    draggedObject: HTMLElement | null;
    private draggedTask;
    private objectLastX;
    private objectLastY;
    constructor(canvas: Canvas);
    initObjectsEvents(): void;
    onObjectMouseDown(e: MouseEvent): void;
    onObjectMouseMove(e: MouseEvent): void;
}
//# sourceMappingURL=DragController.d.ts.map