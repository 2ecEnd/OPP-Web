import { ToolBar } from "./ToolBar";

const nav = document.getElementById('nav');
const toolbar = new ToolBar();
updateToolbar();

function createTab(type: string, id: string | undefined, name: string | undefined) {
        const newTab = document.createElement('div');
        newTab.setAttribute('type', type);
        newTab.setAttribute('id', id ?? "");

        if(type == toolbar.homeBtnType){
            newTab.classList.add('toolbarItem');
            newTab.innerHTML = `
                <img class="house" src="../images/house.svg" alt="Иконка дома">
            `;
            newTab.addEventListener('click', function(e) {
                toolbar.setHomeTab();
                window.location.href = './MainPage/screen.html';
            });
            return newTab;
        }
        
        newTab.className = 'toolbarItem';
        newTab.innerHTML = `
            <img class="terminal" src="../images/terminal.svg" alt="Иконка терминала">
            <div class="toolbarItemText">${name}</div>
            <img class="x" src="../images/x-lg.svg" alt="Иконка крестика">
        `;

        const closeBtn = newTab.querySelector('.x');
        closeBtn?.addEventListener('click', function(e) {
            e.stopPropagation();
            var currentTab = toolbar.getActiveTab();
            if(currentTab?.id === id && currentTab?.type === type){
                closeTab(type, id!);
                window.location.href = './MainPage/screen.html';
            }else{
                closeTab(type, id!);
            }
        });

        newTab.addEventListener('click', async function() {
            toolbar.changeTabByTypeAndId(type, id ?? "");
            window.location.href = './MainPage/screen.html';
        });

        return newTab;
}

function closeTab(type: string, id: string) {
    toolbar.deleteTabByTypeAndId(type, id);
    updateToolbar();
}

function updateToolbar(){
        const tabs = toolbar.getAllTabs();
        const currentTab = toolbar.activeTab;
        const newToolbar = document.createElement('div');
        newToolbar.classList.add('toolbar');
        newToolbar.style.height = '100%';

        for(var i = 0; i < tabs.length; ++i){
            var tab = tabs[i];
            var newTab = createTab(tab!.type, tab!.id ?? "", tab!.name ?? "");

            if(i == currentTab) newTab.classList.add('selectedToolbarItem');

            newToolbar.appendChild(newTab)
        }

        nav!.replaceChildren(newToolbar);
}