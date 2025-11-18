class AddTaskContextMenu{
    constructor(){
        this.contextMenu = document.getElementById('add-task-context-menu');
        this.closeContextMenuButton = document.getElementById('close-context-menu-button');
        this.form = document.getElementById('add-task-form');
        this.overlay = document.getElementById('overlay');
        this.canvas = canvas;

        this.init();
    }

    init(){
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.closeContextMenuButton.addEventListener('click', this.showSelf.bind(this));
    }

    handleSubmit(event){
        event.preventDefault();

        const newTask = document.createElement('div');

        const title = document.getElementById('formTitleInput').value;
        const description = document.getElementById('formDescriptionInput').value;
        const hasDeadline = document.getElementById('formDeadLineCheck').checked;
        const deadline = document.getElementById('formDeadLineInput').value;
        const currentDate = new Date().toLocaleDateString('ru-RU');

        newTask.className = 'draggable task';
        newTask.style.left = 0 + 'px';
        newTask.style.top = 0 + 'px';
        newTask.id = crypto.randomUUID();
        newTask.innerHTML = `
            <div class="title task-block">
                <p>${title}</p>
            </div>
            <div class="description task-block">
                <p>${description}</p>
            </div>
            <div class="create-time task-block">
                <p>Дата добавления: ${currentDate}</p>
            </div>
            <div class="assigned-person task-block">
                <p>Ответственный: name</p>
            </div>
            <div class="dead-line task-block">
                <p>Дедлайн: ${deadline}</p>
            </div>
        `;

        this.canvas.canvas.appendChild(newTask);

        this.form.reset();
        this.showSelf();
    }

    showSelf(){
        this.contextMenu.classList.toggle('active');
        this.overlay.classList.toggle('active');
    }
}