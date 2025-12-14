class TabManager{
    constructor(){
        this.toolbarView = document.querySelector('.toolbar');
        this.originalActionPanel = document.querySelector('.actionPanel');
        this.originalContentArea = document.querySelector('.contentArea');
        this.mainPanel = document.querySelector('.mainPanel');
        
        this.teamType = "team";
        this.subjectType = "subject";
    }

    restoreMainPanel() {
        this.mainPanel.innerHTML = '';
        this.mainPanel.appendChild(this.originalActionPanel);
        this.mainPanel.appendChild(this.originalContentArea);
        
        const restoredTeamsItem = this.mainPanel.querySelector('.unselectedActionPanelItem');
        const restoredSubjectsItem = this.mainPanel.querySelector('.selectedActionPanelItem');
        
        if (restoredTeamsItem && restoredSubjectsItem) {
            restoredTeamsItem.addEventListener('click', function() {
                if (!restoredTeamsItem.classList.contains('selectedActionPanelItem')) {
                    tabManager.switchActiveItem(restoredTeamsItem, restoredSubjectsItem);
                    tabManager.clearContentArea();
                }
            });
            
            restoredSubjectsItem.addEventListener('click', function() {
                if (!restoredSubjectsItem.classList.contains('selectedActionPanelItem')) {
                    tabManager.switchActiveItem(restoredSubjectsItem, restoredTeamsItem);
                    tabManager.clearContentArea();
                }
            });
        }
    }

    //обновил
    createTab(type, id, name) {
        const newTab = document.createElement('div');
        newTab.setAttribute('type', type);
        newTab.setAttribute('id', id);

        if(type == toolbar.homeBtnType){
            newTab.classList.add('toolbarItem');
            newTab.innerHTML = `
                <img class="house" src="../images/house.svg" alt="Иконка дома">
            `;
            newTab.addEventListener('click', function(e) {
                tabManager.setActiveTab(type, id);
                tabManager.restoreMainPanel();
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
        closeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            var currentTab = toolbar.getActiveTab();
            if(currentTab.id === id && currentTab.type === type){
                tabManager.closeTab(type, id);
                tabManager.setActiveTab(toolbar.homeBtnType, null);
                tabManager.restoreMainPanel();
            }else{
                tabManager.closeTab(type, id);
            }
        });

        newTab.addEventListener('click', async function() {
            tabManager.setActiveTab(type, id);
            tabManager.showTabContent(type, id);
        });

        return newTab;
    }

    //обновил
    closeTab(type, id) {
        toolbar.deleteTabByTypeAndId(type, id);
        this.updateToolbar();
    }

    addTab(type, id, name){
        toolbar.addTab(type, id, name);
        this.updateToolbar();
    }

    setActiveTab(type, id) {
        toolbar.changeTabByTypeAndId(type, id);
        this.updateToolbar();
    }

    //обновил
    updateToolbar(){
        this.toolbarView = document.querySelector('.toolbar');
        const tabs = toolbar.getAllTabs();
        const currentTab = toolbar.activeTab;
        const newToolbar = document.createElement('div');
        newToolbar.classList.add('toolbar');

        for(var i = 0; i < tabs.length; ++i){
            var tab = tabs[i];
            var newTab = this.createTab(tab.type, tab.id, tab.name);

            if(i == currentTab) newTab.classList.add('selectedToolbarItem');

            newToolbar.appendChild(newTab)
        }

        this.toolbarView.replaceWith(newToolbar);
    }

    //обновил
    async showTabContent(type, id) {
        if(type == this.teamType){
            const team = await user.getTeamById(id);
            this.showTeamContent(team);
        }
        if(type == this.subjectType){
            const subject = await user.getSubjectById(id);
            this.showSubjectContent(subject);
        }
    }

    showTeamContent(team) {
        this.mainPanel.innerHTML = '';
        
        const teamContent = this.createTeamContent(team);
        this.mainPanel.appendChild(teamContent);
    }

    showSubjectContent(subject) {
        this.mainPanel.innerHTML = '';
        
        const homeBtn = document.querySelector('.homeBtn');

        window.location.href = '../index.html';
    }

    createTeamContent(team) {
        const teamContent = document.createElement('div');
        teamContent.className = 'teamContent';
        teamContent.style.display = 'flex';
        teamContent.style.gap = '20px';
        teamContent.style.padding = '20px';
        teamContent.style.height = 'auto';

        const participantsColumn = document.createElement('div');
        participantsColumn.className = 'teamColumn';
        participantsColumn.innerHTML = '<h3>Участники команды</h3>';
        
        const participantsList = document.createElement('div');
        participantsList.className = 'participantsList';
        if (team.members && team.members.length > 0) {
            team.members.forEach(member => {
                const participantElement = document.createElement('div');
                participantElement.className = 'participantItem';

                const btnContainer = document.createElement('div');
                btnContainer.style.display = 'flex';
                btnContainer.style.flexDirection = 'row';
                btnContainer.style.alignItems = 'center';
                btnContainer.style.columnGap = '10px';

                const infoBtn = document.createElement('img');
                infoBtn.src = "../images/eye.svg"
                infoBtn.className = 'x';
                infoBtn.addEventListener('mouseup', async function() {
                    const assignedTasks = [];
                    member.assignedTasks.forEach(taskId => {
                        assignedTasks.push(user.getTaskById(taskId).title);
                    });
                    showAssignedTasksDialog(team, member, assignedTasks);
                });

                btnContainer.appendChild(infoBtn);
                
                const deleteBtn = document.createElement('img');
                deleteBtn.src = "../images/x-lg.svg";
                deleteBtn.className = 'x';
                deleteBtn.addEventListener('mouseup', async function() {
                    user.removeMemberFromTeam(team, member);
                    participantsList.removeChild(participantElement);
                });

                btnContainer.appendChild(deleteBtn);

                participantElement.textContent = member.name + " " + member.surname;
                participantElement.appendChild(btnContainer);
                participantsList.appendChild(participantElement);
            });
        } else {
            participantsList.textContent = 'Нет участников';
        }
        participantsColumn.appendChild(participantsList);


        var btnContainer = document.createElement('div');
        btnContainer.style.display = 'flex';
        btnContainer.style.justifyContent = 'flex-end';

        var addMemberBtn = document.createElement('button');
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
        participantsColumn.appendChild(btnContainer);

        const subjectsColumn = document.createElement('div');
        subjectsColumn.className = 'teamColumn';
        subjectsColumn.innerHTML = '<h3>Назначенные предметы</h3>';
        
        const subjectsList = document.createElement('div');
        subjectsList.className = 'subjectsList';
        if (team.subjects && team.subjects.length > 0) {
            const addSubject = async () => {
                for (const subject of team.subjects) {
                    const subjectElement = document.createElement('div');
                    subjectElement.className = 'participantItem';
                    var subj = await user.getSubjectById(subject);
                    subjectElement.textContent = subj.name;
                    subjectsList.appendChild(subjectElement);
                }
            };
            
            addSubject();
        } else {
            subjectsList.textContent = 'Нет назначенных предметов';
        }

        subjectsColumn.appendChild(subjectsList);

        teamContent.appendChild(participantsColumn);
        teamContent.appendChild(subjectsColumn);

        return teamContent;
    }
    
    switchActiveItem(activeItem, inactiveItem) {
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
};

const toolbar = new ToolBar();
toolbar.restoreToolbar();

const tabManager = new TabManager();