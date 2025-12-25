import type { Canvas } from "./Canvas/Canvas.js";
import { Task } from "./Task.js";
export declare class AddTaskMenu {
    private container;
    private closeMenuButton;
    private form;
    private checkbox;
    private deadlineContainer;
    private overlay;
    private formSubmitButton;
    private canvas;
    private type;
    private currentTask;
    constructor(canvas: Canvas);
    init(): void;
    handleSubmit(event: Event): void;
    toggleDeadlineInput(): void;
    createTask(title: string, description: string, hasDeadline: boolean, deadline: string, currentDate: Date): void;
    changeTask(task: Task, title: string, description: string, hasDeadline: boolean, deadline: string): void;
    showSelf(type: string, currentTask: Task | null): void;
    fillTheForm(): void;
    clearForm(): void;
    closeSelf(): void;
}
//# sourceMappingURL=AddTaskMenu.d.ts.map