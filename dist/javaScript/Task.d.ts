import { Status } from './Enum/Enums.js';
export declare class Task {
    id: string;
    title: string;
    description: string;
    hasDeadline: boolean;
    deadline: Date | string;
    currentDate: Date;
    dependsOn: string[];
    assignedTasks: string[];
    status: Status;
    x: number;
    y: number;
    constructor(id: string | null | undefined, title: string, description: string, hasDeadline: boolean, deadline: (Date | string) | undefined, currentDate: Date, x: number, y: number, dependsOn?: string[], assignedTasks?: string[], status?: Status);
    setStatus(status: Status): void;
    changeTask(title: string, description: string, hasDeadline: boolean, deadline: Date | string): void;
    addDependency(task: Task): void;
    addAssignedTask(assignedTask: string): void;
    deleteTask(): void;
}
//# sourceMappingURL=Task.d.ts.map