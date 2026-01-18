export class TeamMember {
    name: string;
    surname: string;
    email: string | null;
    specialization: string | null;
    assignedTasks: string[];
    id: string;

    constructor(
        name: string,
        surname: string,
        email: string | null,
        specialization: string | null,
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

    changeData(name: string, surname: string, email: string | null, specialization: string | null): void {
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.specialization = specialization;
    }

    addAssignedTask(assignedTask: string): void{
        this.assignedTasks.push(assignedTask);
    }

    deleteAssignedTask(assignedTask: string): void{
        for(let i = 0; i < this.assignedTasks.length; ++i){
            if(this.assignedTasks[i] == assignedTask){
                this.assignedTasks.splice(i, 1);
                break;
            }
        }
    }
}