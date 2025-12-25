import { addSubjectMenu } from "./AddSubjectMenu";
import type { LinkData } from "./Canvas/LinkController";
import { canvas } from "./InitEditor";
import type { Task } from "./Task";
import { user } from "./User";

export class Subject{

    public id: string;
    public name: string;
    public tasks: Task[];
    public teamId: string | null;
    private view: SubjectView;

    constructor(id: string | null = null, name: string, tasks: Task[] = [], teamId: string | null){
        this.id = id ?? crypto.randomUUID();
        this.tasks = tasks;
        this.name = name;
        this.teamId = teamId;
        this.view = new SubjectView(this);
    }

    changeData(): void{
        user.subjectsService.changeSubjectData(this.id, this);
    }

    addTask(task: Task): void{
        this.tasks.push(task);
        this.changeData();
    }

    deleteTask(id: string): void{
        const taskToDelete: Task = this.tasks.find(task => task.id === id)!;
        canvas.linkController.links.forEach((link: LinkData) => {
            if (link.startTask === taskToDelete || link.endTask === taskToDelete){
                link.line.remove();
            }
        });

        canvas.linkController.links = canvas.linkController.links.filter((link: LinkData) => 
            link.startTask !== taskToDelete && link.endTask !== taskToDelete
        );

        this.tasks = this.tasks.filter(task => task.id !== id);

        this.tasks.forEach(task => {
            task.dependsOn.filter((t: string) => id !== taskToDelete.id);
        });

        user.subjectsService.changeSubjectData(this.id, this);
    }

    changeSubject(newName: string): void{
        user.subjectsService.changeSubject(this.id, newName);
        this.name = newName;
        this.view.updateView();
    }

    deleteSubject(e: Event): void{
        e.stopPropagation();

        this.view.container.remove();
        user.subjectsService.removeSubject(this.id);
    }

    getTask(id: string): Task | undefined{
        return this.tasks.find(task => task.id === id);
    }

    getView(): SubjectView{
        return this.view;
    }
}

class SubjectView{
    private model: Subject;
    public container: HTMLElement;

    constructor(model: Subject){
        this.model = model;
        this.container = document.createElement('div');

        this.createView();
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

        addSubjectMenu.showSelf("edit", this.model);
    }

    createContextMenu(): HTMLElement {
        const contextMenu: HTMLElement = document.createElement('div');
        contextMenu.className = 'subject-context-menu subject-menu';
        
        const actions = [
            { text: 'Изменить', handler: this.openEditMenu.bind(this) },
            { text: 'Удалить', handler: this.model.deleteSubject.bind(this.model) }
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

    updateView(): void {
        this.container.querySelector('.subject-info')!.children[0]!.textContent = this.model.name;
    }
}