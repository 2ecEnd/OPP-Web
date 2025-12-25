import { TeamMember } from "./TeamMember";
import { Task } from "./Task";
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