import { Status } from './Enum/Enums.js';
export class Task {
    id;
    title;
    description;
    hasDeadline;
    deadline;
    currentDate;
    dependsOn;
    assignedTasks; // idшники людей, ответственных за эту задачу
    status;
    x;
    y;
    constructor(id = null, title, description, hasDeadline, deadline = "отсутствует", currentDate, x, y, dependsOn = [], assignedTasks = [], status = Status.NOT_ACCEPTED) {
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
    }
    setStatus(status) {
        this.status = status;
    }
    changeTask(title, description, hasDeadline, deadline) {
        this.title = title;
        this.description = description;
        this.deadline = deadline;
    }
    addDependency(task) {
        this.dependsOn.push(task.id);
    }
    addAssignedTask(assignedTask) {
        this.assignedTasks.push(assignedTask);
    }
    deleteTask() {
    }
}
//# sourceMappingURL=Task.js.map