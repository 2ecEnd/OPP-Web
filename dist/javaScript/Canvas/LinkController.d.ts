import type { Task } from "../Task";
import type { Canvas } from "./Canvas";
export interface LinkData {
    line: SVGLineElement;
    startTask: Task;
    endTask: Task;
}
export declare class LinkController {
    private canvas;
    linkingMode: boolean;
    deletinglinksMode: boolean;
    linkingStartTask: Task | null;
    tempLine: SVGElement | null;
    links: LinkData[];
    editingLinks: LinkData[];
    selectedLink: HTMLElement | null;
    constructor(canvas: Canvas);
    initArrowMarker(): void;
    initLinkingEvents(): void;
    enableDeletingLinksMode(task: Task): void;
    highlightLink(linkElement: HTMLElement): void;
    startLinking(task: Task): void;
    updateTempLine(e: MouseEvent): void;
    linkTasks(targetTaskDom: HTMLElement): void;
    validateLinking(startTask: Task, endTask: Task): boolean;
    createLine(startTask: Task, endTask: Task): SVGElement;
    stopLinking(): void;
}
//# sourceMappingURL=LinkController.d.ts.map