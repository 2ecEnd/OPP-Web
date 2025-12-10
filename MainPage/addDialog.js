

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
      newElement.textContent = name;

      const newTeam = new Team(name, [], []);
      const teamId = await user.addTeam(newTeam);
      newElement.setAttribute('data-type', 'team');
      newElement.setAttribute('data-id', teamId);

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