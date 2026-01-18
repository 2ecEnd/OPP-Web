import { Status } from './Enum/Enums.js';
export declare class Task {
    id: string;
    title: string;
    description: string;
    hasDeadline: boolean;
    deadline: Date | null;
    currentDate: Date;
    dependsOn: string[];
    assignedTasks: string[];
    status: Status;
    x: number;
    y: number;
    constructor(id: string | null | undefined, title: string, description: string, hasDeadline: boolean, deadline: Date | null, currentDate: Date, x: number, y: number, dependsOn?: string[], assignedTasks?: string[], status?: Status);
    setStatus(status: Status): void;
    changeTask(title: string, description: string, hasDeadline: boolean, deadline: Date | null): void;
    addDependency(task: Task): void;
    addAssignedTask(assignedTask: string): void;
    deleteAssignedTask(assignedTask: string): void;
    deleteDependency(task: Task): void;
    deleteTask(): void;
}
//# sourceMappingURL=Task.d.ts.map