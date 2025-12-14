class Team{
    constructor(name, subjects, members, id = null){
        this.name = name;
        this.subjects = subjects;
        this.members = members;
        this.id = id != null ? id : crypto.randomUUID();
    }
}