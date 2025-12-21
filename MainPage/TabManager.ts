import type { Subject } from "../javaScript/Subject";
import type { Team } from "../javaScript/Team";
import type { TeamMember } from "../javaScript/TeamMember";
import { ToolBar } from "../javaScript/ToolBar";
import type { User } from "../javaScript/User";

export class TabManager{

    public toolbarView: HTMLDivElement
    public originalActionPanel: HTMLDivElement
    public originalContentArea: HTMLDivElement
    public mainPanel: HTMLDivElement

    private teamType = "team";
    private subjectType = "subject";
    public toolbar = new ToolBar()
    private user: User

    constructor(user: User){
        this.toolbarView = document.querySelector('.toolbar') ?? document.createElement('div');
        this.originalActionPanel = document.querySelector('.actionPanel') ?? document.createElement('div');
        this.originalContentArea = document.querySelector('.contentArea') ?? document.createElement('div');
        this.mainPanel = document.querySelector('.mainPanel') ?? document.createElement('div');
        
        this.user = user;
    }

    restoreMainPanel() {
        this.mainPanel.innerHTML = '';
        this.mainPanel.appendChild(this.originalActionPanel);
        this.mainPanel.appendChild(this.originalContentArea);
        
        const restoredTeamsItem = this.mainPanel.querySelector('.unselectedActionPanelItem');
        const restoredSubjectsItem = this.mainPanel.querySelector('.selectedActionPanelItem');

        const switchActiveItem = this.switchActiveItem
        const clearContentArea = this.clearContentArea
        
        if (restoredTeamsItem && restoredSubjectsItem) {
            restoredTeamsItem.addEventListener('click', function() {
                if (!restoredTeamsItem.classList.contains('selectedActionPanelItem')) {
                    switchActiveItem(restoredTeamsItem, restoredSubjectsItem);
                    clearContentArea();
                }
            });
            
            restoredSubjectsItem.addEventListener('click', function() {
                if (!restoredSubjectsItem.classList.contains('selectedActionPanelItem')) {
                    switchActiveItem(restoredSubjectsItem, restoredTeamsItem);
                    clearContentArea();
                }
            });
        }
    }

    createTab(type: string, id: string | null, name: string | null): HTMLDivElement {
        const newTab = document.createElement('div');
        newTab.setAttribute('type', type);
        newTab.setAttribute('id', id ?? "");

        if(type == this.toolbar.homeBtnType){
            newTab.classList.add('toolbarItem');
            newTab.innerHTML = `
                <img class="house" src="../images/house.svg" alt="Иконка дома">
            `;

            const setActiveTab = this.setActiveTab
            const restoreMainPanel = this.restoreMainPanel

            newTab.addEventListener('click', function(e) {
                setActiveTab(type, id);
                restoreMainPanel();
            });
            return newTab;
        }
        
        newTab.className = 'toolbarItem';
        newTab.innerHTML = `
            <img class="terminal" src="../images/terminal.svg" alt="Иконка терминала">
            <div class="toolbarItemText">${name}</div>
            <img class="x" src="../images/x-lg.svg" alt="Иконка крестика">
        `;

        const toolbar = this.toolbar
        const closeTab = this.closeTab
        const setActiveTab = this.setActiveTab
        const restoreMainPanel = this.restoreMainPanel
        const showTabContent = this.showTabContent

        const closeBtn = newTab.querySelector('.x');
        closeBtn?.addEventListener('click', function(e) {
            e.stopPropagation();
            var currentTab = toolbar.getActiveTab();
            if(currentTab?.id === id && currentTab?.type === type){
                closeTab(type, id!);
                setActiveTab(toolbar.homeBtnType, null);
                restoreMainPanel();
            }else{
                closeTab(type, id!);
            }
        });

        newTab.addEventListener('click', async function() {
            setActiveTab(type, id);
            showTabContent(type, id!);
        });

        return newTab;
    }

    closeTab(type: string, id: string) {
        this.toolbar.deleteTabByTypeAndId(type, id);
        this.updateToolbar();
    }

    addTab(type: string, id: string, name: string){
        this.toolbar.addTab(type, id, name);
        this.updateToolbar();
    }

