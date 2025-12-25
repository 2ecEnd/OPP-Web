export declare class TeamMember {
    name: string;
    surname: string;
    email: string | null;
    specialization: string | null;
    assignedTasks: string[];
    id: string;
    constructor(name: string, surname: string, email: string | null, specialization: string | null, assignedTasks?: string[], id?: string | null);
    changeData(name: string, surname: string, email: string | null, specialization: string | null): void;
}
//# sourceMappingURL=TeamMember.d.ts.map