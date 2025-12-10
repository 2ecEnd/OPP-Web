document.addEventListener('DOMContentLoaded', async function() {
    const teamsItem = document.querySelector('.unselectedActionPanelItem');
    const subjectsItem = document.querySelector('.selectedActionPanelItem');
    const contentArea = document.querySelector('.contentArea');

    const teamType = "team";
    const subjectType = "subject";

    if(!user) await initUser();

    if(toolbar.getActiveTab() === null){
        tabManager.setActiveTab(toolbar.homeBtnType, null);
        setUserSubjects();
    }else{
        var currentTab = toolbar.getActiveTab();
        tabManager.setActiveTab(currentTab.type, currentTab.id);
        tabManager.showTabContent(currentTab.type, currentTab.id);

    }
    

    //-=-=-=-=-Слушатели-=-=-=-=-=-
    teamsItem.addEventListener('click', function() {
        if (!teamsItem.classList.contains('selectedActionPanelItem')) {
            tabManager.switchActiveItem(teamsItem, subjectsItem);
            clearContentArea();
            setUserTeams();
        }
    });
    
    subjectsItem.addEventListener('click', function() {
        if (!subjectsItem.classList.contains('selectedActionPanelItem')) {
            tabManager.switchActiveItem(subjectsItem, teamsItem);
            clearContentArea();
            setUserSubjects();
        }
    });
    
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
                        tabManager.setActiveTab(itemType, team.id);
                        tabManager.updateToolbar();
                    }else{
                        tabManager.addTab(itemType, team.id, team.name);
                    }

                    tabManager.showTeamContent(team);
                }
            } else if (itemType === subjectType) {
                const subject = user.subjects.find(s => s.id == itemId);
                if (subject) {

                    if(toolbar.tabExist(itemType, subject.id)){
                        tabManager.setActiveTab(itemType, subject.id);
                        tabManager.updateToolbar();
                    }else{
                        tabManager.addTab(itemType, subject.id, subject.name);
                    }

                    tabManager.showSubjectContent(subject);
                }
            }
        }
    });
    

    //-=-=-=-=-Остальное-=-=-=-=-=-
    function clearContentArea() {
        const addButton = contentArea.querySelector('.addButton');
        contentArea.innerHTML = 'x';
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
            newElement.style.display = 'flex';
            newElement.style.flexDirection = 'column';
            newElement.style.justifyContent = 'space-between';

            const delBtn = document.createElement('div');
            delBtn.textContent = "X";
            delBtn.style.color = "white";
            delBtn.style.fontSize = '32px'
            delBtn.addEventListener('mouseup', async function() {
                await user.removeTeam(team.id);
                tabManager.closeTab(teamType, team.id);
                contentArea.removeChild(newElement);
            });
        
            newElement.textContent = team.name;
            newElement.setAttribute('data-type', teamType);
            newElement.setAttribute('data-id', team.id);
            newElement.appendChild(delBtn);
            contentArea.appendChild(newElement);
        });
    }

    async function setUserSubjects() {
        var subjects = await user.getSubjects();
        const contentArea = document.querySelector('.contentArea');

        await subjects.forEach(subject => {
            contentArea.appendChild(subject.view.container);
        });
    }
});


function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}