    setActiveTab(type: string, id: string | null) {
        this.toolbar.changeTabByTypeAndId(type, id);
        this.updateToolbar();
    }

    updateToolbar(){
        this.toolbarView = document.querySelector('.toolbar') ?? document.createElement('div');
        const tabs = this.toolbar.getAllTabs();
        const currentTab = this.toolbar.activeTab;
        const newToolbar = document.createElement('div');
        newToolbar.classList.add('toolbar');

        for(var i = 0; i < tabs.length; ++i){
            var tab = tabs[i];
            if(!tab) continue;
            var newTab = this.createTab(tab.type, tab.id, tab.name);

            if(i == currentTab) newTab.classList.add('selectedToolbarItem');

            newToolbar.appendChild(newTab)
        }

        this.toolbarView.replaceWith(newToolbar);
    }

    async showTabContent(type: string, id: string) {
        if(type == this.teamType){
            const team = await this.user.teamsService.getTeamById(id);
            this.showTeamContent(team);
        }
        if(type == this.subjectType){
            const subject = await this.user.subjectsService.getSubjectById(id);
            this.showSubjectContent(subject);
        }
    }

    showTeamContent(team: Team | undefined) {
        this.mainPanel.innerHTML = '';
        
        const teamContent = this.createTeamContent(team);
        this.mainPanel.appendChild(teamContent);
    }

    showSubjectContent(subject: Subject | undefined) {
        this.mainPanel.innerHTML = '';
        
        const homeBtn = document.querySelector('.homeBtn');

        window.location.href = '../index.html';
    }

    createTeamContent(team: Team | undefined) {
        const teamContent = this.createTeamContainer();
        
        const participantsColumn = this.createParticipantsColumn(team);
        const subjectsColumn = this.createSubjectsColumn(team);
        
        teamContent.appendChild(participantsColumn);
        teamContent.appendChild(subjectsColumn);

        return teamContent;
    }

    createTeamContainer() {
        const teamContent = document.createElement('div');
        teamContent.className = 'teamContent';
        teamContent.style.display = 'flex';
        teamContent.style.gap = '20px';
        teamContent.style.padding = '20px';
        teamContent.style.height = 'auto';
        
        return teamContent;
    }

    createParticipantsColumn(team: Team | undefined) {
        const participantsColumn = document.createElement('div');
        participantsColumn.className = 'teamColumn';
        participantsColumn.innerHTML = '<h3>Участники команды</h3>';
        
        const participantsList = this.createParticipantsList(team);
        participantsColumn.appendChild(participantsList);
        
        const addMemberButton = this.createAddMemberButton(team);
        participantsColumn.appendChild(addMemberButton);
        
        return participantsColumn;
    }

    createParticipantsList(team: Team | undefined) {
        const participantsList = document.createElement('div');
        participantsList.className = 'participantsList';
        
        if (team?.members && team?.members.length > 0) {
            team.members.forEach(member => {
                const participantElement = this.createParticipantElement(team, member);
                participantsList.appendChild(participantElement);
            });
        } else {
            participantsList.textContent = 'Нет участников';
        }
        
        return participantsList;
    }

    createParticipantElement(team: Team | undefined, member: TeamMember | undefined) {
        const participantElement = document.createElement('div');
        participantElement.className = 'participantItem';
        
        const btnContainer = this.createParticipantButtonContainer(team, member);
        
        participantElement.textContent = member?.name + " " + member?.surname;
        participantElement.appendChild(btnContainer);
        
        return participantElement;
    }

    createParticipantButtonContainer(team: Team | undefined, member: TeamMember | undefined) {
        const btnContainer = document.createElement('div');
        btnContainer.style.display = 'flex';
        btnContainer.style.flexDirection = 'row';
        btnContainer.style.alignItems = 'center';
        btnContainer.style.columnGap = '10px';
        
        const infoBtn = this.createInfoButton(team, member);
        const deleteBtn = this.createDeleteButton(team, member, btnContainer);
        
        btnContainer.appendChild(infoBtn);
        btnContainer.appendChild(deleteBtn);
        
        return btnContainer;
    }

