import { Tab } from "./Tab.js";
export class ToolBar {
    tabs;
    activeTab;
    key;
    homeBtnType;
    constructor() {
        this.tabs = [];
        this.activeTab = -1;
        this.key = 'toolbarTabs';
        this.homeBtnType = "HomeBtn";
        this.restoreToolbar();
        if (!this.tabs.length)
            this.initEmptyToolbar();
    }
    saveToolbar(storageKey = null) {
        const data = {
            tabs: this.tabs,
            activeTab: this.activeTab
        };
        if (storageKey) {
            localStorage.setItem(storageKey, JSON.stringify(data, null, 2));
        }
        else {
            localStorage.setItem(this.key, JSON.stringify(data, null, 2));
        }
        return data;
    }
    restoreToolbar(storageKey = null) {
        const savedData = localStorage.getItem(storageKey == null ? this.key : storageKey);
        if (!savedData) {
            console.warn(`No data found for key: ${storageKey == null ? this.key : storageKey}`);
            return null;
        }
        try {
            const data = JSON.parse(savedData);
            this.tabs = (data.tabs || []);
            this.activeTab = data.activeTab || -1;
        }
        catch (error) {
            console.error('Error parsing data:', error);
            return null;
        }
    }
    clearSavedToolbar(storageKey = null) {
        localStorage.removeItem(storageKey == null ? this.key : storageKey);
    }
    initEmptyToolbar() {
        this.addTab(this.homeBtnType, null, null);
        this.setHomeTab();
    }
    setHomeTab() {
        this.changeTab();
    }
    getActiveTab() {
        if (this.activeTab >= this.tabs.length || this.activeTab < 0)
            return null;
        var currentTab = this.tabs[this.activeTab];
        return currentTab.copy();
    }
    getAllTabs() {
        var tabsCopy = [];
        this.tabs.forEach(tab => {
            tabsCopy.push(tab.copy());
        });
        return tabsCopy;
    }
    changeTab(tabNumber = 0) {
        if (tabNumber == this.activeTab)
            return null;
        if (tabNumber >= this.tabs.length || tabNumber < 0)
            return null;
        this.activeTab = tabNumber;
        this.saveToolbar();
        return this.tabs[tabNumber].copy();
    }
    changeTabByTypeAndId(type, id) {
        const index = this.tabs.findIndex(tab => tab.type === type && tab.id === id);
        return this.changeTab(index);
    }
    deleteTabByNumber(tabNumber) {
        if (tabNumber >= this.tabs.length || tabNumber < 1)
            return null;
        this.tabs.splice(tabNumber, 1);
        if (tabNumber == this.activeTab)
            this.setHomeTab();
        this.saveToolbar();
    }
    deleteTabByTypeAndId(type, id) {
        const index = this.tabs.findIndex(tab => tab.type === type && tab.id === id);
        this.deleteTabByNumber(index);
    }
    addTab(type, id, name) {
        if (this.tabExist(type, id))
            return;
        this.tabs.push(new Tab(type, id, name));
        this.activeTab = this.tabs.length - 1;
        this.saveToolbar();
    }
    tabExist(type, id) {
        return this.tabs.some(tab => tab.type === type && tab.id === id);
    }
}
//# sourceMappingURL=ToolBar.js.map