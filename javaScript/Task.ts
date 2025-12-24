import { AssignedTask } from "./AssignedTask";
import { Status } from './Enum/Enums';
import { addTaskMenu, canvas } from "./InitEditor";

export class Task{

    public id: string;
    public title: string;
    public description: string;
    public hasDeadline: boolean;
    public deadline: Date | string;
    public currentDate: Date;
    public dependsOn: string[];
    public assignedTasks: string[]; // idшники людей, ответственных за эту задачу
    public status: Status;
    public view: TaskView;

    constructor(
        id: string | null = null,
        title: string,
        description: string,
        hasDeadline: boolean,
        deadline: Date | string = "отсутствует",
        currentDate: Date,
        x: number,
        y: number,
        dependsOn: string[] = [],
        assignedTasks: string[] = [],
        status: Status = Status.NOT_ACCEPTED
    ) 
    {
        this.title = title;
        this.description = description;
        this.hasDeadline = hasDeadline;
        this.deadline = hasDeadline ? deadline : "отсутствует";
        this.currentDate = currentDate;
        this.dependsOn = dependsOn;
        this.assignedTasks = assignedTasks;
        this.id = id ?? crypto.randomUUID();
        this.status = status;
        this.view = new TaskView(x, y, this);
    }

    setStatus(status: Status): void{
        this.status = status;
        this.view.changeStatusView(status);
    }

    changeTask(title: string, description: string, hasDeadline: boolean, deadline: Date | string): void{
        this.title = title;
        this.description = description;
        this.deadline = deadline;
        this.view.changeDataView();
    }

    addDependency(task: Task): void{
        this.dependsOn.push(task.id);
    }

    addAssignedTask(assignedTask: string): void{
        this.assignedTasks.push(assignedTask);
    }

    deleteTask(): void{
        this.view.deleteView();
        canvas.subject.deleteTask(this.id);
    }
}






class TaskView{
    public x: number;
    public y: number;
    public container: HTMLElement = document.createElement('div');
    private model: Task;

    constructor(x: number, y: number, model: Task){
        this.x = x;
        this.y = y;
        this.model = model;
    }

    changeStatusView(status: Status): void{
        const indicator: HTMLElement = this.container.querySelector('.status-indicator')!;

        switch (status){
            case Status.DONE:
                indicator.style.backgroundColor = 'green';
                break;
            case Status.IN_PROGRESS:
                indicator.style.backgroundColor = 'orange';
                break;
            case Status.NOT_ACCEPTED:
                indicator.style.backgroundColor = 'firebrick';
                break;
        }

        this.closeAllMenus();
    }

    changeDataView(): void {
        this.container.querySelector('.title p')!.textContent = this.model.title;
        this.container.querySelector('.description p')!.textContent = this.model.description;
        this.container.querySelector('.dead-line p')!.textContent = 
            `Дедлайн: ${this.model.deadline?.toString().replace('T', ' ')}`;

        this.closeAllMenus();
    }

    openContextMenu(): void {
        const moreVertButton: HTMLElement | null = this.container.querySelector('.more-vert-button');
        const contextMenu: HTMLElement | null = this.container.querySelector('.task-context-menu');
        const statusMenu: HTMLElement | null = this.container.querySelector('.task-status-menu');
        const responsibleMenu: HTMLElement | null = this.container.querySelector('.task-responsible-menu');
        
        moreVertButton!.classList.toggle('active');
        contextMenu!.classList.toggle('active');
        statusMenu!.classList.remove('active');
        responsibleMenu!.classList.remove('active');
    }

    openStatusMenu(): void {
        this.closeAllMenus()
        this.openContextMenu()
        const statusMenu: HTMLElement | null = this.container.querySelector('.task-status-menu');
        statusMenu!.classList.toggle('active');
    }

    openResponsibleMenu(): void {
        this.closeAllMenus()
        this.openContextMenu()
        const responsibleMenu: HTMLElement | null = this.container.querySelector('.task-responsible-menu');
        responsibleMenu!.classList.toggle('active');
    }

    closeAllMenus(): void {
        const statusMenu: HTMLElement | null = this.container?.querySelector('.task-status-menu');
        const contextMenu: HTMLElement | null = this.container?.querySelector('.task-context-menu');
        const responsibleMenu: HTMLElement | null = this.container?.querySelector('.task-responsible-menu');
        
        statusMenu?.classList.remove('active');
        contextMenu?.classList.remove('active');
        responsibleMenu?.classList.remove('active');
        
        const moreVertButton: HTMLElement | null = this.container?.querySelector('.more-vert-button');
        moreVertButton?.classList.remove('active');
    }

    openEditMenu(): void{
        addTaskMenu.showSelf("edit", this.model);
    }

