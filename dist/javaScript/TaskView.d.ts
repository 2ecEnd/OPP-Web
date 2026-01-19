import { Status } from './Enum/Enums.js';
import type { Task } from "./Task.js";
export declare class TaskView {
    x: number;
    y: number;
    container: HTMLElement;
    model: Task;
    constructor(model: Task);
    changeStatusView(status: Status): void;
    changeDataView(): void;
    openContextMenu(): void;
    openStatusMenu(): void;
    openResponsibleMenu(): void;
    closeAllMenus(): void;
    openEditMenu(): void;
    startLinking(): void;
    enableDeletingLinksMode(): void;
    deleteActionHandler(e: Event): Promise<void>;
    createContextMenu(): HTMLElement;
    createStatusMenu(): HTMLElement;
    createResponsibleMenu(): HTMLElement;
    createDom(): HTMLElement;
    deleteView(): Promise<void>;
}
//# sourceMappingURL=TaskView.d.ts.map