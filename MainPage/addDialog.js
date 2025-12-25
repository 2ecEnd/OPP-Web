import { Team } from "../javaScript/Team";
import { user } from "../javaScript/User";
import { createTeamView } from "./teamView";
import { tabManager } from "./TabManager";
import { Subject } from "../javaScript/Subject";
const addButton = document.querySelector('.addButton');
const modalOverlay = document.getElementById('modalOverlay');
const modalInput = document.getElementById('modalInput');
const createBtn = document.getElementById('createBtn');
const cancelBtn = document.getElementById('cancelBtn');
function openModal() {
    if (!modalOverlay || !modalInput)
        return;
    modalOverlay.style.display = 'flex';
    modalInput.focus();
}
function closeModal() {
    if (!modalOverlay || !modalInput)
        return;
    modalOverlay.style.display = 'none';
    modalInput.value = '';
}
addButton?.addEventListener('click', openModal);
cancelBtn?.addEventListener('click', closeModal);
createBtn?.addEventListener('click', async function () {
    const name = modalInput.value.trim();
    if (name && user) {
        const activeItem = document.querySelector('.selectedActionPanelItem');
        const activeItemText = activeItem?.querySelector('.actionPanelItemText')?.textContent ?? "";
        const contentArea = document.querySelector('.contentArea');
        if (activeItemText === 'Teams') {
            const newTeam = new Team(name, [], []);
            const teamId = await user.teamsService.addTeam(newTeam);
            const newElement = createTeamView('team', teamId);
            newElement.textContent = name;
            const buttons = document.createElement('div');
            buttons.style.display = 'flex';
            buttons.style.flexDirection = 'row';
            buttons.style.justifyContent = 'space-around';
            newElement.setAttribute('data-type', 'team');
            newElement.setAttribute('data-id', teamId);
            const delBtn = document.createElement('div');
            delBtn.textContent = "X";
            delBtn.style.color = "white";
            delBtn.style.fontSize = '32px';
            delBtn.addEventListener('mouseup', async function () {
                await user.teamsService.removeTeam(teamId);
                tabManager.closeTab('team', teamId);
                contentArea?.removeChild(newElement);
            });
            const changeBtn = document.createElement('div');
            changeBtn.textContent = "R";
            changeBtn.style.color = "white";
            changeBtn.style.fontSize = '32px';
            buttons.appendChild(delBtn);
            buttons.appendChild(changeBtn);
            newElement.appendChild(buttons);
            contentArea?.appendChild(newElement);
        }
        else if (activeItemText === 'Subjects') {
            const newSubject = new Subject(null, name, [], null);
            await user.subjectsService.addSubject(newSubject);
            contentArea?.appendChild(newSubject.getView().container);
        }
        closeModal();
    }
});
modalOverlay.addEventListener('click', function (e) {
    if (e.target === modalOverlay) {
        closeModal();
    }
});
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});
//# sourceMappingURL=addDialog.js.map