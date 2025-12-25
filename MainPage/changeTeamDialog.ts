import type { Team } from "../javaScript/Team";
import { user } from "../javaScript/User";

export async function changeTeamDialog(team: Team, element: HTMLElement){
    const overlay = document.createElement('div');
    const modal = document.createElement('div');
    const buttonContainer = document.createElement('div');

    const input1 = document.createElement('input');
    input1.type = 'text';
    input1.placeholder = `name`;
    input1.value = team.name;
    input1.classList.add('modal-input');
    modal.appendChild(input1);

    const button1 = document.createElement('button');
    button1.type = 'button';
    button1.textContent = 'Сохранить';
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

    button1.onclick = async () =>  {
        const name = input1.value.trim();

        if(name !== ""){
            if(name != team.name){
                await user.teamsService.changeTeam(team.id, name);
                team.name = name;
                element.textContent = name;
                document.body.removeChild(overlay);
            }else{
                document.body.removeChild(overlay);
            }
        }else{
            alert("Пожалуйста, заполните название");
        }
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