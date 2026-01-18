import type { Canvas } from "./Canvas/Canvas.js";
import { DOMService } from "./Services/DOMService.js";
import { Task } from "./Task.js";
import { TaskView } from "./TaskView.js";

export class AddTaskMenu{
    private container: HTMLElement;
    private closeMenuButton: HTMLElement;
    private form: HTMLElement;
    private checkbox: HTMLElement;
    private deadlineContainer: HTMLElement;
    private overlay: HTMLElement;
    private formSubmitButton: HTMLElement;
    private canvas: Canvas;

    private type: string;
    private title: string | null;
    private description: string | null;
    private hasDeadline: boolean | null;
    private deadline: Date | null;
    private changeTaskAction: (title: string, description: string, hasDeadline: boolean, deadline: Date | null) => void

    constructor(canvas: Canvas){
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
        this.changeTaskAction = () => {};

        this.init();
    }

    init(): void{
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.closeMenuButton.addEventListener('click', this.closeSelf.bind(this));
        this.checkbox.addEventListener('change', this.toggleDeadlineInput.bind(this));
    }

    handleSubmit(event: Event): void{
        event.preventDefault();

        const title: string = DOMService.getElementById<HTMLInputElement>('formTitleInput').value;
        const description: string = DOMService.getElementById<HTMLInputElement>('formDescriptionInput').value;
        const hasDeadline: boolean = DOMService.getElementById<HTMLInputElement>('formDeadLineCheck').checked;
        const deadline: string = DOMService.getElementById<HTMLInputElement>('formDeadLineInput').value;

        if(this.type === "create") 
            this.createTask(title, description, hasDeadline, deadline == "" ? null : new Date(deadline), new Date());
        else if(this.type === "edit") 
            this.changeTask(title, description, hasDeadline, deadline == "" ? null : new Date(deadline));

        this.clearForm();
        this.formSubmitButton.innerHTML = "Добавить";

        this.closeSelf();
    }

    toggleDeadlineInput(): void{
        this.deadlineContainer.classList.toggle('disabled');

        const input: HTMLInputElement = DOMService.querySelector<HTMLInputElement>(this.deadlineContainer, 'input');
        input.disabled = !input.disabled;
    }

    createTask(title: string, description: string, hasDeadline: boolean, deadline: Date | null, currentDate: Date): void{
        const newTask: Task = new Task(null, title, description, hasDeadline, deadline, currentDate, 2500, 2500, [], []);
        const newTaskView = new TaskView(newTask);

        this.canvas.subject.addTask(newTask);
        this.canvas.taskViews.push(newTaskView);
        this.canvas.canvas.appendChild(newTaskView.createDom());
    }

    changeTask(title: string, description: string, hasDeadline: boolean, deadline: Date | null){
        this.changeTaskAction(title, description, hasDeadline, deadline);
    }

    showSelfToCreate(): void{
        this.container.classList.add('active');
        this.overlay.classList.add('active');

        this.type = "create";
    }

    showSelf(
        type: string,
        title: string,
        description: string,
        hasDeadline: boolean,
        deadline: Date | null,
        changeTaskAction: (title: string, description: string, hasDeadline: boolean, deadline: Date | null) => void
    ): void{
        this.container.classList.add('active');
        this.overlay.classList.add('active');

        this.type = type;
        this.title = title;
        this.description = description;
        this.hasDeadline = hasDeadline;
        this.deadline = deadline;
        this.changeTaskAction = changeTaskAction;

        if(this.type === "edit") this.fillTheForm();
    }

    fillTheForm(): void{
        const title: HTMLInputElement = DOMService.getElementById<HTMLInputElement>('formTitleInput');
        const description: HTMLInputElement = DOMService.getElementById<HTMLInputElement>('formDescriptionInput');
        const hasDeadline: HTMLInputElement = DOMService.getElementById<HTMLInputElement>('formDeadLineCheck');
        const deadline: HTMLInputElement = DOMService.getElementById<HTMLInputElement>('formDeadLineInput');

        title.value = this.title!;
        description.value = this.description!;
        hasDeadline.checked = this.hasDeadline!;
        hasDeadline.dispatchEvent(new Event('change'));
        this.hasDeadline ? this.deadlineContainer.classList.remove('disabled') : this.deadlineContainer.classList.add('disabled');
        deadline.value = this.deadline == null ? "" : this.deadline.toString();
        deadline.disabled = !this.hasDeadline;

        this.formSubmitButton.innerHTML = "Изменить";
    }

    clearForm(){
        const title: HTMLInputElement = DOMService.getElementById<HTMLInputElement>('formTitleInput');
        const description: HTMLInputElement = DOMService.getElementById<HTMLInputElement>('formDescriptionInput');
        const hasDeadline: HTMLInputElement = DOMService.getElementById<HTMLInputElement>('formDeadLineCheck');
        const deadline: HTMLInputElement = DOMService.getElementById<HTMLInputElement>('formDeadLineInput');

        title.value = '';
        description.value = '';
        hasDeadline.checked = false;
        hasDeadline.dispatchEvent(new Event('change'));
        deadline.value = '';
        deadline.disabled = true;
        this.deadlineContainer.classList.add('disabled')
    }

    closeSelf(){
        this.container.classList.remove('active');
        this.overlay.classList.remove('active');
    }
}