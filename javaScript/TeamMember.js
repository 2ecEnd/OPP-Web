class TeamMember{
    constructor(name, surname, email, specialization, assignedTasks, id = null){
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.specialization = specialization;
        this.assignedTasks = assignedTasks;
        this.id = id != null ? id : crypto.randomUUID();
    }

    changeData(name, surname, email, specialization){
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.specialization = specialization;
    }
}