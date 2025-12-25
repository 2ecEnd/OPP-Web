import { TeamMember } from "./TeamMember.js";
import { Task } from "./Task.js";

export class AssignedTask {
    task: Task;
    teamMember: TeamMember;
    id: string;

    constructor(task: Task, teamMember: TeamMember) {
        this.task = task;
        this.teamMember = teamMember;
        this.id = crypto.randomUUID();
    }
}