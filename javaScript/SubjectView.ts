import { addSubjectMenu } from "./AddSubjectMenu.js";
import type { Subject } from "./Subject.js";

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

        addSubjectMenu.showSelf("edit", this.model.name, this.updateView);
    }

    createContextMenu(): HTMLElement {
        const contextMenu: HTMLElement = document.createElement('div');
        contextMenu.className = 'subject-context-menu subject-menu';
        
        const actions = [
            { text: 'Изменить', handler: this.openEditMenu.bind(this) },
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
                <p>Команда: </p>
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