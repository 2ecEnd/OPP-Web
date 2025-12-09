function showAddMemberDialog(team){
  const overlay = document.createElement('div');
  const modal = document.createElement('div');
  const buttonContainer = document.createElement('div');

  for (let i = 0; i < 4; i++) {
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = `Поле ${i + 1}`;
      input.classList.add('modal-input');
      modal.appendChild(input);
  }

  const button1 = document.createElement('button');
  button1.type = 'button';
  button1.textContent = 'Создать';
  button1.className = 'modal-btn create-btn';

  const button2 = document.createElement('button');
  button2.type = 'button';
  button2.textContent = 'Отмена';
  button2.className = 'modal-btn cancel-btn';

  buttonContainer.classList.add('modal-buttons');
  buttonContainer.appendChild(button1);
  buttonContainer.appendChild(button2);
  modal.appendChild(buttonContainer);

  overlay.appendChild(modal);

  Object.assign(overlay.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: '9999'
  });

  overlay.classList.add('modal-overlay');
  modal.classList.add('modal');

  document.body.appendChild(overlay);

  button1.onclick = () => {
      console.log('Кнопка 1 нажата');
      document.body.removeChild(overlay);
  };

  button2.onclick = () => {
      console.log('Кнопка 2 нажата');
      document.body.removeChild(overlay);
  };

  overlay.onclick = (e) => {
      if (e.target === overlay) {
          document.body.removeChild(overlay);
      }
  };
}