    createInfoButton(team: Team | undefined, member: TeamMember | undefined) {
        const infoBtn = document.createElement('img');
        infoBtn.src = "../images/eye.svg";
        infoBtn.className = 'x';
        
        infoBtn.addEventListener('mouseup', async function() {
            const assignedTasks: string[] = [];
            member?.assignedTasks.forEach(taskId => {
                assignedTasks.push(user.getTaskById(taskId).title);
            });
            showAssignedTasksDialog(team, member, assignedTasks);
        });
        
        return infoBtn;
    }

    createDeleteButton(team: Team | undefined, member: TeamMember | undefined, btnContainer: Element) {
        const deleteBtn = document.createElement('img');
        deleteBtn.src = "../images/x-lg.svg";
        deleteBtn.className = 'x';
        
        deleteBtn.addEventListener('mouseup', async function() {
            team?.removeMember(member!);
            const participantElement = btnContainer.closest('.participantItem');
            if (participantElement && participantElement.parentNode) {
                participantElement.parentNode.removeChild(participantElement);
            }
        });
        
        return deleteBtn;
    }

    createAddMemberButton(team: Team | undefined) {
        const btnContainer = document.createElement('div');
        btnContainer.style.display = 'flex';
        btnContainer.style.justifyContent = 'flex-end';
        
        const addMemberBtn = document.createElement('button');
        addMemberBtn.className = 'addButton';
        addMemberBtn.style.position = 'relative';
        addMemberBtn.style.bottom = '0px';
        addMemberBtn.style.right = '0px';
        addMemberBtn.textContent = '+';
        addMemberBtn.style.backgroundColor = 'rgb(44, 44, 44)';
        addMemberBtn.style.boxShadow = '0 2px 10px rgba(200, 200, 200, 0.3)';
        
        addMemberBtn.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#6b6b8f';
        });
        
        addMemberBtn.addEventListener('mouseout', function() {
            this.style.backgroundColor = 'rgb(44, 44, 44)';
        });
        
        addMemberBtn.addEventListener('mouseup', function() {
            showAddMemberDialog(team);
        });
        
        btnContainer.appendChild(addMemberBtn);
        return btnContainer;
    }

    createSubjectsColumn(team: Team | undefined) {
        const subjectsColumn = document.createElement('div');
        subjectsColumn.className = 'teamColumn';
        subjectsColumn.innerHTML = '<h3>Назначенные предметы</h3>';
        
        const subjectsList = this.createSubjectsList(team);
        subjectsColumn.appendChild(subjectsList);
        
        return subjectsColumn;
    }

    createSubjectsList(team: Team | undefined) {
        const subjectsList = document.createElement('div');
        subjectsList.className = 'subjectsList';
        
        if (team?.subjects && team?.subjects.length > 0) {
            this.addSubjectsToList(team, subjectsList);
        } else {
            subjectsList.textContent = 'Нет назначенных предметов';
        }
        
        return subjectsList;
    }

    async addSubjectsToList(team: Team | undefined, subjectsList: Element) {
        if (!team) return
        for (const subjectId of team.subjects) {
            const subjectElement = document.createElement('div');
            subjectElement.className = 'participantItem';
            const subject = await this.user.subjectsService.getSubjectById(subjectId);
            subjectElement.textContent = subject?.name ?? "";
            subjectsList.appendChild(subjectElement);
        }
    }
    
    switchActiveItem(activeItem: Element, inactiveItem: Element) {
        inactiveItem.classList.remove('selectedActionPanelItem');
        inactiveItem.classList.add('unselectedActionPanelItem');
        
        activeItem.classList.remove('unselectedActionPanelItem');
        activeItem.classList.add('selectedActionPanelItem');
        
        const inactiveArrow = inactiveItem.querySelector('.arrow');
        const activeArrow = activeItem.querySelector('.arrow');
        
        if (activeArrow) {
            activeItem.removeChild(activeArrow);
        }
    }

    clearContentArea() {
        const contentArea = document.querySelector('.contentArea');
        if (!contentArea) return
        const addButton = contentArea.querySelector('.addButton');
        contentArea.innerHTML = '';
        if (addButton) {
            contentArea.appendChild(addButton);
        }
    }
};