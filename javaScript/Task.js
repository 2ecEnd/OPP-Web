const Status = Object.freeze({
    DONE: 'Выполнено',
    IN_PROGRESS: 'В процессе',
    NOT_ACCEPTED: 'Не принято'
});

class Task{
    constructor(id, title, description, hasDeadline, deadline, currentDate, x, y, dependsOn, assignedTasks) {
        this.title = title;
        this.description = description;
        this.hasDeadline = hasDeadline;
        this.deadline = hasDeadline ? deadline : "отсутствует";
        this.currentDate = currentDate;
        this.dependsOn = dependsOn;
        this.assignedTasks = assignedTasks;
        this.id = id == null? crypto.randomUUID() : id;
        this.status = Status.NOT_ACCEPTED;
        this.x = x;
        this.y = y;

        this.container = null;
    }

    openContextMenu() {
        const moreVertButton = this.container.querySelector('.more-vert-button');
        const contextMenu = this.container.querySelector('.task-context-menu');
        const statusMenu = this.container.querySelector('.task-status-menu');
        const responsibleMenu = this.container.querySelector('.task-responsible-menu');
        
        moreVertButton.classList.toggle('active');
        contextMenu.classList.toggle('active');
        statusMenu.classList.remove('active');
        responsibleMenu.classList.remove('active');
    }

    openStatusMenu() {
        this.closeAllMenus()
        this.openContextMenu()
        const statusMenu = this.container.querySelector('.task-status-menu');
        statusMenu.classList.toggle('active');
    }

    openResponsibleMenu(){
        this.closeAllMenus()
        this.openContextMenu()
        const responsibleMenu = this.container.querySelector('.task-responsible-menu');
        responsibleMenu.classList.toggle('active');
    }

    closeAllMenus() {
        const statusMenu = this.container?.querySelector('.task-status-menu');
        const contextMenu = this.container?.querySelector('.task-context-menu');
        const responsibleMenu = this.container?.querySelector('.task-responsible-menu');
        
        statusMenu?.classList.remove('active');
        contextMenu?.classList.remove('active');
        responsibleMenu?.classList.remove('active');
        
        const moreVertButton = this.container?.querySelector('.more-vert-button');
        moreVertButton?.classList.remove('active');
    }

    openEditMenu(){
        addTaskMenu.showSelf("edit", this);
    }

    startLinking() {
        this.openContextMenu();
        canvas.startLinking(this);
    }

    createContextMenu() {
        const contextMenu = document.createElement('div');
        contextMenu.className = 'task-context-menu task-menu';
        
        const actions = [
            { text: 'Изменить', handler: this.openEditMenu.bind(this) },
            { text: 'Удалить', handler: this.deleteTask.bind(this) },
            { text: 'Добавить зависимость', handler: this.startLinking.bind(this) },
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

    createStatusMenu() {
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
            button.addEventListener('click', () => this.setStatus(value));
            statusMenu.appendChild(button);
        });

        return statusMenu;
    }

    createResponsibleMenu(){
        const responsibleMenu = document.createElement('div');
        responsibleMenu.className = 'task-responsible-menu task-menu';

        const availablePeople = [
            { id: 1, name: 'Иван Иванов' },
            { id: 2, name: 'Мария Петрова' },
            { id: 3, name: 'Алексей Сидоров' },
            { id: 4, name: 'Елена Кузнецова' },
            { id: 5, name: 'Дмитрий Волков' }
        ];

        const select = document.createElement('select');
        select.className = 'responsible-select';
        select.name = 'select';

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Выберите ответственного';
        defaultOption.selected = true;
        select.appendChild(defaultOption);

        availablePeople.forEach(person => {
            const option = document.createElement('option');
            option.value = person.id;
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
                const selectedPerson = availablePeople.find(p => p.id == select.value);
                
                const assignedPersonBlock = this.container.querySelector('.assigned-person p');
                if (assignedPersonBlock) {
                    assignedPersonBlock.textContent = `Ответственный: ${selectedPerson.name}`;
                }
            }
        });

        responsibleMenu.appendChild(select);
        return responsibleMenu;
    }

    createDom(){
        const newTask = document.createElement('div');
        this.container = newTask;

        newTask.className = 'draggable task';
        newTask.id = this.id;
        newTask.innerHTML = `
            <div class="status-indicator"></div>
            <div class="title task-block">
                <p>${this.title}</p>
            </div>
            <div class="description task-block">
                <p>${this.description}</p>
            </div>
            <div class="create-time task-block">
                <p>Дата добавления: ${this.currentDate.toISOString()}</p>
            </div>
            <div class="assigned-person task-block">
                <p>Ответственный: ${this.assignedTasks.length > 0 
                    ? this.assignedTasks[0].teamMember.surname + this.assignedTasks[0].teamMember.name 
                    : "нет"}
                </p>
            </div>
            <div class="dead-line task-block">
                <p>Дедлайн: ${this.deadline.replace('T', ' ')}</p>
            </div>
            <div class="more-vert-button">
                <img src="images/More vertical.svg" alt="">
            </div>
        `;

        newTask.appendChild(this.createContextMenu());
        newTask.appendChild(this.createStatusMenu());
        newTask.appendChild(this.createResponsibleMenu());

        newTask.querySelector('.more-vert-button').addEventListener('click', 
            this.openContextMenu.bind(this));

        this.container.style.transform = `
            translate(${this.x}px, ${this.y}px)
        `;
        this.container.dataset.x = this.x;
        this.container.dataset.y = this.y;

        this.setStatus(Status.NOT_ACCEPTED)

        return newTask;
    }

    setStatus(status){
        this.status = status;
        const indicator = this.container.querySelector('.status-indicator');

        switch (this.status){
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

    changeTask(title, description, hasDeadline, deadline){
        this.title = title;
        this.description = description;
        this.deadline = deadline;

        this.container.querySelector('.title p').textContent = title;
        this.container.querySelector('.description p').textContent = description;
        this.container.querySelector('.dead-line p').textContent = 
            `Дедлайн: ${deadline.replace('T', ' ')}`;

        this.closeAllMenus();
    }

    addDependency(task){
        this.dependsOn.push(task);
    }

    addAssignedTask(assignedTask){
        this.assignedTasks.push(assignedTask);
    }

    deleteTask(){
        this.container.remove();
        canvas.subject.deleteTask(this.id);
    }
}


class TaskView{

}