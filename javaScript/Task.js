class Task{
    constructor(title, description, hasDeadline, deadline, currentDate){
        this.title = title;
        this.description = description;
        this.hasDeadline = hasDeadline;
        this.deadline = hasDeadline ? deadline : "отсутствует";
        this.currentDate = currentDate;
        this.dependsOn = [];
        this.id = crypto.randomUUID();

        this.moreVertButton = null;
        this.changeTaskButton = null;
        this.deleteTaskButton = null;
        this.dependsOnButton = null;
        this.contextMenu = null;

        this.container = null;
        this.titleElement = null;
        this.descriptionElement = null;
        this.createTimeElement = null;
        this.deadlineElement = null;
    }

    openContextMenu(){
        this.moreVertButton.classList.toggle('active');
        this.contextMenu.classList.toggle('active');
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

        changeTaskButton.innerHTML = 'Изменить';
        deleteTaskButton.innerHTML = 'Удалить';
        dependsOnButton.innerHTML = 'Добавить зависимость';

        contextMenu.className = 'task-context-menu';
        contextMenu.appendChild(changeTaskButton);
        contextMenu.appendChild(deleteTaskButton);
        contextMenu.appendChild(dependsOnButton);

        this.contextMenu = contextMenu;
        this.changeTaskButton = changeTaskButton;
        this.deleteTaskButton = deleteTaskButton;
        this.dependsOnButton = dependsOnButton;

        this.changeTaskButton.addEventListener('click', this.openEditMenu.bind(this));
        this.deleteTaskButton.addEventListener('click', this.deleteTask.bind(this));
        this.dependsOnButton.addEventListener('click', this.startLinking.bind(this));
    }

    createTask(){
        const newTask = document.createElement('div');
        this.container = newTask;

        this.createOpenContextButton();
        this.createContextMenu();

        newTask.className = 'draggable task';
        newTask.style.left = 0 + 'px';
        newTask.style.top = 0 + 'px';
        newTask.id = this.id;
        newTask.innerHTML = `
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
                <p>Дедлайн: ${this.deadline}</p>
            </div>
        `;

        newTask.appendChild(this.moreVertButton);
        newTask.appendChild(this.contextMenu);

        this.titleElement = newTask.querySelector('.title p');
        this.descriptionElement = newTask.querySelector('.description p');
        this.createTimeElement = newTask.querySelector('.create-time p');
        this.deadlineElement = newTask.querySelector('.dead-line p');

        return newTask;
    }

    changeTask(title, description, hasDeadline, deadline){
        this.title = title;
        this.description = description;
        this.deadline = deadline;

        this.titleElement.textContent = title;
        this.descriptionElement.textContent = description;
        this.deadlineElement.textContent = `Дедлайн: ${deadline}`;

        this.openContextMenu();
    }

    deleteTask(){
        this.container.remove();
    }
}