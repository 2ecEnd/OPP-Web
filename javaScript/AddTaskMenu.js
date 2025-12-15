class AddTaskMenu{
    constructor(){
        this.container = document.getElementById('add-task-context-menu');
        this.closeMenuButton = document.getElementById('close-context-menu-button');
        this.form = document.getElementById('add-task-form');
        this.checkbox = document.getElementById('formDeadLineCheck');
        this.deadlineContainer = document.getElementById('deadline-container');
        this.overlay = document.getElementById('overlay');
        this.formSubmitButton = document.getElementById('formSubmitButton');
        this.canvas = canvas;

        this.type = "";
        this.currentTask = null;

        this.init();
    }

    init(){
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.closeMenuButton.addEventListener('click', this.closeSelf.bind(this));
        this.checkbox.addEventListener('change', this.toggleDeadlineInput.bind(this));
    }

    handleSubmit(event){
        event.preventDefault();

        const title = document.getElementById('formTitleInput').value;
        const description = document.getElementById('formDescriptionInput').value;
        const hasDeadline = document.getElementById('formDeadLineCheck').checked;
        const deadline = document.getElementById('formDeadLineInput').value;

        if(this.type === "create") this.createTask(title, description, hasDeadline, deadline, new Date());
        else if(this.type === "edit") this.changeTask(this.currentTask, title, description, hasDeadline, deadline);

        this.clearForm();
        this.formSubmitButton.innerHTML = "Добавить";

        this.closeSelf();
    }

    toggleDeadlineInput(){
        this.deadlineContainer.classList.toggle('disabled');

        const input = this.deadlineContainer.querySelector('input');
        input.disabled = !input.disabled;
    }

    createTask(title, description, hasDeadline, deadline, currentDate){
        const newTask = new Task(null, title, description, hasDeadline, deadline, currentDate, 2500, 2500, [], []);

        canvas.subject.addTask(newTask);
        canvas.canvas.appendChild(newTask.createDom());
    }

    changeTask(task, title, description, hasDeadline, deadline){
        task.changeTask(title, description, hasDeadline, deadline);
    }

    showSelf(type, currentTask){
        this.container.classList.add('active');
        this.overlay.classList.add('active');

        this.type = type;
        this.currentTask = currentTask;

        if(this.type === "edit") this.fillTheForm();
    }

    fillTheForm(){
        const title = document.getElementById('formTitleInput');
        const description = document.getElementById('formDescriptionInput');
        const hasDeadline = document.getElementById('formDeadLineCheck');
        const deadline = document.getElementById('formDeadLineInput');

        title.value = this.currentTask.title;
        description.value = this.currentTask.description;
        hasDeadline.checked = this.currentTask.hasDeadline;
        hasDeadline.dispatchEvent(new Event('change'));
        this.currentTask.hasDeadline ? this.deadlineContainer.classList.remove('disabled') : this.deadlineContainer.classList.add('disabled');
        deadline.value = this.currentTask.deadline;
        deadline.disabled = !this.currentTask.hasDeadline;

        this.formSubmitButton.innerHTML = "Изменить";
    }

    clearForm(){
        const title = document.getElementById('formTitleInput');
        const description = document.getElementById('formDescriptionInput');
        const hasDeadline = document.getElementById('formDeadLineCheck');
        const deadline = document.getElementById('formDeadLineInput');

        title.value = null;
        description.value = null;
        hasDeadline.checked = false;
        hasDeadline.dispatchEvent(new Event('change'));
        deadline.value = null;
        deadline.disabled = true;
        this.deadlineContainer.classList.add('disabled')
    }

    closeSelf(){
        this.container.classList.remove('active');
        this.overlay.classList.remove('active');
    }
}

var addTaskMenu = null;