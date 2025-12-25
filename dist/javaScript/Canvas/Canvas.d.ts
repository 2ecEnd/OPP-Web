import type { Subject } from "../Subject.js";
import { LinkController } from "./LinkController.js";
import { TaskView } from "../TaskView.js";
export declare class Canvas {
    subject: Subject;
    taskViews: TaskView[];
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