    startLinking(): void {
        this.closeAllMenus();
        canvas.linkController.startLinking(this.model);
    }

    enableDeletingLinksMode(): void {
        this.closeAllMenus();
        canvas.linkController.enableDeletingLinksMode(this.model);
    }

    createContextMenu(): HTMLElement {
        const contextMenu: HTMLElement | null = document.createElement('div');
        contextMenu.className = 'task-context-menu task-menu';
        
        const actions = [
            { text: 'Изменить', handler: this.openEditMenu.bind(this) },
            { text: 'Удалить', handler: this.model.deleteTask.bind(this) },
            { text: 'Добавить зависимость', handler: this.startLinking.bind(this) },
            { text: 'Удалить зависимость', handler: this.enableDeletingLinksMode.bind(this) },
            { text: 'Изменить статус', handler: this.openStatusMenu.bind(this) },
            { text: 'Добавить ответственного', handler: this.openResponsibleMenu.bind(this) }
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

    createStatusMenu(): HTMLElement {
        const statuses = [
            { text: 'Выполнено', value: Status.DONE },
            { text: 'В процессе', value: Status.IN_PROGRESS },
            { text: 'Не принято', value: Status.NOT_ACCEPTED }
        ];

        const statusMenu = document.createElement('div');
        statusMenu.classList.add('task-status-menu', 'task-menu');

        statuses.forEach(({ text, value }) => {
            const button = document.createElement('button');
            button.textContent = text;
            button.addEventListener('click', () => this.model.setStatus(value));
            statusMenu.appendChild(button);
        });

        return statusMenu;
    }

    createResponsibleMenu(): HTMLElement {
        const responsibleMenu = document.createElement('div');
        responsibleMenu.className = 'task-responsible-menu task-menu';

        

        const availablePeople = [
            { id: 1, name: 'Иван Иванов' },
            { id: 2, name: 'Мария Петрова' },
            { id: 3, name: 'Алексей Сидоров' },
            { id: 4, name: 'Елена Кузнецова' },
            { id: 5, name: 'Дмитрий Волков' }
        ];

        const select: HTMLSelectElement = document.createElement('select');
        select.className = 'responsible-select';
        select.name = 'select';

        const defaultOption: HTMLOptionElement = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Выберите ответственного';
        defaultOption.selected = true;
        select.appendChild(defaultOption);

        availablePeople.forEach(person => {
            const option = document.createElement('option');
            option.value = person.id.toString();
            option.textContent = person.name;
            option.dataset.personName = person.name;
            select.appendChild(option);
        });

        select.addEventListener('mousedown', (e) => {
            e.stopPropagation();
        });

        select.addEventListener('change', (e) => {
            if (select.value) {
                const selectedOption = select.options[select.selectedIndex];
                const selectedPerson = availablePeople.find(p => p.id.toString() == select.value);
                
                const assignedPersonBlock = this.container.querySelector('.assigned-person p');
                if (assignedPersonBlock) {
                    assignedPersonBlock.textContent = `Ответственный: ${selectedPerson!.name}`;
                }
            }
        });

        responsibleMenu.appendChild(select);
        return responsibleMenu;
    }

    createDom(): HTMLElement {
        const newTask: HTMLElement = document.createElement('div');
        this.container = newTask;

        newTask.className = 'draggable task';
        newTask.id = this.model.id;
        newTask.innerHTML = `
            <div class="status-indicator"></div>
            <div class="title task-block">
                <p>${this.model.title}</p>
            </div>
            <div class="description task-block">
                <p>${this.model.description}</p>
            </div>
            <div class="create-time task-block">
                <p>Дата добавления: ${this.model.currentDate.toLocaleDateString('ru-RU')}</p>
            </div>
            <div class="assigned-person task-block">
                <p>Ответственный: ${""}
                </p>
            </div>
            <div class="dead-line task-block">
                <p>Дедлайн: ${this.model.deadline.toString().replace('T', ' ')}</p>
            </div>
            <div class="more-vert-button">
                <img src="images/More vertical.svg" alt="">
            </div>
        `;

        newTask.appendChild(this.createContextMenu());
        newTask.appendChild(this.createStatusMenu());
        newTask.appendChild(this.createResponsibleMenu());

        newTask.querySelector('.more-vert-button')!.addEventListener('click', 
            this.openContextMenu.bind(this));

        this.container.style.transform = `
            translate(${this.x}px, ${this.y}px)
        `;
        this.container.dataset.x = this.x.toString();
        this.container.dataset.y = this.y.toString();

        this.model.setStatus(Status.NOT_ACCEPTED)

        return newTask;
    }

    deleteView(){
        this.container.remove();
    }
}