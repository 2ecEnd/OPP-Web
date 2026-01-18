import type { Canvas } from "./Canvas/Canvas.js";
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
    private title;
    private description;
    private hasDeadline;
    private deadline;
    private changeTaskAction;
    constructor(canvas: Canvas);
    init(): void;
    handleSubmit(event: Event): void;
    toggleDeadlineInput(): void;
    createTask(title: string, description: string, hasDeadline: boolean, deadline: Date | null, currentDate: Date): void;
    changeTask(title: string, description: string, hasDeadline: boolean, deadline: Date | null): void;
    showSelfToCreate(): void;
    showSelf(type: string, title: string, description: string, hasDeadline: boolean, deadline: Date | null, changeTaskAction: (title: string, description: string, hasDeadline: boolean, deadline: Date | null) => void): void;
    fillTheForm(): void;
    clearForm(): void;
    closeSelf(): void;
}
//# sourceMappingURL=AddTaskMenu.d.ts.map