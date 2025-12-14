function showAssignedTasksDialog(team, member, assignedTasks){
  const overlay = document.createElement('div');
  const modal = document.createElement('div');
  const buttonContainer = document.createElement('div');

  const input1 = document.createElement('input');
  input1.type = 'text';
  input1.placeholder = `name`;
  input1.value = member.name;
  input1.classList.add('modal-input');
  modal.appendChild(input1);

  const input2 = document.createElement('input');
  input2.type = 'text';
  input2.placeholder = `surname`;
  input2.value = member.surname;
  input2.classList.add('modal-input');
  modal.appendChild(input2);

  const input3 = document.createElement('input');
  input3.type = 'text';
  input3.placeholder = `email`;
  input3.value = member.email ? member.email : "";
  input3.classList.add('modal-input');
  modal.appendChild(input3);

  const input4 = document.createElement('input');
  input4.type = 'text';
  input4.placeholder = `specialization`;
  input4.value = member.specialization ? member.specialization : "";
  input4.classList.add('modal-input');
  modal.appendChild(input4);

  assignedTasks.forEach(task => {
    const taskView = document.createElement('span');
    taskView.style.color = 'white';
    taskView.style.paddingBottom = '20px';
    taskView.textContent = task;
    modal.appendChild(taskView);
  });

  if(assignedTasks.length === 0){
    const taskView = document.createElement('span');
    taskView.style.color = 'white';
    taskView.style.paddingBottom = '20px';
    taskView.textContent = 'Нет назначенных задач';
    modal.appendChild(taskView);
  }

  const button1 = document.createElement('button');
  button1.type = 'button';
  button1.textContent = 'Сохранить';
  button1.className = 'modal-btn create-btn';

  buttonContainer.classList.add('modal-buttons');
  buttonContainer.appendChild(button1);
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
  modal.style.display = 'flex';
  modal.style.flexDirection = 'column';
  modal.style.alignItems = 'center';

  document.body.appendChild(overlay);

  button1.onclick = async () =>  {
      const name = input1.value.trim();
      const surname = input2.value.trim();
      const email = input3.value.trim();
      const specialization = input4.value.trim();

      if(name != member.name ||
        surname != member.surname ||
        email != member.email ||
        specialization != member.specialization){
            if(name !== "" && surname !== ""){
                if(email === "" || isValidEmail(email)){
                    member.changeData(name, surname, email, specialization);
                    user.changeMemberInTeam(team, member);
                    document.body.removeChild(overlay);
                }else{
                    alert("Пожалуйста, введите корректный email адрес");
                }
            }else{
                alert("Пожалуйста, заполните имя и фамилию");
            }
            
        }
  };

  overlay.onclick = (e) => {
      if (e.target === overlay) {
          document.body.removeChild(overlay);
      }
  };
}