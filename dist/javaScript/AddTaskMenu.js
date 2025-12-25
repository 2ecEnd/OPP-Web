import { DOMService } from "./Services/DOMService.js";
import { Task } from "./Task.js";
import { TaskView } from "./TaskView.js";
export class AddTaskMenu {
    container;
    closeMenuButton;
    form;
    checkbox;
    deadlineContainer;
    overlay;
    formSubmitButton;
    canvas;
    type;
    title;
    description;
    hasDeadline;
    deadline;
    changeTaskAction;
    constructor(canvas) {
        this.container = DOMService.getElementById('add-task-context-menu');
        this.closeMenuButton = DOMService.getElementById('close-context-menu-button');
        this.form = DOMService.getElementById('add-task-form');
        this.checkbox = DOMService.getElementById('formDeadLineCheck');
        this.deadlineContainer = DOMService.getElementById('deadline-container');
        this.overlay = DOMService.getElementById('overlay');
        this.formSubmitButton = DOMService.getElementById('formSubmitButton');
        this.canvas = canvas;
        this.type = "";
        this.title = null;
        this.description = null;
        this.hasDeadline = null;
        this.deadline = null;
        this.changeTaskAction = () => { };
        this.init();
    }
    init() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.closeMenuButton.addEventListener('click', this.closeSelf.bind(this));
        this.checkbox.addEventListener('change', this.toggleDeadlineInput.bind(this));
    }
    handleSubmit(event) {
        event.preventDefault();
        const title = DOMService.getElementById('formTitleInput').value;
        const description = DOMService.getElementById('formDescriptionInput').value;
        const hasDeadline = DOMService.getElementById('formDeadLineCheck').checked;
        const deadline = DOMService.getElementById('formDeadLineInput').value;
        if (this.type === "create")
            this.createTask(title, description, hasDeadline, deadline, new Date());
        else if (this.type === "edit")
            this.changeTask(title, description, hasDeadline, deadline);
        this.clearForm();
        this.formSubmitButton.innerHTML = "Добавить";
        this.closeSelf();
    }
    toggleDeadlineInput() {
        this.deadlineContainer.classList.toggle('disabled');
        const input = DOMService.querySelector(this.deadlineContainer, 'input');
        input.disabled = !input.disabled;
    }
    createTask(title, description, hasDeadline, deadline, currentDate) {
        const newTask = new Task(null, title, description, hasDeadline, deadline, currentDate, 2500, 2500, [], []);
        const newTaskView = new TaskView(newTask);
        this.canvas.subject.addTask(newTask);
        this.canvas.taskViews.push(newTaskView);
        this.canvas.canvas.appendChild(newTaskView.createDom());
    }
    changeTask(title, description, hasDeadline, deadline) {
        this.changeTaskAction(title, description, hasDeadline, deadline);
    }
    showSelfToCreate() {
        this.container.classList.add('active');
        this.overlay.classList.add('active');
        this.type = "create";
    }
    showSelf(type, title, description, hasDeadline, deadline, changeTaskAction) {
        this.container.classList.add('active');
        this.overlay.classList.add('active');
        this.type = type;
        this.title = title;
        this.description = description;
        this.hasDeadline = hasDeadline;
        this.deadline = deadline;
        this.changeTaskAction = changeTaskAction;
        if (this.type === "edit")
            this.fillTheForm();
    }
    fillTheForm() {
        const title = DOMService.getElementById('formTitleInput');
        const description = DOMService.getElementById('formDescriptionInput');
        const hasDeadline = DOMService.getElementById('formDeadLineCheck');
        const deadline = DOMService.getElementById('formDeadLineInput');
        title.value = this.title;
        description.value = this.description;
        hasDeadline.checked = this.hasDeadline;
        hasDeadline.dispatchEvent(new Event('change'));
        this.hasDeadline ? this.deadlineContainer.classList.remove('disabled') : this.deadlineContainer.classList.add('disabled');
        deadline.value = this.deadline.toString();
        deadline.disabled = !this.hasDeadline;
        this.formSubmitButton.innerHTML = "Изменить";
    }
    clearForm() {
        const title = DOMService.getElementById('formTitleInput');
        const description = DOMService.getElementById('formDescriptionInput');
        const hasDeadline = DOMService.getElementById('formDeadLineCheck');
        const deadline = DOMService.getElementById('formDeadLineInput');
        title.value = '';
        description.value = '';
        hasDeadline.checked = false;
        hasDeadline.dispatchEvent(new Event('change'));
        deadline.value = '';
        deadline.disabled = true;
        this.deadlineContainer.classList.add('disabled');
    }
    closeSelf() {
        this.container.classList.remove('active');
        this.overlay.classList.remove('active');
    }
}
//# sourceMappingURL=AddTaskMenu.js.map