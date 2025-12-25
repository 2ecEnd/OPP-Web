import { TeamMember } from "./TeamMember.js";
import { Task } from "./Task.js";
export class AssignedTask {
    task;
    teamMember;
    id;
    constructor(task, teamMember) {
        this.task = task;
        this.teamMember = teamMember;
        this.id = crypto.randomUUID();
    }
}
//# sourceMappingURL=AssignedTask.js.map