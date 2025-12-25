import { Status } from './Enum/Enums.js';
//import { addTaskMenu, canvas } from "./InitEditor.js";
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
    //public view: TaskView;
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
        //this.view = new TaskView(x, y, this);
        this.x = x;
        this.y = y;
    }
    setStatus(status) {
        this.status = status;
        //this.view.changeStatusView(status);
    }
    changeTask(title, description, hasDeadline, deadline) {
        this.title = title;
        this.description = description;
        this.deadline = deadline;
        //this.view.changeDataView();
    }
    addDependency(task) {
        this.dependsOn.push(task.id);
    }
    addAssignedTask(assignedTask) {
        this.assignedTasks.push(assignedTask);
    }
    deleteTask() {
        //this.view.deleteView();
        //canvas.subject.deleteTask(this.id);
    }
}
//# sourceMappingURL=Task.js.map