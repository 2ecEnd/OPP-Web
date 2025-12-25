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
}
//# sourceMappingURL=TeamMember.js.map