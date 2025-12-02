document.addEventListener('DOMContentLoaded', function() {
    const teamsItem = document.querySelector('.unselectedActionPanelItem');
    const subjectsItem = document.querySelector('.selectedActionPanelItem');
    const contentArea = document.querySelector('.contentArea');
    const toolbar = document.querySelector('.toolbar');
    const homeBtn = document.querySelector('.homeBtn');

    const originalActionPanel = document.querySelector('.actionPanel');
    const originalContentArea = document.querySelector('.contentArea');
    const mainPanel = document.querySelector('.mainPanel');

    initScreen();
    function initScreen(){
        const tab = localStorage.getItem("tab");
        if (!teamsItem.classList.contains('selectedActionPanelItem') && !tab) {
            switchActiveItem(teamsItem, subjectsItem);
            clearContentArea();
            setUserTeams();
        }

        if(tab){

            var currentToolbar = document.querySelector('.toolbar');
            var newToolbar = loadAndRestoreElement("toolbar");

            var tabElements = newToolbar.querySelectorAll('.toolbarItem');

            tabElements.forEach(function(element) {
                if(element.hasAttribute('data-subject-id')){
                    var subject = getSubjectById(element.getAttribute('data-subject-id'));
                    configureTab(element, "subject", subject);
                    if(subject.Id == tab.itemId){
                        setActiveTab(element);
                    }
                }

                if(element.hasAttribute('data-team-id')){
                    var team = getTeamById(element.getAttribute('data-team-id'));
                    configureTab(element, "team", team);
                    if(team.Id == tab.itemId){
                        setActiveTab(element);
                    }
                }
            });

            var homeBtn = newToolbar.querySelector('.homeBtn');
            homeBtn.addEventListener('click', function() {
                setActiveTab(homeBtn);
                restoreMainPanel();
            });

            currentToolbar.replaceWith(newToolbar);
            

            if (tab.itemType === 'team') {
                const team = getTeamById(tab.itemId);
                if (team) {
                    localStorage.removeItem("tab");
                    showTeamContent(team);
                }else{
                    localStorage.removeItem("tab");
                }
            } else if (tab.itemType === 'subject') {
                const subject = getSubjectById(tab.itemId);
                if (subject) {
                    localStorage.removeItem("tab");
                    showSubjectContent(subject);
                }else{
                    localStorage.removeItem("tab");
                }
            }
        }
    }
    
    function clearContentArea() {
        const addButton = contentArea.querySelector('.addButton');
        contentArea.innerHTML = '';
        if (addButton) {
            contentArea.appendChild(addButton);
        }
    }

    async function setUserTeams() {
        var teams = await getTeams();
        const contentArea = document.querySelector('.contentArea');

        teams.forEach(team => {
            const newElement = document.createElement('div');
            newElement.classList.add('contentItem');
            newElement.textContent = team.Name;
            newElement.setAttribute('data-type', 'team');
            newElement.setAttribute('data-id', team.Id);
            contentArea.appendChild(newElement);
        });
    }

    async function setUserSubjects() {
        var subjects = await getSubjects();
        const contentArea = document.querySelector('.contentArea');

        subjects.forEach(subject => {
            const newElement = document.createElement('div');
            newElement.classList.add('contentItem');
            newElement.textContent = subject.Name;
            newElement.setAttribute('data-type', 'subject');
            newElement.setAttribute('data-id', subject.Id);
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
        
        if (inactiveItem) {
            const arrow = document.createElement('img');
            arrow.className = 'arrow';
            arrow.src = '../images/arrow.svg';
            arrow.alt = 'Иконка стрелки';
            inactiveItem.appendChild(arrow);
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

    function setActiveTab(tabElement) {
        document.querySelectorAll('.toolbarItem').forEach(item => {
            item.classList.remove('selectedToolbarItem');
        });
        homeBtn.classList.remove('selectedToolbarItem');
        
        tabElement.classList.add('selectedToolbarItem');
    }

    function openTeamTab(team) {
        const newTab = document.createElement('div');
        newTab.className = 'toolbarItem selectedToolbarItem';
        newTab.setAttribute('data-team-id', team.Id);
        
        newTab.innerHTML = `
            <img class="terminal" src="../images/terminal.svg" alt="Иконка терминала">
            <div class="toolbarItemText">${team.Name}</div>
            <img class="x" src="../images/x-lg.svg" alt="Иконка крестика">
        `;

        const closeBtn = newTab.querySelector('.x');
        closeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            closeTab(newTab);
        });

        newTab.addEventListener('click', function() {
            setActiveTab(newTab);
            showTeamContent(team);
        });

        const homeBtn = document.querySelector('.homeBtn');
        homeBtn.parentNode.insertBefore(newTab, homeBtn.nextSibling);

        setActiveTab(newTab);
        showTeamContent(team);
    }

    function openSubjectTab(subject) {
        const newTab = document.createElement('div');
        newTab.className = 'toolbarItem selectedToolbarItem';
        newTab.setAttribute('data-subject-id', subject.Id);
        
        newTab.innerHTML = `
            <img class="terminal" src="../images/terminal.svg" alt="Иконка терминала">
            <div class="toolbarItemText">${subject.Name}</div>
            <img class="x" src="../images/x-lg.svg" alt="Иконка крестика">
        `;

        const closeBtn = newTab.querySelector('.x');
        closeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            closeTab(newTab);
        });

        newTab.addEventListener('click', function() {
            setActiveTab(newTab);
            showSubjectContent(subject);
        });

        const homeBtn = document.querySelector('.homeBtn');
        homeBtn.parentNode.insertBefore(newTab, homeBtn.nextSibling);

        setActiveTab(newTab);
        showSubjectContent(subject);
    }

    function configureTab(tab, type, context){
        const closeBtn = tab.querySelector('.x');
        closeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            closeTab(tab);
        });

        if(type == "team"){
            tab.addEventListener('click', function() {
                setActiveTab(tab);
                showTeamContent(context);
            });
        }

        if(type == "subject"){
            tab.addEventListener('click', function() {
                setActiveTab(tab);
                showSubjectContent(context);
            });
        }
    }

    function closeTab(tabElement) {
        if (tabElement.classList.contains('selectedToolbarItem')) {
            const homeBtn = document.querySelector('.homeBtn');
            setActiveTab(homeBtn);
            restoreMainPanel();
        }
        
        tabElement.remove();
    }

    function showTeamContent(team) {
        mainPanel.innerHTML = '';
        
        const teamContent = createTeamContent(team);
        mainPanel.appendChild(teamContent);
    }

    function showSubjectContent(subject) {
        mainPanel.innerHTML = '';
        
        const homeBtn = document.querySelector('.homeBtn');
        saveElementData(homeBtn.parentNode, "toolbar");

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

    homeBtn.addEventListener('click', function() {
        setActiveTab(homeBtn);
        restoreMainPanel();
    });

    contentArea.addEventListener('click', function(e) {
        const contentItem = e.target.closest('.contentItem');
        if (contentItem) {
            const itemType = contentItem.getAttribute('data-type');
            const itemId = contentItem.getAttribute('data-id');
            const itemName = contentItem.textContent;

            if (itemType === 'team') {
                const team = user.Teams.find(t => t.Id == itemId);
                if (team) {
                    openTeamTab(team);
                }
            } else if (itemType === 'subject') {
                const subject = user.Subjects.find(s => s.Id == itemId);
                if (subject) {
                    openSubjectTab(subject);
                }
            }
        }
    });
});