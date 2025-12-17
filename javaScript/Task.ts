import { AssignedTask } from "./AssignedTask";

export enum Status {
  DONE = 'Выполнено',
  IN_PROGRESS = 'В процессе',
  NOT_ACCEPTED = 'Не принято'
}

export class Task{

    public id: string;
    public title: string;
    public description: string;
    public hasDeadline: boolean;
    public deadline: Date | string;
    public currentDate: Date;
    public dependsOn: string[];
    public assignedTasks: AssignedTask[];
    public status: Status;
    public x: number;
    public y: number;
    public container: HTMLElement | null;

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
        assignedTasks: AssignedTask[] = [],
        status: Status = Status.NOT_ACCEPTED
) {
        this.title = title;
        this.description = description;
        this.hasDeadline = hasDeadline;
        this.deadline = hasDeadline ? deadline : "отсутствует";
        this.currentDate = currentDate;
        this.dependsOn = dependsOn;
        this.assignedTasks = assignedTasks;
        this.id = id ?? crypto.randomUUID();
        this.status = status;
        this.x = x;
        this.y = y;

        this.container = null;
    }
}