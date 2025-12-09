document.addEventListener('DOMContentLoaded', async function() {
    const teamsItem = document.querySelector('.unselectedActionPanelItem');
    const subjectsItem = document.querySelector('.selectedActionPanelItem');
    const contentArea = document.querySelector('.contentArea');
    var toolbarView = document.querySelector('.toolbar');

    const originalActionPanel = document.querySelector('.actionPanel');
    const originalContentArea = document.querySelector('.contentArea');
    const mainPanel = document.querySelector('.mainPanel');

    const teamType = "team";
    const subjectType = "subject";

    if(!user) await initUser();

    const toolbar = new ToolBar();
    toolbar.restoreToolbar();

    if(toolbar.getActiveTab() === null){
        setActiveTab(toolbar.homeBtnType, null);
        setUserSubjects();
    }else{
        var currentTab = toolbar.getActiveTab();
        setActiveTab(currentTab.type, currentTab.id);
        showTabContent(currentTab.type, currentTab.id);
    }
    
    function clearContentArea() {
        const addButton = contentArea.querySelector('.addButton');
        contentArea.innerHTML = '';
        if (addButton) {
            contentArea.appendChild(addButton);
        }
    }

    async function setUserTeams() {
        var teams = await user.getTeams();
        const contentArea = document.querySelector('.contentArea');

        teams.forEach(team => {
            const newElement = document.createElement('div');
            newElement.classList.add('contentItem');
            newElement.textContent = team.name;
            newElement.setAttribute('data-type', teamType);
            newElement.setAttribute('data-id', team.id);
            contentArea.appendChild(newElement);
        });
    }

    async function setUserSubjects() {
        var subjects = await user.getSubjects();
        const contentArea = document.querySelector('.contentArea');

        subjects.forEach(subject => {
            const newElement = document.createElement('div');
            newElement.classList.add('contentItem');
            newElement.innerHTML = `
                <div class="miniature"></div>
                <div class="subject-info">
                    <p>Название: ${subject.name}</p>
                    <p>Команда: </p>
                </div>
            `
            newElement.setAttribute('data-type', subjectType);
            newElement.setAttribute('data-id', subject.id);
            contentArea.appendChild(newElement);
        });
    }
    
    function switchActiveItem(activeItem, inactiveItem) {
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
    
    teamsItem.addEventListener('click', function() {
        if (!teamsItem.classList.contains('selectedActionPanelItem')) {
            switchActiveItem(teamsItem, subjectsItem);
            clearContentArea();
            setUserTeams();
        }
    });
    
    subjectsItem.addEventListener('click', function() {
        if (!subjectsItem.classList.contains('selectedActionPanelItem')) {
            switchActiveItem(subjectsItem, teamsItem);
            clearContentArea();
            setUserSubjects();
        }
    });

    function createTeamContent(team) {
        const teamContent = document.createElement('div');
        teamContent.className = 'teamContent';
        teamContent.style.display = 'flex';
        teamContent.style.gap = '20px';
        teamContent.style.padding = '20px';

        const participantsColumn = document.createElement('div');
        participantsColumn.className = 'teamColumn';
        participantsColumn.innerHTML = '<h3>Участники команды</h3>';
        
        const participantsList = document.createElement('div');
        participantsList.className = 'participantsList';
        if (team.participants && team.participants.length > 0) {
            team.participants.forEach(participant => {
                const participantElement = document.createElement('div');
                participantElement.className = 'participantItem';
                participantElement.textContent = participant;
                participantsList.appendChild(participantElement);
            });
        } else {
            participantsList.textContent = 'Нет участников';
        }
        participantsColumn.appendChild(participantsList);

        const subjectsColumn = document.createElement('div');
        subjectsColumn.className = 'teamColumn';
        subjectsColumn.innerHTML = '<h3>Назначенные предметы</h3>';
        
        const subjectsList = document.createElement('div');
        subjectsList.className = 'subjectsList';
        if (team.assignedSubjects && team.assignedSubjects.length > 0) {
            team.assignedSubjects.forEach(subject => {
                const subjectElement = document.createElement('div');
                subjectElement.className = 'subjectItem';
                subjectElement.textContent = subject;
                subjectsList.appendChild(subjectElement);
            });
        } else {
            subjectsList.textContent = 'Нет назначенных предметов';
        }
        subjectsColumn.appendChild(subjectsList);

        teamContent.appendChild(participantsColumn);
        teamContent.appendChild(subjectsColumn);

        return teamContent;
    }

    function setActiveTab(type, id) {
        toolbar.changeTabByTypeAndId(type, id);
        updateToolbar();
    }

    //обновил
    function createTab(type, id, name) {
        const newTab = document.createElement('div');
        newTab.setAttribute('type', type);
        newTab.setAttribute('id', id);

        if(type == toolbar.homeBtnType){
            newTab.classList.add('toolbarItem');
            newTab.innerHTML = `
                <img class="house" src="../images/house.svg" alt="Иконка дома">
            `;
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

        const closeBtn = newTab.querySelector('.x');
        closeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            var currentTab = toolbar.getActiveTab();
            if(currentTab.id === id && currentTab.type === type){
                closeTab(type, id);
                setActiveTab(toolbar.homeBtnType, null);
                restoreMainPanel();
            }else{
                closeTab(type, id);
            }
        });

        newTab.addEventListener('click', async function() {
            setActiveTab(type, id);
            showTabContent(type, id);
        });

        return newTab;
    }

    //обновил
    async function showTabContent(type, id) {
        if(type == teamType){
            const team = await user.getTeamById(id);
            showTeamContent(team);
        }
        if(type == subjectType){
            const subject = await user.getSubjectById(id);
            showSubjectContent(subject);
        }
    }
    
    //обновил
    function closeTab(type, id) {
        toolbar.deleteTabByTypeAndId(type, id);
        updateToolbar();

    }

    function addTab(type, id, name){
        toolbar.addTab(type, id, name);
        updateToolbar();
    }
    
    //обновил
    function updateToolbar(){
        toolbarView = document.querySelector('.toolbar');
        const tabs = toolbar.getAllTabs();
        const currentTab = toolbar.activeTab;
        const newToolbar = document.createElement('div');
        newToolbar.classList.add('toolbar');

        for(var i = 0; i < tabs.length; ++i){
            var tab = tabs[i];
            var newTab = createTab(tab.type, tab.id, tab.name);

            if(i == currentTab) newTab.classList.add('selectedToolbarItem');

            newToolbar.appendChild(newTab)
        }

        toolbarView.replaceWith(newToolbar);
    }

    function showTeamContent(team) {
        mainPanel.innerHTML = '';
        
        const teamContent = createTeamContent(team);
        mainPanel.appendChild(teamContent);
    }

    function showSubjectContent(subject) {
        mainPanel.innerHTML = '';
        
        const homeBtn = document.querySelector('.homeBtn');

        window.location.href = '../index.html';
    }

    function restoreMainPanel() {
        mainPanel.innerHTML = '';
        mainPanel.appendChild(originalActionPanel);
        mainPanel.appendChild(originalContentArea);
        
        const restoredTeamsItem = mainPanel.querySelector('.unselectedActionPanelItem');
        const restoredSubjectsItem = mainPanel.querySelector('.selectedActionPanelItem');
        
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
    
    //обновил
    contentArea.addEventListener('click', function(e) {
        const contentItem = e.target.closest('.contentItem');
        if (contentItem) {
            const itemType = contentItem.getAttribute('data-type');
            const itemId = contentItem.getAttribute('data-id');
            const itemName = contentItem.textContent;

            if (itemType === teamType) {
                const team = user.teams.find(t => t.id == itemId);
                if (team) {

                    if(toolbar.tabExist(itemType, team.id)){
                        setActiveTab(itemType, team.id);
                        updateToolbar();
                    }else{
                        addTab(itemType, team.id, team.name);
                    }

                    showTeamContent(team);
                }
            } else if (itemType === subjectType) {
                const subject = user.subjects.find(s => s.id == itemId);
                if (subject) {

                    if(toolbar.tabExist(itemType, subject.id)){
                        setActiveTab(itemType, subject.id);
                        updateToolbar();
                    }else{
                        addTab(itemType, subject.id, subject.name);
                    }

                    showSubjectContent(subject);
                }
            }
        }
    });
});