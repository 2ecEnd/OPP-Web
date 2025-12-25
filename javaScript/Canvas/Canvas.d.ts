import type { Subject } from "../Subject";
import { LinkController } from "./LinkController";
export declare class Canvas {
    subject: Subject;
    viewport: HTMLElement;
    canvas: HTMLElement;
    connectionsLayer: HTMLElement;
    private x;
    private y;
    scale: number;
    private minScale;
    private maxScale;
    private scaleStep;
    private dragController;
    linkController: LinkController;
    dragModeIsActive: boolean;
    private isDraggingCanvas;
    private lastX;
    private lastY;
    constructor(subject: Subject);
    initExistingTasks(): void;
    initCanvasEvents(): void;
    onWheel(e: WheelEvent): void;
    zoom(delta: number, clientX: number, clientY: number): void;
    onKeyDown(e: KeyboardEvent): void;
    onKeyUp(e: KeyboardEvent): void;
    onMouseDown(e: MouseEvent): void;
    onMouseMove(e: MouseEvent): void;
    onMouseUp(): void;
    updateTransform(): void;
}
//# sourceMappingURL=Canvas.d.ts.map