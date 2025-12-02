class Team{
    constructor(name, subjects, members){
        this.name = name;
        this.subjects = subjects;
        this.members = members;
        this.id = crypto.randomUUID();
    }
}