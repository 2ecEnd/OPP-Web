import { user, User } from "../javaScript/User";
import { apiService } from "../javaScript/Services/ApiService";
import { tabManager, TabManager } from "./TabManager";
import { createTeamView } from "./teamView";
import { changeTeamDialog } from "./changeTeamDialog";
document.addEventListener('DOMContentLoaded', async function () {
    const teamsItem = document.querySelector('.unselectedActionPanelItem');
    const subjectsItem = document.querySelector('.selectedActionPanelItem');
    const contentArea = document.querySelector('.contentArea');
    const teamType = "team";
    const subjectType = "subject";
    if (tabManager.toolbar.getActiveTab() === null) {
        tabManager.setActiveTab(tabManager.toolbar.homeBtnType, null);
        await setUserSubjects();
    }
    else {
        var currentTab = tabManager.toolbar.getActiveTab();
        tabManager.setActiveTab(tabManager.toolbar.homeBtnType, null);
        await setUserSubjects();
        tabManager.setActiveTab(currentTab.type, currentTab.id);
        tabManager.showTabContent(currentTab.type, currentTab.id);
    }
    //-=-=-=-=-Слушатели-=-=-=-=-=-
    teamsItem?.addEventListener('click', function () {
        if (!teamsItem.classList.contains('selectedActionPanelItem')) {
            tabManager.switchActiveItem(teamsItem, subjectsItem);
            clearContentArea();
            setUserTeams();
        }
    });
    subjectsItem?.addEventListener('click', function () {
        if (!subjectsItem.classList.contains('selectedActionPanelItem')) {
            tabManager.switchActiveItem(subjectsItem, teamsItem);
            clearContentArea();
            setUserSubjects();
        }
    });
    //обновил
    contentArea?.addEventListener('click', function (e) {
        const target = e.target;
        const contentItem = target.closest('.contentItem');
        if (contentItem) {
            const itemType = contentItem.getAttribute('data-type');
            const itemId = contentItem.getAttribute('data-id');
            const itemName = contentItem.textContent;
            if (itemType === teamType) {
                const team = user.teams.find(t => t.id == itemId);
                if (team) {
                    if (tabManager.toolbar.tabExist(itemType, team.id)) {
                        tabManager.setActiveTab(itemType, team.id);
                        tabManager.updateToolbar();
                    }
                    else {
                        tabManager.addTab(itemType, team.id, team.name);
                    }
                    tabManager.showTeamContent(team);
                }
            }
            else if (itemType === subjectType) {
                const subject = user.subjects.find(s => s.id == itemId);
                if (subject) {
                    if (tabManager.toolbar.tabExist(itemType, subject.id)) {
                        tabManager.setActiveTab(itemType, subject.id);
                        tabManager.updateToolbar();
                    }
                    else {
                        tabManager.addTab(itemType, subject.id, subject.name);
                    }
                    tabManager.showSubjectContent(subject);
                }
            }
        }
    });
    //-=-=-=-=-Остальное-=-=-=-=-=-
    function clearContentArea() {
        const contentArea = document.querySelector('.contentArea');
        if (!contentArea)
            return;
        const addButton = contentArea.querySelector('.addButton');
        contentArea.innerHTML = '';
        if (addButton) {
            contentArea.appendChild(addButton);
        }
    }
    async function setUserTeams() {
        var teams = await user.teamsService.getTeams();
        const contentArea = document.querySelector('.contentArea');
        if (!contentArea)
            return;
        teams.forEach(team => {
            const newElement = createTeamView(teamType, team.id);
            newElement.textContent = team.name;
            const delBtn = document.createElement('div');
            delBtn.textContent = "X";
            delBtn.style.color = "white";
            delBtn.style.fontSize = '32px';
            delBtn.addEventListener('mouseup', async function () {
                event?.stopPropagation();
                await user.teamsService.removeTeam(team.id);
                tabManager.closeTab(teamType, team.id);
                contentArea.removeChild(newElement);
            });
            const changeBtn = document.createElement('div');
            changeBtn.style.height = '40px';
            changeBtn.style.width = '40px';
            changeBtn.textContent = "R";
            changeBtn.style.color = "white";
            changeBtn.style.fontSize = '32px';
            changeBtn.addEventListener('mouseup', async function () {
                event?.stopPropagation();
                await changeTeamDialog(team, newElement);
            });
            const buttons = document.createElement('div');
            buttons.style.display = 'flex';
            buttons.style.flexDirection = 'row';
            buttons.style.justifyContent = 'space-around';
            buttons.appendChild(delBtn);
            buttons.appendChild(changeBtn);
            newElement.appendChild(buttons);
            contentArea.appendChild(newElement);
        });
    }
    async function setUserSubjects() {
        var subjects = await user.subjectsService.getSubjects();
        const contentArea = document.querySelector('.contentArea');
        if (!contentArea)
            return;
        subjects.forEach(subject => {
            contentArea.appendChild(subject.getView().container);
        });
    }
});
//# sourceMappingURL=screenScript.js.map