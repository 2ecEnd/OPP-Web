import type { Task } from "./Task.js";
export declare class Subject {
    id: string;
    name: string;
    tasks: Task[];
    teamId: string | null;
    private view;
    constructor(id: string | null | undefined, name: string, tasks: Task[] | undefined, teamId: string | null);
    changeData(): void;
    addTask(task: Task): void;
    deleteTask(id: string): void;
    changeSubject(newName: string): void;
    deleteSubject(e: Event): void;
    getTask(id: string): Task | undefined;
    getView(): SubjectView;
}
declare class SubjectView {
    private model;
    container: HTMLElement;
    constructor(model: Subject);
    openContextMenu(e: Event): void;
    openEditMenu(e: Event): void;
    createContextMenu(): HTMLElement;
    createView(): void;
    updateView(): void;
}
export {};
//# sourceMappingURL=Subject.d.ts.map