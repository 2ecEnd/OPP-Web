declare class AddSubjectMenu {
    private container;
    private closeMenuButton;
    private form;
    private overlay;
    private type;
    private currentName;
    private changeSubjectAction;
    constructor();
    init(): void;
    handleSubmit(event: Event): void;
    changeSubject(name: string): void;
    fillTheForm(): void;
    showSelf(type: string, currentName: string, changeSubjectAction: (newName: string) => void): void;
    closeSelf(): void;
}
export declare const addSubjectMenu: AddSubjectMenu;
export {};
//# sourceMappingURL=AddSubjectMenu.d.ts.map