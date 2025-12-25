import { Status } from './Enum/Enums.js';
export declare class Task {
    id: string;
    title: string;
    description: string;
    hasDeadline: boolean;
    deadline: Date | string;
    currentDate: Date;
    dependsOn: string[];
    assignedTasks: string[];
    status: Status;
    view: TaskView;
    x: number;
    y: number;
    constructor(id: string | null | undefined, title: string, description: string, hasDeadline: boolean, deadline: (Date | string) | undefined, currentDate: Date, x: number, y: number, dependsOn?: string[], assignedTasks?: string[], status?: Status);
    setStatus(status: Status): void;
    changeTask(title: string, description: string, hasDeadline: boolean, deadline: Date | string): void;
    addDependency(task: Task): void;
    addAssignedTask(assignedTask: string): void;
    deleteTask(): void;
}
declare class TaskView {
    x: number;
    y: number;
    container: HTMLElement;
    private model;
    constructor(x: number, y: number, model: Task);
    changeStatusView(status: Status): void;
    changeDataView(): void;
    openContextMenu(): void;
    openStatusMenu(): void;
    openResponsibleMenu(): void;
    closeAllMenus(): void;
    openEditMenu(): void;
    startLinking(): void;
    enableDeletingLinksMode(): void;
    createContextMenu(): HTMLElement;
    createStatusMenu(): HTMLElement;
    createResponsibleMenu(): HTMLElement;
    createDom(): HTMLElement;
    deleteView(): void;
}
export {};
//# sourceMappingURL=Task.d.ts.map