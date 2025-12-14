const addButton = document.querySelector('.addButton');
const modalOverlay = document.getElementById('modalOverlay');
const modalInput = document.getElementById('modalInput');
const createBtn = document.getElementById('createBtn');
const cancelBtn = document.getElementById('cancelBtn');

function openModal() {
  modalOverlay.style.display = 'flex';
  modalInput.focus();
}

function closeModal() {
  modalOverlay.style.display = 'none';
  modalInput.value = '';
}

addButton.addEventListener('click', openModal);

cancelBtn.addEventListener('click', closeModal);

createBtn.addEventListener('click', async function() {
  const name = modalInput.value.trim();
  if (name && user) {

    const activeItem = document.querySelector('.selectedActionPanelItem');
    const activeItemText = activeItem.querySelector('.actionPanelItemText').textContent;
    
    const contentArea = document.querySelector('.contentArea');
    
    if (activeItemText === 'Teams'){
      const newElement = document.createElement('div');
      newElement.classList.add('contentItem');
      newElement.style.display = 'flex';
      newElement.style.flexDirection = 'column';
      newElement.style.justifyContent = 'space-between';
      newElement.textContent = name;

      const buttons = document.createElement('div');
      buttons.classList.add('contentItem');
      buttons.style.display = 'flex';
      buttons.style.flexDirection = 'row';
      buttons.style.justifyContent = 'space-between';

      const newTeam = new Team(name, [], []);
      const teamId = await user.addTeam(newTeam);
      newElement.setAttribute('data-type', 'team');
      newElement.setAttribute('data-id', teamId);

      const delBtn = document.createElement('div');
      delBtn.textContent = "X";
      delBtn.style.color = "white";
      delBtn.style.fontSize = '32px'
      delBtn.addEventListener('mouseup', async function() {
        await user.removeTeam(teamId);
        tabManager.closeTab('team', teamId);
        contentArea.removeChild(newElement);
      });

      const changeBtn = document.createElement('div');
      changeBtn.textContent = "R";
      changeBtn.style.color = "white";
      changeBtn.style.fontSize = '32px'

      buttons.appendChild(delBtn);
      buttons.appendChild(changeBtn);
      newElement.appendChild(buttons);
      contentArea.appendChild(newElement);
    }
    else if (activeItemText === 'Subjects'){
      const newSubject = new Subject(name, [], null, null);
      await user.addSubject(newSubject);
      contentArea.appendChild(newSubject.view.container);
    }

    closeModal();
  }
});

modalOverlay.addEventListener('click', function(e) {
  if (e.target === modalOverlay) {
    closeModal();
  }
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeModal();
  }
});