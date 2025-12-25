import { Tab } from "./Tab";
export declare class ToolBar {
    private tabs;
    activeTab: number;
    private key;
    homeBtnType: string;
    constructor();
    saveToolbar(storageKey?: string | null): {
        tabs: Tab[];
        activeTab: number;
    };
    restoreToolbar(storageKey?: string | null): null | undefined;
    clearSavedToolbar(storageKey?: string | null): void;
    initEmptyToolbar(): void;
    setHomeTab(): void;
    getActiveTab(): Tab | null;
    getAllTabs(): Tab[];
    changeTab(tabNumber?: number): Tab | null;
    changeTabByTypeAndId(type: string, id: string | null): Tab | null;
    deleteTabByNumber(tabNumber: number): null | undefined;
    deleteTabByTypeAndId(type: string, id: string): void;
    addTab(type: string, id: string | null, name: string | null): void;
    tabExist(type: string | null, id: string | null): boolean;
}
//# sourceMappingURL=ToolBar.d.ts.map