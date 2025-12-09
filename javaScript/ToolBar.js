class ToolBar{
    constructor(){
        this.tabs = [];
        this.activeTab = -1;
        this.key = toolbarTabs;
        this.homeBtnType = "HomeBtn";
    }

    saveToolbar(storageKey = null) {
        const data = {
            tabs: this.tabs,
            activeTab: this.activeTab
        };
        
        if (storageKey) {
            localStorage.setItem(storageKey, JSON.stringify(data, null, 2));
        }else{
            localStorage.setItem(this.key, JSON.stringify(data, null, 2));
        }
        
        return data;
    }

    restoreToolbar(storageKey = null){
        const savedData = localStorage.getItem(storageKey == null ? this.key : storageKey);
        
        if (!savedData) {
            console.warn(`No data found for key: ${storageKey == null ? this.key : storageKey}`);
            return null;
        }
        
        try {
            const data = JSON.parse(savedData);

            this.tabs = data.tabs;
            this.activeTab = data.activeTab;
            
            return restoredElement;
        } catch (error) {
            console.error('Error parsing data:', error);
            return null;
        }
    }

    clearSavedToolbar(storageKey = null){
        localStorage.removeItem(storageKey == null ? this.key : storageKey);
    }

    initToolbar(){
        this.addTab(this.homeBtnType, null);
        this.setHomeTab()
    }

    setHomeTab(){
        this.activeTab = 0;
        this.changeTab()
    }

    getActiveTab(){
        if(this.activeTab >= this.tabs.length || this.activeTab < 0) return null;
        return this.tabs[this.activeTab];
    }

    changeTab(tabNumber = 0){
        if(tabNumber = this.activeTab) return null;
        if(tabNumber >= this.tabs.length || tabNumber < 0) return null;

        this.activeTab = tabNumber;
        this.saveToolbar();
        return this.tabs[tabNumber];
    }

    deleteTab(tabNumber){
        if(tabNumber >= this.tabs.length || tabNumber < 0) return null;

        this.tabs.slice(tabNumber, 1);
        this.setHomeTab();
        this.saveToolbar();
    }

    addTab(type, id){
        this.tabs.push(new Tab(type, id));
    }
}