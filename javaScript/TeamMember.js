class TeamMember{
    constructor(name, surname, email, specialization){
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.specialization;
        this.id = crypto.randomUUID();
    }
}