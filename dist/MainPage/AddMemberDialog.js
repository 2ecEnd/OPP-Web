import { TeamMember } from "../javaScript/TeamMember.js";
import { isValidEmail } from "./SupportScript.js";
export function showAddMemberDialog(team) {
    const overlay = document.createElement('div');
    const modal = document.createElement('div');
    const buttonContainer = document.createElement('div');
    const input1 = document.createElement('input');
    input1.type = 'text';
    input1.placeholder = `name`;
    input1.classList.add('modal-input');
    modal.appendChild(input1);
    const input2 = document.createElement('input');
    input2.type = 'text';
    input2.placeholder = `surname`;
    input2.classList.add('modal-input');
    modal.appendChild(input2);
    const input3 = document.createElement('input');
    input3.type = 'text';
    input3.placeholder = `email`;
    input3.classList.add('modal-input');
    modal.appendChild(input3);
    const input4 = document.createElement('input');
    input4.type = 'text';
    input4.placeholder = `specialization`;
    input4.classList.add('modal-input');
    modal.appendChild(input4);
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
    button1.onclick = async () => {
        const name = input1.value.trim();
        const surname = input2.value.trim();
        const email = input3.value.trim();
        const specialization = input4.value.trim();
        if (name !== "" && surname !== "") {
            if (email === "" || isValidEmail(email)) {
                team.addMember(new TeamMember(name, surname, email, specialization));
                document.body.removeChild(overlay);
            }
            else {
                alert("Пожалуйста, введите корректный email адрес");
            }
        }
        else {
            alert("Пожалуйста, заполните имя и фамилию");
        }
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
//# sourceMappingURL=AddMemberDialog.js.map