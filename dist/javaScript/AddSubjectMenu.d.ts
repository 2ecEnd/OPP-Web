import type { Subject } from "./Subject.js";
declare class AddSubjectMenu {
    private container;
    private closeMenuButton;
    private form;
    private overlay;
    private type;
    private currentSubject;
    constructor();
    init(): void;
    handleSubmit(event: Event): void;
    changeSubject(subject: Subject, name: string): void;
    fillTheForm(): void;
    showSelf(type: string, currentSubject: Subject): void;
    closeSelf(): void;
}
export declare const addSubjectMenu: AddSubjectMenu;
export {};
//# sourceMappingURL=AddSubjectMenu.d.ts.map