import { Status } from './Enum/Enums.js';

export class Task{

    public id: string;
    public title: string;
    public description: string;
    public hasDeadline: boolean;
    public deadline: Date | null;
    public currentDate: Date;
    public dependsOn: string[];
    public assignedTasks: string[]; // idшники людей, ответственных за эту задачу
    public status: Status;
    public x: number;
    public y: number;

    constructor(
        id: string | null = null,
        title: string,
        description: string,
        hasDeadline: boolean,
        deadline: Date | null,
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
        this.deadline = deadline;
        this.currentDate = currentDate;
        this.dependsOn = dependsOn;
        this.assignedTasks = assignedTasks;
        this.id = id ?? crypto.randomUUID();
        this.status = status;
        this.x = x;
        this.y = y;
    }

    setStatus(status: Status): void{
        this.status = status;
    }

    changeTask(title: string, description: string, hasDeadline: boolean, deadline: Date | null): void{
        this.title = title;
        this.description = description;
        this.deadline = deadline;
    }

    addDependency(task: Task): void{
        this.dependsOn.push(task.id);
    }

    addAssignedTask(assignedTask: string): void{
        this.assignedTasks.push(assignedTask);
    }

    deleteAssignedTask(assignedTask: string): void{
        for(let i = 0; i < this.assignedTasks.length; ++i){
            if(this.assignedTasks[i] == assignedTask){
                this.assignedTasks.splice(i, 1);
                break;
            }
        }
    }

    deleteDependency(task: Task): void{
        for(let i = 0; i < this.dependsOn.length; ++i){
            if(this.dependsOn[i] == task.id){
                this.dependsOn.splice(i, 1);
                break;
            }
        }
    }

    deleteTask(): void{
    }
}