import { tabManager } from "../MainPage/TabManager.js";
import { addSubjectMenu } from "./AddSubjectMenu.js";
import { ToolBar } from "./ToolBar.js";
import { user } from "./User.js";
export class SubjectView {
    model;
    container;
    constructor(model) {
        this.model = model;
        this.container = document.createElement('div');
        this.createView();
    }
    deleteActionHandler(e) {
        e.stopPropagation();
        tabManager.closeTab("subject", this.model.id);
        this.model.deleteSubject();
        this.container.remove();
    }
    openContextMenu(e) {
        e.stopPropagation();
        const moreVertButton = this.container.querySelector('.more-vert-button');
        const contextMenu = this.container.querySelector('.subject-context-menu');
        moreVertButton.classList.toggle('active');
        contextMenu.classList.toggle('active');
    }
    openEditMenu(e) {
        e.stopPropagation();
        addSubjectMenu.showSelf("edit", this.model.name, (newName) => { this.updateView(newName); });
    }
    openAssignMenu(e) {
        e.stopPropagation();
        const menu = document.createElement('div');
        menu.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 300px;
            max-height: 80vh;
            background-color: #2C2C2C;
            border-radius: 15px;
            padding: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            overflow-y: auto;
        `;
        const scrollContainer = document.createElement('div');
        scrollContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-height: calc(80vh - 40px);
            overflow-y: auto;
        `;
        user.teams.forEach((team) => {
            const teamItem = document.createElement('div');
            teamItem.style.cssText = `
                background-color: #383838;
                color: white;
                padding: 15px;
                border-radius: 8px;
                cursor: pointer;
                text-align: center;
                transition: background-color 0.2s;
                user-select: none;
            `;
            teamItem.textContent = team.name;
            teamItem.addEventListener('click', (event) => {
                event.stopPropagation();
                this.model.setTeam(team.id);
                this.container.querySelector('.subject-info').children[1].textContent = `Команда: ${team.name}`;
                removeMenu();
            });
            teamItem.addEventListener('mouseenter', () => {
                teamItem.style.backgroundColor = '#454545';
            });
            teamItem.addEventListener('mouseleave', () => {
                teamItem.style.backgroundColor = '#383838';
            });
            scrollContainer.appendChild(teamItem);
        });
        menu.appendChild(scrollContainer);
        document.body.appendChild(menu);
        const removeMenu = () => {
            if (menu && menu.parentNode) {
                menu.parentNode.removeChild(menu);
            }
            document.removeEventListener('click', outsideClickListener);
            document.removeEventListener('keydown', escapeClickListener);
        };
        const outsideClickListener = (event) => {
            if (!menu.contains(event.target)) {
                removeMenu();
            }
        };
        const escapeClickListener = (event) => {
            if (event.key === 'Escape') {
                removeMenu();
            }
        };
        setTimeout(() => {
            document.addEventListener('click', outsideClickListener);
            document.addEventListener('keydown', escapeClickListener);
        }, 0);
    }
    createContextMenu() {
        const contextMenu = document.createElement('div');
        contextMenu.className = 'subject-context-menu subject-menu';
        const actions = [
            { text: 'Изменить', handler: this.openEditMenu.bind(this) },
            { text: 'Назначить', handler: this.openAssignMenu.bind(this) },
            { text: 'Удалить', handler: this.deleteActionHandler.bind(this) }
        ];
        actions.forEach(({ text, handler }) => {
            const button = document.createElement('button');
            button.textContent = text;
            if (handler) {
                button.addEventListener('click', handler);
            }
            contextMenu.appendChild(button);
        });
        return contextMenu;
    }
    createView() {
        const newElement = document.createElement('div');
        this.container = newElement;
        newElement.classList.add('contentItem');
        newElement.classList.add('subjectItem');
        newElement.innerHTML = `
            <div class="miniature"></div>
            <div class="subject-info">
                <p>Название: ${this.model.name}</p>
                <p>Команда: ${this.model.getTeamName()}</p>
            </div>
            <div class="more-vert-button">
                <img src="../images/More vertical.svg" alt="">
            </div>
        `;
        newElement.setAttribute('data-type', 'subject');
        newElement.setAttribute('data-id', this.model.id);
        newElement.appendChild(this.createContextMenu());
        newElement.querySelector('.more-vert-button').addEventListener('click', this.openContextMenu.bind(this));
    }
    updateView(newName) {
        this.model.changeSubject(newName);
        this.container.querySelector('.subject-info').children[0].textContent = newName;
    }
}
//# sourceMappingURL=SubjectView.js.map