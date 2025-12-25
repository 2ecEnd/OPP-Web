import type { Subject } from "./Subject.js";
export declare class SubjectView {
    private model;
    container: HTMLElement;
    constructor(model: Subject);
    deleteActionHandler(e: Event): void;
    openContextMenu(e: Event): void;
    openEditMenu(e: Event): void;
    createContextMenu(): HTMLElement;
    createView(): void;
    updateView(newName: string): void;
}
//# sourceMappingURL=SubjectView.d.ts.map