import { addSubjectMenu } from "./AddSubjectMenu.js";
import type { Subject } from "./Subject.js";
import type { Team } from "./Team.js";
import { user } from "./User.js";

export class SubjectView{
    private model: Subject;
    public container: HTMLElement;

    constructor(model: Subject){
        this.model = model;
        this.container = document.createElement('div');

        this.createView();
    }

    deleteActionHandler(e: Event): void {
        e.stopPropagation();
        this.model.deleteSubject();
        this.container.remove();
    }

    openContextMenu(e: Event): void {
        e.stopPropagation();

        const moreVertButton: HTMLElement = this.container.querySelector('.more-vert-button')!;
        const contextMenu: HTMLElement = this.container.querySelector('.subject-context-menu')!;
        
        moreVertButton.classList.toggle('active');
        contextMenu.classList.toggle('active');
    }

    openEditMenu(e: Event): void{
        e.stopPropagation();

        addSubjectMenu.showSelf(
            "edit",
            this.model.name,
            (newName: string) => { this.updateView(newName); }
        );
    }

    openAssignMenu(e: Event): void {
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
        
        user.teams.forEach((team: Team) => {
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
                this.model.teamId = team.id;
                this.container.querySelector('.subject-info')!.children[1]!.textContent = team.name;
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
        
        const outsideClickListener = (event: MouseEvent) => {
            if (!menu.contains(event.target as Node)) {
                removeMenu();
            }
        };
        
        const escapeClickListener = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                removeMenu();
            }
        };
        
        setTimeout(() => {
            document.addEventListener('click', outsideClickListener);
            document.addEventListener('keydown', escapeClickListener);
        }, 0);
    }

    createContextMenu(): HTMLElement {
        const contextMenu: HTMLElement = document.createElement('div');
        contextMenu.className = 'subject-context-menu subject-menu';
        
        const actions = [
            { text: 'Изменить', handler: this.openEditMenu.bind(this) },
            { text: 'Назначить', handler: this.openAssignMenu.bind(this) },
            { text: 'Удалить', handler: this.deleteActionHandler.bind(this) }
        ];

        actions.forEach(({ text, handler}) => {
            const button = document.createElement('button');
            button.textContent = text;
            
            if (handler) {
                button.addEventListener('click', handler);
            }
            
            contextMenu.appendChild(button);
        });

        return contextMenu;
    }

    createView(): void {
        const newElement: HTMLElement = document.createElement('div');
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
        `
        newElement.setAttribute('data-type', 'subject');
        newElement.setAttribute('data-id', this.model.id);

        newElement.appendChild(this.createContextMenu());

        newElement.querySelector('.more-vert-button')!.addEventListener('click', 
            this.openContextMenu.bind(this));
    }

    updateView(newName: string): void {
        this.model.changeSubject(newName);
        this.container.querySelector('.subject-info')!.children[0]!.textContent = newName;
    }
}