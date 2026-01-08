import type { Task } from "./Task.js";
export declare class Subject {
    id: string;
    name: string;
    tasks: Task[];
    teamId: string | null;
    constructor(id: string | null | undefined, name: string, tasks: Task[] | undefined, teamId: string | null);
    changeData(): void;
    addTask(task: Task): void;
    deleteTask(id: string): void;
    changeSubject(newName: string): void;
    deleteSubject(): void;
    getTask(id: string): Task | undefined;
    getTeamName(): string;
}
//# sourceMappingURL=Subject.d.ts.map