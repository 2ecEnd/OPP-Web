document.addEventListener('DOMContentLoaded', function() {
    const teamsItem = document.querySelector('.unselectedActionPanelItem');
    const subjectsItem = document.querySelector('.selectedActionPanelItem');
    const contentArea = document.querySelector('.contentArea');
    const toolbar = document.querySelector('.toolbar');

    const originalActionPanel = document.querySelector('.actionPanel');
    const originalContentArea = document.querySelector('.contentArea');
    const mainPanel = document.querySelector('.mainPanel');
    
    function clearContentArea() {
        const addButton = contentArea.querySelector('.addButton');
        contentArea.innerHTML = '';
        if (addButton) {
            contentArea.appendChild(addButton);
        }
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
            arrow.src = 'arrow.svg';
            arrow.alt = 'Иконка стрелки';
            inactiveItem.appendChild(arrow);
        }
    }
    
    teamsItem.addEventListener('click', function() {
        if (!teamsItem.classList.contains('selectedActionPanelItem')) {
            switchActiveItem(teamsItem, subjectsItem);
            clearContentArea();
        }
    });
    
    subjectsItem.addEventListener('click', function() {
        if (!subjectsItem.classList.contains('selectedActionPanelItem')) {
            switchActiveItem(subjectsItem, teamsItem);
            clearContentArea();
        }
    });

    function createTeamContent(team) {
        const teamContent = document.createElement('div');
        teamContent.className = 'teamContent';
        teamContent.style.display = 'flex';
        teamContent.style.gap = '20px';
        teamContent.style.padding = '20px';

        // Колонка участников
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

        // Колонка назначенных предметов
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
        
        tabElement.classList.add('selectedToolbarItem');
    }

    function openTeamTab(team) {
        const newTab = document.createElement('div');
        newTab.className = 'toolbarItem selectedToolbarItem';
        newTab.setAttribute('data-team-id', team.id);
        
        newTab.innerHTML = `
            <img class="terminal" src="terminal.svg" alt="Иконка терминала">
            <div class="toolbarItemText">${team.name}</div>
            <img class="x" src="x-lg.svg" alt="Иконка крестика">
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
        newTab.setAttribute('data-subject-id', subject.id);
        
        newTab.innerHTML = `
            <img class="terminal" src="terminal.svg" alt="Иконка терминала">
            <div class="toolbarItemText">${subject.name}</div>
            <img class="x" src="x-lg.svg" alt="Иконка крестика">
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
        
        // Вставить сюда вызов холста
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

    const homeBtn = document.querySelector('.homeBtn');
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
                const team = user.Teams.find(t => t.id == itemId);
                if (team) {
                    openTeamTab(team);
                }
            } else if (itemType === 'subject') {
                const subject = user.Subjects.find(s => s.id == itemId);
                if (subject) {
                    openSubjectTab(subject);
                }
            }
        }
    });
});