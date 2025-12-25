//import type { LinkData } from "./Canvas/LinkController.js";
//import { canvas } from "./InitEditor.js";
//import { SubjectView } from "./SubjectView.js";
import type { Task } from "./Task.js";
import { user } from "./User.js";

export class Subject{

    public id: string;
    public name: string;
    public tasks: Task[];
    public teamId: string | null;
    //private view: SubjectView;

    constructor(id: string | null = null, name: string, tasks: Task[] = [], teamId: string | null){
        this.id = id ?? crypto.randomUUID();
        this.tasks = tasks;
        this.name = name;
        this.teamId = teamId;
        //this.view = new SubjectView(this);
    }

    changeData(): void{
        user.subjectsService.changeSubjectData(this.id, this);
    }

    addTask(task: Task): void{
        this.tasks.push(task);
        this.changeData();
    }

    deleteTask(id: string): void{
        const taskToDelete: Task = this.tasks.find(task => task.id === id)!;
        /*canvas.linkController.links.forEach((link: LinkData) => {
            if (link.startTask === taskToDelete || link.endTask === taskToDelete){
                link.line.remove();
            }
        });*/

        /*canvas.linkController.links = canvas.linkController.links.filter((link: LinkData) => 
            link.startTask !== taskToDelete && link.endTask !== taskToDelete
        );*/

        this.tasks = this.tasks.filter(task => task.id !== id);

        this.tasks.forEach(task => {
            task.dependsOn.filter((t: string) => id !== taskToDelete.id);
        });

        user.subjectsService.changeSubjectData(this.id, this);
    }

    changeSubject(newName: string): void{
        user.subjectsService.changeSubject(this.id, newName);
        this.name = newName;
    }

    deleteSubject(): void{
        user.subjectsService.removeSubject(this.id);
    }

    getTask(id: string): Task | undefined{
        return this.tasks.find(task => task.id === id);
    }
}