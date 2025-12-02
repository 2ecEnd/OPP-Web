const Status = Object.freeze({
    DONE: 'Выполнено',
    IN_PROGRESS: 'В процессе',
    NOT_ACCEPTED: 'Не принято'
});

class Task{
    constructor(title, description, hasDeadline, deadline, currentDate){
        this.title = title;
        this.description = description;
        this.hasDeadline = hasDeadline;
        this.deadline = hasDeadline ? deadline : "отсутствует";
        this.currentDate = currentDate;
        this.dependsOn = [];
        this.id = crypto.randomUUID();
        this.status = Status.NOT_ACCEPTED;

        this.moreVertButton = null;
        this.changeTaskButton = null;
        this.deleteTaskButton = null;
        this.dependsOnButton = null;
        this.changeStatusButton = null;
        this.contextMenu = null;
        this.statusMenu = null;

        this.container = null;
        this.titleElement = null;
        this.descriptionElement = null;
        this.createTimeElement = null;
        this.deadlineElement = null;
        this.statusIndicator = null;
    }

    openContextMenu(){
        this.moreVertButton.classList.toggle('active');
        this.contextMenu.classList.toggle('active');
        this.statusMenu.classList.remove('active');
    }

    openStatusMenu(){
        this.statusMenu.classList.toggle('active');
    }

    openEditMenu(){
        addTaskMenu.showSelf("edit", this);
        console.log(this);
    }

    startLinking() {
        this.openContextMenu();
        canvas.startLinking(this);
    }

    createOpenContextButton(){
        const openContextButton = document.createElement('div');

        openContextButton.className = 'more-vert-button';
        openContextButton.id = `more-vert-button-${this.id}`;
        openContextButton.innerHTML = '<img src="images/More vertical.svg" alt="">';

        this.moreVertButton = openContextButton;
        this.moreVertButton.addEventListener('click', this.openContextMenu.bind(this));
    }

    createContextMenu(){
        const contextMenu = document.createElement('div');
        const changeTaskButton = document.createElement('button');
        const deleteTaskButton = document.createElement('button');
        const dependsOnButton = document.createElement('button');
        const changeStatusButton = document.createElement('button');

        changeTaskButton.innerHTML = 'Изменить';
        deleteTaskButton.innerHTML = 'Удалить';
        dependsOnButton.innerHTML = 'Добавить зависимость';
        changeStatusButton.innerHTML = 'Изменить статус';

        contextMenu.classList.add('task-context-menu');
        contextMenu.classList.add('task-menu');
        contextMenu.appendChild(changeTaskButton);
        contextMenu.appendChild(deleteTaskButton);
        contextMenu.appendChild(dependsOnButton);
        contextMenu.appendChild(changeStatusButton);

        this.contextMenu = contextMenu;
        this.changeTaskButton = changeTaskButton;
        this.deleteTaskButton = deleteTaskButton;
        this.dependsOnButton = dependsOnButton;
        this.changeStatusButton = changeStatusButton;

        this.changeTaskButton.addEventListener('click', this.openEditMenu.bind(this));
        this.deleteTaskButton.addEventListener('click', this.deleteTask.bind(this));
        this.dependsOnButton.addEventListener('click', this.startLinking.bind(this));
        this.changeStatusButton.addEventListener('click', this.openStatusMenu.bind(this));
    }

    createStatusMenu(){
        const statusMenu = document.createElement('div');
        const statusDoneButton = document.createElement('button');
        const statusInProgressButton = document.createElement('button');
        const statusNotAcceptedButton = document.createElement('button');

        statusDoneButton.innerHTML = 'Выполнено';
        statusInProgressButton.innerHTML = 'В процессе';
        statusNotAcceptedButton.innerHTML = 'Не принято';

        statusMenu.classList.add('task-status-menu');
        statusMenu.classList.add('task-menu');
        statusMenu.appendChild(statusDoneButton);
        statusMenu.appendChild(statusInProgressButton);
        statusMenu.appendChild(statusNotAcceptedButton);

        this.statusMenu = statusMenu;
        statusDoneButton.addEventListener('click', () => { this.setStatus(Status.DONE) });
        statusInProgressButton.addEventListener('click', () => { this.setStatus(Status.IN_PROGRESS) });
        statusNotAcceptedButton.addEventListener('click', () => { this.setStatus(Status.NOT_ACCEPTED) });
    }

    createDom(){
        const newTask = document.createElement('div');
        this.container = newTask;

        this.createOpenContextButton();
        this.createContextMenu();
        this.createStatusMenu()

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
                <p>Дата добавления: ${this.currentDate}</p>
            </div>
            <div class="assigned-person task-block">
                <p>Ответственный: name</p>
            </div>
            <div class="dead-line task-block">
                <p>Дедлайн: ${this.deadline.replace('T', ' ')}</p>
            </div>
        `;

        newTask.appendChild(this.moreVertButton);
        newTask.appendChild(this.contextMenu);
        newTask.appendChild(this.statusMenu);

        this.titleElement = newTask.querySelector('.title p');
        this.descriptionElement = newTask.querySelector('.description p');
        this.createTimeElement = newTask.querySelector('.create-time p');
        this.deadlineElement = newTask.querySelector('.dead-line p');
        this.statusIndicator = newTask.querySelector('.status-indicator');

        this.container.style.transform = `
            translate(${2500}px, ${2500}px)
        `;
        this.container.dataset.x = 2500;
        this.container.dataset.y = 2500;

        this.setStatus(Status.NOT_ACCEPTED)

        return newTask;
    }

    setStatus(status){
        this.status = status;

        switch (this.status){
            case Status.DONE:
                this.statusIndicator.style.backgroundColor = 'green';
                break;
            case Status.IN_PROGRESS:
                this.statusIndicator.style.backgroundColor = 'orange';
                break;
            case Status.NOT_ACCEPTED:
                this.statusIndicator.style.backgroundColor = 'firebrick';
                break;
        }

        this.statusMenu.classList.remove('active');
    }

    changeTask(title, description, hasDeadline, deadline){
        this.title = title;
        this.description = description;
        this.deadline = deadline;

        this.titleElement.textContent = title;
        this.descriptionElement.textContent = description;
        this.deadlineElement.textContent = `Дедлайн: ${deadline.replace('T', ' ')}`;

        this.openContextMenu();
        this.statusMenu.classList.remove('active');
    }

    deleteTask(){
        this.container.remove();
        subjectTest.deleteTask(this.id);
    }
}