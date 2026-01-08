import type { Task } from "../Task.js";
import type { TaskView } from "../TaskView.js";
import type { Canvas } from "./Canvas.js";
export interface LinkData {
    line: SVGLineElement;
    startTask: TaskView;
    endTask: TaskView;
}
export declare class LinkController {
    private canvas;
    linkingMode: boolean;
    deletinglinksMode: boolean;
    linkingStartTask: TaskView | null;
    tempLine: SVGElement | null;
    links: LinkData[];
    editingLinks: LinkData[];
    selectedLink: HTMLElement | null;
    constructor(canvas: Canvas);
    initArrowMarker(): void;
    initLinkingEvents(): void;
    enableDeletingLinksMode(task: Task): void;
    deleteLink(linkElement: SVGLineElement): void;
    highlightLink(linkElement: HTMLElement): void;
    startLinking(task: TaskView): void;
    updateTempLine(e: MouseEvent): void;
    linkTasks(targetTaskDom: HTMLElement): void;
    validateLinking(startTask: TaskView, endTask: TaskView): boolean;
    createLine(startTask: TaskView, endTask: TaskView): SVGElement;
    stopLinking(): void;
}
//# sourceMappingURL=LinkController.d.ts.map