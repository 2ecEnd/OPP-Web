class AssignedTask{
    constructor(task, teamMember){
        this.task = task;
        this.teamMember = teamMember;
        this.id = this.id = crypto.randomUUID();
    }
}