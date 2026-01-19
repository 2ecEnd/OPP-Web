import { user } from "./User.js";
export class Subject {
    id;
    name;
    tasks;
    teamId;
    constructor(id = null, name, tasks = [], teamId) {
        this.id = id ?? crypto.randomUUID();
        this.tasks = tasks;
        this.name = name;
        this.teamId = teamId;
    }
    changeData() {
        user.subjectsService.changeSubjectData(this.id, this);
    }
    addTask(task) {
        this.tasks.push(task);
        this.changeData();
    }
    deleteTask(id) {
        const taskToDelete = this.tasks.find(task => task.id === id);
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
            task.dependsOn = task.dependsOn.filter((t) => t !== id);
        });
        user.subjectsService.changeSubjectData(this.id, this);
    }
    changeSubject(newName) {
        user.subjectsService.changeSubject(this.id, newName);
        this.name = newName;
    }
    setTeam(teamId) {
        this.teamId = teamId;
        this.changeData();
    }
    deleteSubject() {
        user.subjectsService.removeSubject(this.id);
    }
    getTask(id) {
        return this.tasks.find(task => task.id === id);
    }
    getTeamName() {
        if (!this.teamId)
            return "";
        for (let i = 0; i < user.teams.length; ++i) {
            if (user.teams[i]?.id == this.teamId)
                return user.teams[i].name;
        }
        return "";
    }
}
//# sourceMappingURL=Subject.js.map