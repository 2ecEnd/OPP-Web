export class TeamMember {
    name: string;
    surname: string;
    email: string;
    specialization: string;
    assignedTasks: string[];
    id: string;

    constructor(
        name: string,
        surname: string,
        email: string,
        specialization: string,
        assignedTasks: string[] = [],
        id: string | null = null
    ) {
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.specialization = specialization;
        this.assignedTasks = assignedTasks;
        this.id = id ?? crypto.randomUUID();
    }

    changeData(name: string, surname: string, email: string, specialization: string): void {
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.specialization = specialization;
    }
}