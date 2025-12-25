import { Status } from './Enum/Enums.js';
//import { addTaskMenu, canvas } from "./InitEditor.js";

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
    //public view: TaskView;
    public x: number;
    public y: number;

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
        //this.view = new TaskView(x, y, this);
        this.x = x;
        this.y = y;
    }

    setStatus(status: Status): void{
        this.status = status;
        //this.view.changeStatusView(status);
    }

    changeTask(title: string, description: string, hasDeadline: boolean, deadline: Date | string): void{
        this.title = title;
        this.description = description;
        this.deadline = deadline;
        //this.view.changeDataView();
    }

    addDependency(task: Task): void{
        this.dependsOn.push(task.id);
    }

    addAssignedTask(assignedTask: string): void{
        this.assignedTasks.push(assignedTask);
    }

    deleteTask(): void{
        //this.view.deleteView();
        //canvas.subject.deleteTask(this.id);
    }
}