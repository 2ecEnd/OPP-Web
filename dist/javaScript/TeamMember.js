export class TeamMember {
    name;
    surname;
    email;
    specialization;
    assignedTasks;
    id;
    constructor(name, surname, email, specialization, assignedTasks = [], id = null) {
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.specialization = specialization;
        this.assignedTasks = assignedTasks;
        this.id = id ?? crypto.randomUUID();
    }
    changeData(name, surname, email, specialization) {
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.specialization = specialization;
    }
    addAssignedTask(assignedTask) {
        this.assignedTasks.push(assignedTask);
    }
    deleteAssignedTask(assignedTask) {
        for (let i = 0; i < this.assignedTasks.length; ++i) {
            if (this.assignedTasks[i] == assignedTask) {
                this.assignedTasks.splice(i, 1);
                break;
            }
        }
    }
}
//# sourceMappingURL=TeamMember.js.map