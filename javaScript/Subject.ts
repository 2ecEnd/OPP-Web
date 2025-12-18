import type { Task } from "./Task";

export class Subject{

    public id: string;
    public name: string;
    public tasks: Task[];
    public teamId: string | null;

    constructor(id: string | null = null, name: string, tasks: Task[] = [], teamId: string | null){
        this.id = id ?? crypto.randomUUID();
        this.tasks = tasks;
        this.name = name;
        this.teamId = teamId;
    }
}